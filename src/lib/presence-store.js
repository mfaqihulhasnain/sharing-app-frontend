import { useSyncExternalStore } from "react";
import {
  getPresenceBootstrap,
  getStoredAccessToken,
} from "@/lib/auth-client";
import { currentUser as fallbackCurrentUser } from "@/lib/mock-data";
import {
  createPresenceSessionKey,
  isRealtimePresenceConfigured,
  subscribeToPresenceChannel,
} from "@/lib/realtime-presence";

const USER_ACCENT_GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-fuchsia-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
];

const GUEST_DISPLAY_NAMES = [
  "Alex",
  "Avery",
  "Blake",
  "Cameron",
  "Casey",
  "Dakota",
  "Elliot",
  "Emerson",
  "Finley",
  "Harper",
  "Jamie",
  "Jordan",
  "Kai",
  "Logan",
  "Morgan",
  "Parker",
  "Quinn",
  "Reese",
  "Riley",
  "Taylor",
];

const PRESENCE_USER_ID_PATTERN = /^u:(\d+)$/;
const PRESENCE_GUEST_ID_PATTERN = /^g:(.+)$/;

const initialState = {
  currentUser: fallbackCurrentUser,
  onlineUsers: [],
  peopleById: createPeopleById([fallbackCurrentUser]),
  topic: "",
  viewerActorId: "",
  status: "idle",
};

let state = { ...initialState };
let runtimeStarted = false;
let runtimeGeneration = 0;
let runtimeSequence = Promise.resolve();
let unsubscribePresence = async () => {};
const listeners = new Set();

function hashString(value) {
  const normalizedValue = typeof value === "string" ? value : String(value || "");
  let hash = 0;

  for (let index = 0; index < normalizedValue.length; index += 1) {
    hash = (hash * 31 + normalizedValue.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getDeterministicGuestLabel(guestId) {
  const baseName =
    guestId && GUEST_DISPLAY_NAMES.length
      ? GUEST_DISPLAY_NAMES[hashString(guestId) % GUEST_DISPLAY_NAMES.length]
      : GUEST_DISPLAY_NAMES[0] || "Guest";

  return `${baseName} (Guest)`;
}

function getAccentForUserId(id) {
  if (typeof id === "number" && Number.isFinite(id)) {
    const index = Math.abs(id) % USER_ACCENT_GRADIENTS.length;
    return USER_ACCENT_GRADIENTS[index];
  }

  if (typeof id === "string" && id.trim()) {
    const hash = id
      .trim()
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0);
    const index = Math.abs(hash) % USER_ACCENT_GRADIENTS.length;
    return USER_ACCENT_GRADIENTS[index];
  }

  return USER_ACCENT_GRADIENTS[0];
}

function toBoardUser(user, fallback = {}) {
  const hasNumericId = typeof user?.id === "number" && Number.isFinite(user.id);
  const hasStringId = typeof user?.id === "string" && user.id.trim().length > 0;
  const resolvedId = hasNumericId
    ? user.id
    : hasStringId
      ? user.id.trim()
      : fallback.id || 0;
  const resolvedName =
    typeof user?.name === "string" && user.name.trim()
      ? user.name.trim()
      : fallback.name || "Unknown user";

  return {
    id: resolvedId,
    name: resolvedName,
    role: fallback.role || (typeof resolvedId === "string" ? "Guest" : "Team member"),
    presence: fallback.presence || "Online now",
    accent: getAccentForUserId(resolvedId),
    email: typeof user?.email === "string" ? user.email : "",
  };
}

function createPeopleById(people) {
  const peopleById = {};

  people.forEach((person) => {
    if (!person || person.id === undefined || person.id === null) {
      return;
    }

    peopleById[String(person.id)] = person;
  });

  return peopleById;
}

function getIdKey(id) {
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  if (typeof id === "string" && id.trim()) return id.trim();
  return "";
}

function flattenPresenceEntries(presenceState) {
  if (!presenceState || typeof presenceState !== "object") {
    return [];
  }

  const actors = [];

  Object.entries(presenceState).forEach(([presenceKey, metas]) => {
    if (!Array.isArray(metas)) {
      return;
    }

    metas.forEach((meta) => {
      if (!meta || typeof meta !== "object") {
        return;
      }

      const actorId =
        typeof meta.actorId === "string" && meta.actorId.trim()
          ? meta.actorId.trim()
          : typeof presenceKey === "string" && presenceKey.trim()
            ? presenceKey.trim()
            : "";

      if (!actorId) {
        return;
      }

      actors.push({
        actorId,
        actorType: meta.actorType === "user" ? "user" : "guest",
        name:
          typeof meta.name === "string" && meta.name.trim()
            ? meta.name.trim()
            : "",
        userId:
          typeof meta.userId === "number" && Number.isInteger(meta.userId)
            ? meta.userId
            : null,
        guestId:
          typeof meta.guestId === "string" && meta.guestId.trim()
            ? meta.guestId.trim()
            : null,
      });
    });
  });

  return actors;
}

function resolveUserIdFromPresenceActor(actor) {
  if (typeof actor?.userId === "number" && Number.isInteger(actor.userId)) {
    return actor.userId;
  }

  if (typeof actor?.actorId !== "string") {
    return null;
  }

  const match = PRESENCE_USER_ID_PATTERN.exec(actor.actorId);
  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function resolveGuestIdFromPresenceActor(actor) {
  if (typeof actor?.guestId === "string" && actor.guestId.trim()) {
    return actor.guestId.trim();
  }

  if (typeof actor?.actorId !== "string") {
    return "";
  }

  const match = PRESENCE_GUEST_ID_PATTERN.exec(actor.actorId);
  return match ? match[1].trim() : "";
}

function toInternalStatus(status) {
  if (!status) return "idle";
  return String(status).toLowerCase();
}

function emit() {
  listeners.forEach((listener) => {
    listener();
  });
}

function setState(nextState) {
  state = {
    ...state,
    ...nextState,
  };
  emit();
}

async function teardownPresenceSubscription() {
  const teardown = unsubscribePresence;
  unsubscribePresence = async () => {};
  await teardown();
}

function buildOnlineUsers({ actors, viewerActorId }) {
  const uniqueActors = new Map();

  actors.forEach((actor) => {
    if (actor.actorId === viewerActorId) {
      return;
    }

    if (!uniqueActors.has(actor.actorId)) {
      uniqueActors.set(actor.actorId, actor);
    }
  });

  const onlineUsers = [];

  uniqueActors.forEach((actor) => {
    if (actor.actorType === "user") {
      const userId = resolveUserIdFromPresenceActor(actor);
      const actorName =
        typeof actor.name === "string" && actor.name.trim()
          ? actor.name.trim()
          : "Team member";
      const actorUserId = Number.isInteger(userId) ? userId : actor.actorId;

      onlineUsers.push(
        toBoardUser(
          {
            id: actorUserId,
            name: actorName,
          },
          {
            id: actorUserId,
            name: actorName,
            role: "Team member",
            presence: "Online now",
          },
        ),
      );
      return;
    }

    const guestId = resolveGuestIdFromPresenceActor(actor);
    if (!guestId) {
      return;
    }

    const label = getDeterministicGuestLabel(guestId);
    const guestActorId = actor.actorId || `g:${guestId}`;

    onlineUsers.push(
      toBoardUser(
        {
          id: guestActorId,
          name: label,
        },
        {
          id: guestActorId,
          name: label,
          role: "Guest",
          presence: "Online now",
        },
      ),
    );
  });

  onlineUsers.sort((left, right) => {
    const byName = left.name.localeCompare(right.name);
    if (byName !== 0) return byName;
    return getIdKey(left.id).localeCompare(getIdKey(right.id));
  });

  return onlineUsers;
}

async function bootstrapAndSubscribe(generation) {
  setState({
    status: "bootstrapping",
  });

  const accessToken = getStoredAccessToken() || undefined;
  const presenceBootstrap = await getPresenceBootstrap({ accessToken });
  if (!runtimeStarted || generation !== runtimeGeneration) {
    return;
  }

  const presenceViewer = presenceBootstrap?.viewer || null;
  const presenceTopic = presenceBootstrap?.topic || "";

  const guestSelfId =
    typeof presenceViewer?.actorId === "string" && presenceViewer.actorId.trim()
      ? presenceViewer.actorId.trim()
      : `g:self-${Date.now()}`;
  const guestSelfLabel =
    presenceViewer?.actorType === "guest"
      ? getDeterministicGuestLabel(resolveGuestIdFromPresenceActor({ actorId: guestSelfId }))
      : fallbackCurrentUser.name;
  const guestSelfUser = toBoardUser(
    { id: guestSelfId, name: guestSelfLabel },
    {
      ...fallbackCurrentUser,
      id: guestSelfId,
      role: "Guest",
      presence: "Online now",
    },
  );

  const resolvedCurrentUser =
    presenceViewer?.actorType === "user" && presenceViewer?.user
      ? toBoardUser(presenceViewer.user, fallbackCurrentUser)
      : guestSelfUser;
  const viewerActorId =
    typeof presenceViewer?.actorId === "string" && presenceViewer.actorId.trim()
      ? presenceViewer.actorId.trim()
      : typeof resolvedCurrentUser.id === "number"
        ? `u:${resolvedCurrentUser.id}`
        : String(resolvedCurrentUser.id);

  setState({
    currentUser: resolvedCurrentUser,
    onlineUsers: [],
    peopleById: createPeopleById([resolvedCurrentUser]),
    topic: presenceTopic,
    viewerActorId,
    status: !presenceTopic || !isRealtimePresenceConfigured() ? "ready" : "connecting",
  });

  if (!presenceTopic || !isRealtimePresenceConfigured()) {
    return;
  }

  const guestIdFromBootstrap =
    typeof presenceBootstrap?.presence?.guestId === "string" &&
    presenceBootstrap.presence.guestId.trim()
      ? presenceBootstrap.presence.guestId.trim()
      : resolveGuestIdFromPresenceActor({ actorId: viewerActorId });
  const presenceKeyBase =
    typeof presenceBootstrap?.presence?.presenceKeyBase === "string" &&
    presenceBootstrap.presence.presenceKeyBase.trim()
      ? presenceBootstrap.presence.presenceKeyBase.trim()
      : viewerActorId;

  const presencePayload = {
    actorType: presenceViewer?.actorType === "user" ? "user" : "guest",
    actorId: viewerActorId,
    userId: typeof resolvedCurrentUser.id === "number" ? resolvedCurrentUser.id : null,
    guestId: guestIdFromBootstrap || null,
    name: resolvedCurrentUser.name,
    verified: Boolean(presenceViewer?.user?.emailVerifiedAt),
    onlineAt: new Date().toISOString(),
  };

  unsubscribePresence = subscribeToPresenceChannel({
    topic: presenceTopic,
    presenceKey: createPresenceSessionKey(presenceKeyBase),
    payload: presencePayload,
    onStatusChange: (channelStatus) => {
      if (!runtimeStarted || generation !== runtimeGeneration) {
        return;
      }

      setState({
        status: toInternalStatus(channelStatus),
      });
    },
    onPresenceSync: (presenceState) => {
      if (!runtimeStarted || generation !== runtimeGeneration) {
        return;
      }

      const actors = flattenPresenceEntries(presenceState);
      const onlineUsers = buildOnlineUsers({
        actors,
        viewerActorId,
      });

      setState({
        currentUser: resolvedCurrentUser,
        onlineUsers,
        peopleById: createPeopleById([resolvedCurrentUser, ...onlineUsers]),
        topic: presenceTopic,
        viewerActorId,
      });
    },
  });
}

function enqueueRuntimeOperation(operation) {
  runtimeSequence = runtimeSequence.then(operation, operation);
  return runtimeSequence;
}

export function startPresenceRuntime() {
  return enqueueRuntimeOperation(async () => {
    if (runtimeStarted) {
      return;
    }

    runtimeStarted = true;
    runtimeGeneration += 1;
    const generation = runtimeGeneration;

    await teardownPresenceSubscription();

    try {
      await bootstrapAndSubscribe(generation);
    } catch (_error) {
      if (!runtimeStarted || generation !== runtimeGeneration) {
        return;
      }

      setState({
        status: "error",
        topic: "",
        viewerActorId: "",
        onlineUsers: [],
        peopleById: createPeopleById([state.currentUser || fallbackCurrentUser]),
      });
    }
  });
}

export function restartPresenceRuntime() {
  return enqueueRuntimeOperation(async () => {
    runtimeStarted = true;
    runtimeGeneration += 1;
    const generation = runtimeGeneration;

    await teardownPresenceSubscription();

    try {
      await bootstrapAndSubscribe(generation);
    } catch (_error) {
      if (!runtimeStarted || generation !== runtimeGeneration) {
        return;
      }

      setState({
        status: "error",
        topic: "",
        viewerActorId: "",
        onlineUsers: [],
        peopleById: createPeopleById([state.currentUser || fallbackCurrentUser]),
      });
    }
  });
}

export function stopPresenceRuntime() {
  return enqueueRuntimeOperation(async () => {
    runtimeStarted = false;
    runtimeGeneration += 1;

    await teardownPresenceSubscription();

    const preservedCurrentUser = state.currentUser || fallbackCurrentUser;
    setState({
      currentUser: preservedCurrentUser,
      onlineUsers: [],
      peopleById: createPeopleById([preservedCurrentUser]),
      topic: "",
      viewerActorId: "",
      status: "idle",
    });
  });
}

export function subscribePresenceState(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readPresenceState() {
  return state;
}

export function usePresenceState() {
  return useSyncExternalStore(
    subscribePresenceState,
    readPresenceState,
    () => initialState,
  );
}

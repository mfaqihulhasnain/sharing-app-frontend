"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { ShareComposer } from "@/components/share-board/share-composer";
import { SharedBoard } from "@/components/share-board/shared-board";
import { UsersSidebar } from "@/components/share-board/users-sidebar";
import {
  getPresenceBootstrap,
  getStoredAccessToken,
  getUsersDirectory,
  getUsersMe,
} from "@/lib/auth-client";
import {
  currentUser as fallbackCurrentUser,
  initialShares,
} from "@/lib/mock-data";
import {
  createPresenceSessionKey,
  isRealtimePresenceConfigured,
  subscribeToPresenceChannel,
} from "@/lib/realtime-presence";
import { canUserSeeShare } from "@/lib/utils";

const USER_ACCENT_GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-fuchsia-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
];
const GUEST_NAME_ADJECTIVES = [
  "Swift",
  "Calm",
  "Bright",
  "Brisk",
  "Merry",
  "Gentle",
  "Lucky",
  "Bold",
  "Cozy",
  "Sunny",
];
const GUEST_NAME_NOUNS = [
  "Sparrow",
  "Falcon",
  "Otter",
  "Comet",
  "Pine",
  "River",
  "Nimbus",
  "Dawn",
  "Maple",
  "Harbor",
];
const GUEST_LABEL_MAP_STORAGE_KEY = "sharing-board.guest-label-map";
const PRESENCE_USER_ID_PATTERN = /^u:(\d+)$/;
const PRESENCE_GUEST_ID_PATTERN = /^g:(.+)$/;

let nextAttachmentId = 1;
let nextShareId =
  initialShares.reduce(
    (maxId, share) => Math.max(maxId, Number(share.id) || 0),
    0,
  ) + 1;

function allocateAttachmentId() {
  const id = nextAttachmentId;
  nextAttachmentId += 1;
  return id;
}

function allocateShareId() {
  const id = nextShareId;
  nextShareId += 1;
  return id;
}

function createAttachmentRecord(file) {
  return {
    id: allocateAttachmentId(),
    name: file.name,
    size: file.size,
    type: file.type,
    sourceFile: file,
  };
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
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

  const index = 0;
  return USER_ACCENT_GRADIENTS[index];
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
    presence: fallback.presence || "Available",
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

function isDummySeedUser(user) {
  return typeof user?.email === "string" && user.email.endsWith("@sharing.local");
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

export function ShareBoardShell() {
  const [shares, setShares] = useState(initialShares);
  const [currentUser, setCurrentUser] = useState(fallbackCurrentUser);
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [peopleById, setPeopleById] = useState(() =>
    createPeopleById([fallbackCurrentUser])
  );
  const [draftText, setDraftText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const composerRef = useRef(null);
  const sidebarRef = useRef(null);
  const guestLabelMapRef = useRef({});

  useEffect(() => {
    let active = true;
    let unsubscribePresence = async () => {};

    const loadGuestLabelState = () => {
      if (typeof window === "undefined") {
        guestLabelMapRef.current = {};
        return;
      }

      try {
        const rawValue = window.sessionStorage.getItem(GUEST_LABEL_MAP_STORAGE_KEY);
        const parsed = rawValue ? JSON.parse(rawValue) : {};
        const restoredMap = parsed && typeof parsed === "object" ? parsed : {};
        guestLabelMapRef.current = restoredMap;
      } catch (_error) {
        guestLabelMapRef.current = {};
      }
    };

    const persistGuestLabelState = () => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        window.sessionStorage.setItem(
          GUEST_LABEL_MAP_STORAGE_KEY,
          JSON.stringify(guestLabelMapRef.current),
        );
      } catch (_error) {
        // Ignore storage-write errors in private mode or restrictive browsers.
      }
    };

    const getGuestLabel = (guestId) => {
      if (!guestId) {
        return "Visitor (Guest)";
      }

      const existingLabel = guestLabelMapRef.current[guestId];
      const isLegacyNumberedLabel =
        typeof existingLabel === "string" && /^Guest \d+$/.test(existingLabel);
      if (existingLabel && !isLegacyNumberedLabel) {
        return existingLabel;
      }

      const usedLabels = new Set(
        Object.values(guestLabelMapRef.current).filter(
          (value) => typeof value === "string" && value.trim(),
        ),
      );
      const totalCombinations = GUEST_NAME_ADJECTIVES.length * GUEST_NAME_NOUNS.length;
      let nextLabel = "";

      for (let attempt = 0; attempt < totalCombinations; attempt += 1) {
        const adjective =
          GUEST_NAME_ADJECTIVES[Math.floor(Math.random() * GUEST_NAME_ADJECTIVES.length)];
        const noun = GUEST_NAME_NOUNS[Math.floor(Math.random() * GUEST_NAME_NOUNS.length)];
        const candidate = `${adjective} ${noun} (Guest)`;
        if (!usedLabels.has(candidate)) {
          nextLabel = candidate;
          break;
        }
      }

      if (!nextLabel) {
        const fallbackCode = Math.random().toString(36).slice(2, 6).toUpperCase();
        nextLabel = `Visitor ${fallbackCode} (Guest)`;
      }

      guestLabelMapRef.current[guestId] = nextLabel;
      persistGuestLabelState();

      return nextLabel;
    };

    const mapVerifiedDirectoryUsers = (directoryResult, meUserId) =>
      Array.isArray(directoryResult?.users)
        ? directoryResult.users
            .map((user) => toBoardUser(user))
            .filter((user) => !isDummySeedUser(user))
            .filter((user) =>
              meUserId ? getIdKey(user.id) !== getIdKey(meUserId) : true
            )
        : [];

    loadGuestLabelState();

    const loadLiveUsers = async () => {
      const accessToken = getStoredAccessToken();

      try {
        const requestAccessToken = accessToken || undefined;
        const shouldLoadMe = Boolean(accessToken);
        const requests = shouldLoadMe
          ? [
              getUsersMe({ accessToken: requestAccessToken }),
              getUsersDirectory({
                accessToken: requestAccessToken,
                includeMe: false,
                page: 1,
                limit: 100,
              }),
              getPresenceBootstrap({ accessToken: requestAccessToken }),
            ]
          : [
              getUsersDirectory({
                includeMe: false,
                page: 1,
                limit: 100,
              }),
              getPresenceBootstrap({}),
            ];

        const responses = await Promise.all(requests);

        if (!active) {
          return;
        }

        const meResult = shouldLoadMe ? responses[0] : null;
        const directoryResult = shouldLoadMe ? responses[1] : responses[0];
        const presenceBootstrap = shouldLoadMe ? responses[2] : responses[1];
        const presenceViewer = presenceBootstrap?.viewer || null;
        const presenceTopic = presenceBootstrap?.topic || "";

        const meUser = meResult?.user
          ? toBoardUser(meResult.user, fallbackCurrentUser)
          : null;
        const guestSelfId =
          typeof presenceViewer?.actorId === "string" && presenceViewer.actorId.trim()
            ? presenceViewer.actorId.trim()
            : `g:self-${Date.now()}`;
        const guestSelfUser = toBoardUser(
          { id: guestSelfId, name: fallbackCurrentUser.name },
          {
            ...fallbackCurrentUser,
            id: guestSelfId,
            role: "Guest",
            presence: "Online now",
          },
        );
        const resolvedCurrentUser = meUser || guestSelfUser;
        const verifiedDirectoryUsers = mapVerifiedDirectoryUsers(
          directoryResult,
          resolvedCurrentUser.id,
        );
        const verifiedUsersById = new Map(
          verifiedDirectoryUsers
            .filter((user) => typeof user.id === "number")
            .map((user) => [user.id, user]),
        );
        const fallbackAudienceUsers = verifiedDirectoryUsers.filter(
          (user) => getIdKey(user.id) !== getIdKey(resolvedCurrentUser.id),
        );

        setCurrentUser(resolvedCurrentUser);
        setDirectoryUsers(fallbackAudienceUsers);
        setPeopleById(createPeopleById([resolvedCurrentUser, ...verifiedDirectoryUsers]));

        if (!presenceTopic || !isRealtimePresenceConfigured()) {
          setSelectedUserIds((currentSelection) =>
            currentSelection.filter((id) =>
              fallbackAudienceUsers.some((user) => getIdKey(user.id) === getIdKey(id)),
            ),
          );
          return;
        }

        const viewerActorId =
          typeof presenceViewer?.actorId === "string" && presenceViewer.actorId.trim()
            ? presenceViewer.actorId.trim()
            : typeof resolvedCurrentUser.id === "number"
              ? `u:${resolvedCurrentUser.id}`
              : String(resolvedCurrentUser.id);
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
          onPresenceSync: (presenceState) => {
            if (!active) {
              return;
            }

            const actors = flattenPresenceEntries(presenceState);
            const uniqueActors = new Map();
            actors.forEach((actor) => {
              if (!uniqueActors.has(actor.actorId)) {
                uniqueActors.set(actor.actorId, actor);
              }
            });

            const onlineUsers = [];

            uniqueActors.forEach((actor) => {
              if (actor.actorId === viewerActorId) {
                return;
              }

              if (actor.actorType === "user") {
                const userId = resolveUserIdFromPresenceActor(actor);
                if (!Number.isInteger(userId)) {
                  return;
                }

                const verifiedUser = verifiedUsersById.get(userId);
                if (!verifiedUser) {
                  return;
                }

                onlineUsers.push(verifiedUser);
                return;
              }

              const guestId = resolveGuestIdFromPresenceActor(actor);
              if (!guestId) {
                return;
              }

              const label = getGuestLabel(guestId);
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

            setDirectoryUsers(onlineUsers);
            setPeopleById(
              createPeopleById([resolvedCurrentUser, ...verifiedDirectoryUsers, ...onlineUsers]),
            );
            setSelectedUserIds((currentSelection) => {
              const allowedIdKeys = new Set(onlineUsers.map((user) => getIdKey(user.id)));
              return currentSelection.filter((id) => allowedIdKeys.has(getIdKey(id)));
            });
          },
        });

      } catch (_error) {
        if (!active) {
          return;
        }

        setCurrentUser(fallbackCurrentUser);
        setDirectoryUsers([]);
        setPeopleById(createPeopleById([fallbackCurrentUser]));
      }
    };

    loadLiveUsers();

    return () => {
      active = false;
      void unsubscribePresence();
    };
  }, []);

  const selectedUsers = useMemo(
    () => directoryUsers.filter((user) => selectedUserIds.includes(user.id)),
    [directoryUsers, selectedUserIds]
  );

  const visibleShares = shares
    .filter((item) => canUserSeeShare(item, currentUser.id))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  const toggleUser = (userId) => {
    setSelectedUserIds((currentSelection) =>
      currentSelection.includes(userId)
        ? currentSelection.filter((id) => id !== userId)
        : [...currentSelection, userId],
    );
  };

  const handleFilesAdded = (acceptedFiles) => {
    setAttachments((currentFiles) => [
      ...currentFiles,
      ...acceptedFiles.map(createAttachmentRecord),
    ]);
  };

  const handleRemoveFile = (fileId) => {
    setAttachments((currentFiles) =>
      currentFiles.filter((file) => file.id !== fileId),
    );
  };

  const handleClearFiles = () => {
    setAttachments([]);
  };

  const handleShare = async () => {
    const trimmedText = draftText.trim();

    if (!trimmedText && attachments.length === 0) {
      toast.error("Add a note or at least one file before sharing.");
      return;
    }

    setIsSharing(true);
    await wait(220);

    const createdAt = new Date().toISOString();
    const audienceIds = [...selectedUserIds];
    const destinationNames = directoryUsers
      .filter((user) => audienceIds.includes(user.id))
      .map((user) => user.name);
    const newShare = {
      id: allocateShareId(),
      senderId: currentUser.id,
      createdAt,
      audienceIds,
      text: trimmedText,
      files: attachments.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        sourceFile: file.sourceFile,
      })),
    };

    setShares((currentShares) => [newShare, ...currentShares]);
    setDraftText("");
    setAttachments([]);
    setSelectedUserIds([]);
    setIsSharing(false);

    const destinationLabel =
      audienceIds.length === 0
        ? "everyone on the board"
        : destinationNames.join(", ");

    toast.success(
      `Shared with ${destinationLabel}`,
    );
  };

  const handleOpenAudience = () => {
    sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-3 sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-8rem] top-28 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute right-[-6rem] top-40 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-3)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-4">
        <EnterpriseNavbar />

        <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="space-y-3.5">
            <div ref={composerRef}>
              <ShareComposer
                draftText={draftText}
                onDraftTextChange={setDraftText}
                attachments={attachments}
                onFilesAdded={handleFilesAdded}
                onRemoveFile={handleRemoveFile}
                onClearFiles={handleClearFiles}
                onSubmit={handleShare}
                selectedUsers={selectedUsers}
                selectedUserIds={selectedUserIds}
                onRemoveAudienceUser={(userId) =>
                  setSelectedUserIds((currentSelection) =>
                    currentSelection.filter((id) => id !== userId),
                  )
                }
                onClearAudience={() => setSelectedUserIds([])}
                peopleById={peopleById}
                isSharing={isSharing}
                onOpenAudience={handleOpenAudience}
              />
            </div>
            <SharedBoard
              items={visibleShares}
              peopleById={peopleById}
              viewerUserId={currentUser.id}
            />
          </div>

          <aside ref={sidebarRef}>
            <UsersSidebar
              currentUser={currentUser}
              users={directoryUsers}
              selectedUserIds={selectedUserIds}
              onToggleUser={toggleUser}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}

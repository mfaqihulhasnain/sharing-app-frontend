import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

let sharedClient = null;

function getRealtimeClient() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return null;
  }

  if (!sharedClient) {
    sharedClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return sharedClient;
}

export function isRealtimePresenceConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export function createPresenceSessionKey(baseKey) {
  const randomPart =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return `${baseKey}:${randomPart}`;
}

export function subscribeToPresenceChannel({
  topic,
  presenceKey,
  payload,
  onPresenceSync,
  onStatusChange,
  onBroadcast,
}) {
  const client = getRealtimeClient();
  if (!client) {
    throw new Error("Supabase realtime presence is not configured.");
  }

  const channel = client.channel(topic, {
    config: {
      presence: {
        key: presenceKey,
      },
    },
  });

  const publishCurrentState = () => {
    const state = channel.presenceState();
    onPresenceSync?.(state);
  };

  channel
    .on("presence", { event: "sync" }, publishCurrentState)
    .on("presence", { event: "join" }, publishCurrentState)
    .on("presence", { event: "leave" }, publishCurrentState)
    .on("broadcast", { event: "*" }, (message) => {
      onBroadcast?.(
        typeof message?.event === "string" ? message.event : "",
        message?.payload
      );
    });

  channel.subscribe(async (status) => {
    onStatusChange?.(status);

    if (status === "SUBSCRIBED") {
      await channel.track(payload);
      publishCurrentState();
    }
  });

  return async () => {
    try {
      await channel.untrack();
    } catch (_error) {
      // Ignore untrack failures while tearing down.
    }

    await client.removeChannel(channel);
  };
}

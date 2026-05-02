"use client";

import { useEffect } from "react";
import {
  getStoredAccessToken,
  subscribeToAuthTokenChanges,
} from "@/lib/auth-client";
import {
  restartPresenceRuntime,
  startPresenceRuntime,
  stopPresenceRuntime,
} from "@/lib/presence-store";

export function AppPresenceProvider({ children }) {
  useEffect(() => {
    let active = true;
    let hasToken = Boolean(getStoredAccessToken());

    void startPresenceRuntime();
    const unsubscribeTokenChanges = subscribeToAuthTokenChanges((detail) => {
      if (!active) {
        return;
      }

      const nextHasToken =
        typeof detail?.hasToken === "boolean"
          ? detail.hasToken
          : Boolean(getStoredAccessToken());
      if (nextHasToken === hasToken) {
        return;
      }

      hasToken = nextHasToken;
      void restartPresenceRuntime();
    });

    return () => {
      active = false;
      unsubscribeTokenChanges();
      void stopPresenceRuntime();
    };
  }, []);

  return children;
}

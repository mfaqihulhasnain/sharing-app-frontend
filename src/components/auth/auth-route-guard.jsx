"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearStoredAccessToken,
  getCurrentUser,
  getStoredAccessToken,
  isUnauthorizedAuthError,
} from "@/lib/auth-client";

export function AuthRouteGuard({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    const checkAuthentication = async () => {
      const accessToken = getStoredAccessToken();

      if (!accessToken) {
        if (active) {
          setIsChecking(false);
        }
        return;
      }

      try {
        const data = await getCurrentUser({ accessToken });

        if (!active) {
          return;
        }

        if (data?.user) {
          router.replace("/");
          router.refresh();
          return;
        }

        clearStoredAccessToken();
      } catch (error) {
        if (!active) {
          return;
        }

        if (isUnauthorizedAuthError(error)) {
          clearStoredAccessToken();
        }
      }

      if (active) {
        setIsChecking(false);
      }
    };

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [router]);

  if (isChecking) {
    return (
      <div className="relative h-dvh overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 [@media(max-height:780px)]:px-3 [@media(max-height:780px)]:py-3">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-20 top-16 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "var(--bg-orb-1)" }}
          />
          <div
            className="absolute -right-12 top-28 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "var(--bg-orb-2)" }}
          />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-[470px] items-center">
          <div className="w-full rounded-[28px] border border-line/90 bg-card-strong px-5 py-6 shadow-board sm:px-7 sm:py-7 [@media(max-height:860px)]:px-4 [@media(max-height:860px)]:py-4">
            <div className="space-y-4 [@media(max-height:860px)]:space-y-3">
              <div className="h-5 w-28 animate-pulse rounded-md bg-card-muted" />
              <div className="h-11 animate-pulse rounded-xl bg-card-muted" />
              <div className="h-11 animate-pulse rounded-xl bg-card-muted" />
              <div className="h-11 animate-pulse rounded-xl bg-card-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

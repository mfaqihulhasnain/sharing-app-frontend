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
    return null;
  }

  return children;
}

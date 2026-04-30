"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { bootstrapSessionFromRefresh } from "@/lib/auth-client";

const GOOGLE_AUTH_FAILURE_MESSAGE = "Google sign-in failed. Please try again.";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let active = true;

    const finalizeGoogleSignIn = async () => {
      const reason = searchParams.get("reason");
      if (reason) {
        toast.error(GOOGLE_AUTH_FAILURE_MESSAGE);
        router.replace("/login");
        return;
      }

      try {
        await bootstrapSessionFromRefresh();

        if (!active) {
          return;
        }

        router.replace("/");
        router.refresh();
      } catch (_error) {
        if (!active) {
          return;
        }

        toast.error(GOOGLE_AUTH_FAILURE_MESSAGE);
        router.replace("/login");
        router.refresh();
      }
    };

    finalizeGoogleSignIn();

    return () => {
      active = false;
    };
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="inline-flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Completing Google sign-in...
      </div>
    </main>
  );
}

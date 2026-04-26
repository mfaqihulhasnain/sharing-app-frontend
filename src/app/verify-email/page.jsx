"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { getAuthErrorMessage, verifyEmailToken } from "@/lib/auth-client";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    const runVerification = async () => {
      if (!token) {
        if (active) {
          setStatus("error");
          setMessage("Verification token is missing. Request a new verification email.");
        }
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        await verifyEmailToken({ token });

        if (!active) {
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully. You can now sign in.");
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(getAuthErrorMessage(error));
      }
    };

    runVerification();

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <AuthShell
      title="Verify your email"
      description="We are confirming your account so you can start using Sharing Board."
      footer={
        <>
          Back to <Link href="/login">Login</Link>
        </>
      }
    >
      <div className="space-y-4">
        {status === "loading" ? (
          <div className="rounded-lg border border-line/80 bg-card-muted/50 px-3 py-2.5 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying your email...
            </span>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-600">
            {message}
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            {message}
          </div>
        ) : null}

        <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    </AuthShell>
  );
}

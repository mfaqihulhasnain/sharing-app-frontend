"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  clearStoredAccessToken,
  getAuthErrorMessage,
  getStoredAccessToken,
  updateUsersMe,
} from "@/lib/auth-client";
import {
  clearCurrentUserState,
  loadCurrentUser,
  readCurrentUserState,
  setCurrentUserState,
  subscribeCurrentUser,
} from "@/lib/current-user-store";

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ProfilePageClient() {
  const router = useRouter();
  const initialUserState = readCurrentUserState();
  const [isLoading, setIsLoading] = useState(
    () => initialUserState.isLoading || !initialUserState.hasResolved,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUserState.user);
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    let active = true;
    const applyUserState = (nextState) => {
      if (!active) {
        return;
      }

      const hasToken = Boolean(getStoredAccessToken());
      setCurrentUser(nextState.user);
      setIsLoading(nextState.isLoading || (!nextState.hasResolved && hasToken));
    };

    applyUserState(readCurrentUserState());
    const unsubscribe = subscribeCurrentUser(applyUserState);

    const loadProfile = async () => {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        unsubscribe();
        setIsLoading(false);
        router.replace("/login");
        return;
      }

      try {
        const user = await loadCurrentUser();
        if (!active) {
          return;
        }

        if (!user) {
          unsubscribe();
          router.replace("/login");
          return;
        }
      } catch (error) {
        if (!active) {
          return;
        }

        toast.error(getAuthErrorMessage(error));
      }
    };

    void loadProfile();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const resolvedName = typeof currentUser.name === "string" ? currentUser.name : "";
    setName(resolvedName);
    setInitialName(resolvedName);
  }, [currentUser]);

  const trimmedName = name.trim();
  const isNameValid = trimmedName.length >= 2 && trimmedName.length <= 80;
  const isDirty = trimmedName !== initialName.trim();
  const canSave = !isSaving && isDirty && isNameValid;

  const verificationLabel = useMemo(() => {
    if (!currentUser?.emailVerifiedAt) {
      return "Not verified";
    }

    return `Verified on ${formatDate(currentUser.emailVerifiedAt)}`;
  }, [currentUser?.emailVerifiedAt]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!canSave) {
      return;
    }

    const accessToken = getStoredAccessToken();
    if (!accessToken) {
      clearStoredAccessToken();
      clearCurrentUserState();
      router.replace("/login");
      return;
    }

    setIsSaving(true);

    try {
      const data = await updateUsersMe({
        accessToken,
        name: trimmedName,
      });
      const user = data?.user || null;
      if (!user) {
        throw new Error("Invalid profile response.");
      }

      setCurrentUserState(user);
      toast.success("Profile updated");
    } catch (error) {
      if (error?.statusCode === 401) {
        clearStoredAccessToken();
        clearCurrentUserState();
        router.replace("/login");
        return;
      }

      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-3 sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-28 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute -right-24 top-40 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-3)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-330 flex-col gap-4">
        <EnterpriseNavbar />

        <main className="mx-auto w-full max-w-3xl">
          <Card className="rounded-2xl border-line/90 bg-card-strong">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-xl">Profile</CardTitle>
              <CardDescription>Update your account details.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 p-5 pt-0">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading profile...
                </div>
              ) : currentUser ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="profile-name" className="text-sm font-medium text-foreground">
                      Name
                    </label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      maxLength={80}
                      disabled={isSaving}
                    />
                    {!isNameValid ? (
                      <p className="text-xs text-destructive">
                        Name must be between 2 and 80 characters.
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="rounded-lg border border-line/80 bg-card-muted/70 px-3 py-2 text-sm text-muted">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-line/80 bg-card-muted/70 px-3 py-2">
                      <p className="text-xs text-muted">Verification</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {verificationLabel}
                      </p>
                    </div>
                    <div className="rounded-lg border border-line/80 bg-card-muted/70 px-3 py-2">
                      <p className="text-xs text-muted">Member Since</p>
                      <p className="mt-0.5 text-sm font-medium text-foreground">
                        {formatDate(currentUser.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={!canSave}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-muted">Unable to load profile.</p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

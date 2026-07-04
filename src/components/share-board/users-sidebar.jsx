import { motion } from "framer-motion";
import { Check, Radio, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getInitials } from "@/lib/utils";

export function UsersSidebar({
  currentUser,
  users,
  selectedUserIds,
  onToggleUser,
  isHydrating = false,
}) {
  const skeletonRows = 3;
  const selectedCount = selectedUserIds.length;

  return (
    <div className="space-y-3 xl:sticky xl:top-20">
      <Card className="overflow-hidden rounded-[28px] border-line/90 bg-card-strong shadow-[0_18px_42px_rgba(15,23,42,0.07)]">
        <CardHeader className="gap-3 border-b border-line/70 bg-card-muted/30 p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-accent-border bg-accent-soft text-accent">
                  <UsersRound className="h-4 w-4" />
                </span>
                <CardTitle className="text-base tracking-tight">
                  Online users
                </CardTitle>
              </div>
              <CardDescription className="mt-2 text-xs leading-5">
                Choose who should see this share.
              </CardDescription>
            </div>
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-success-border bg-success-soft px-2.5 py-1 text-xs font-medium text-success-text">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/55" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {isHydrating ? "..." : `${users.length + 1} live`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-line/75 bg-card px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                Selected
              </p>
              <p className="mt-1 text-base font-semibold tracking-tight text-foreground">
                {selectedCount || "All"}
              </p>
            </div>
            <div className="rounded-2xl border border-line/75 bg-card px-3 py-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                Status
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-base font-semibold tracking-tight text-foreground">
                <Radio className="h-3.5 w-3.5 text-accent" />
                {isHydrating ? "Syncing" : "Live"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5 px-4 pb-4 pt-4">
          {isHydrating ? (
            <div className="space-y-2">
              {Array.from({ length: skeletonRows }).map((_, index) => (
                <div
                  key={`online-user-skeleton-${index + 1}`}
                  className="flex animate-pulse items-center gap-2.5 rounded-2xl border border-line/80 bg-card-muted/65 px-2.5 py-2.5"
                >
                  <div className="h-9 w-9 rounded-xl bg-card-muted" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 w-24 rounded bg-card-muted" />
                    <div className="h-2.5 w-16 rounded bg-card-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 rounded-2xl border border-line/80 bg-card-muted/70 px-2.5 py-2.5">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-semibold text-white shadow-sm ring-1 ring-white/35",
                    currentUser.accent,
                  )}
                >
                  {getInitials(currentUser.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {currentUser.name}
                    </p>
                    <Badge variant="accent" className="px-1.5 py-0.5 text-[10px]">
                      You
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted">Current session</p>
                </div>
              </div>

              <div id="online-users-list" className="space-y-1.5">
                {users.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-line bg-card-muted/55 px-3 py-4 text-center text-xs leading-5 text-muted">
                    No other people are online yet.
                  </div>
                ) : (
                  users.map((user, index) => {
                    const isSelected = selectedUserIds.includes(user.id);

                    return (
                      <motion.button
                        key={user.id}
                        type="button"
                        onClick={() => onToggleUser(user.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-2xl border px-2.5 py-2.5 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20",
                          isSelected
                            ? "border-accent-border bg-accent-soft/80 shadow-sm"
                            : "border-line bg-card-muted/55 hover:border-line/90 hover:bg-card",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-semibold text-white shadow-sm ring-1 ring-white/35",
                            user.accent,
                          )}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted">
                            Available for this share
                          </p>
                        </div>
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                            isSelected
                              ? "border-accent bg-accent text-white"
                              : "border-line bg-card text-transparent",
                          )}
                          aria-hidden="true"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </motion.button>
                    );
                  })
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


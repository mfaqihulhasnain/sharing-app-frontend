import { motion } from "framer-motion";
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

  return (
    <div className="space-y-3.5 xl:sticky xl:top-20">
      <Card className="rounded-2xl border-line/90 bg-card-strong">
        <CardHeader className="gap-2 p-4 pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Online right now</CardTitle>
              <CardDescription>
                Everyone on this Wi-Fi who can be included.
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-soft-emerald px-2.5 py-1 text-xs font-medium text-success-text">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/55" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {isHydrating ? "..." : `${users.length + 1} live`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 px-4 pb-4 pt-0">
          {isHydrating ? (
            <div className="space-y-2">
              {Array.from({ length: skeletonRows }).map((_, index) => (
                <div
                  key={`online-user-skeleton-${index + 1}`}
                  className="flex items-center gap-2 rounded-lg border border-line/80 bg-card-muted/70 px-2.5 py-2"
                >
                  <div className="h-8 w-8 animate-pulse rounded-lg bg-card-muted" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3 w-24 animate-pulse rounded bg-card-muted" />
                    <div className="h-2.5 w-16 animate-pulse rounded bg-card-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-line/80 bg-card-muted/70 px-2.5 py-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-semibold text-white shadow-sm",
                    currentUser.accent,
                  )}
                >
                  {getInitials(currentUser.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-medium text-foreground">
                      {currentUser.name}
                    </p>
                    <Badge variant="accent" className="px-1.5 py-0.5 text-[10px]">
                      You
                    </Badge>
                  </div>
                </div>
              </div>

              <div id="online-users-list" className="space-y-1">
                {users.map((user, index) => {
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
                        "flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition duration-150",
                        isSelected
                          ? "border-accent-border bg-soft-blue/65"
                          : "border-line bg-card-muted/70 hover:bg-card",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-semibold text-white shadow-sm",
                          user.accent,
                        )}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

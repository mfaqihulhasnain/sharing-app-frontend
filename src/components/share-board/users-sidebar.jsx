import { Check, ChevronDown, RotateCcw, UserRound, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, getAudienceLabel, getInitials } from "@/lib/utils";

export function UsersSidebar({
  currentUser,
  users,
  selectedUserIds,
  onToggleUser,
  onClearSelection,
  peopleById,
}) {
  const hasSelection = selectedUserIds.length > 0;
  const selectedAudienceLabel = getAudienceLabel(selectedUserIds, peopleById);

  const scrollToUsersList = () => {
    const list = document.getElementById("online-users-list");
    list?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

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
              {users.length + 1} live
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5 px-4 pb-4 pt-0">
          <div className="flex items-center gap-2.5 rounded-xl border border-line bg-card-muted/75 px-3 py-2.5">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm",
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
              <p className="text-xs text-muted">{currentUser.role}</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full border border-success-border bg-soft-emerald px-2 py-1 text-[11px] font-medium text-success-text">
              <Wifi className="h-3 w-3" />
              Live
            </div>
          </div>

          <div id="online-users-list" className="space-y-1.5">
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
                    "flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition duration-150",
                    isSelected
                      ? "border-accent-border bg-soft-blue/75 shadow-sm"
                      : "border-line bg-card-muted/70 hover:bg-card",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-semibold text-white shadow-sm",
                      user.accent,
                    )}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.name}
                      </p>
                      {isSelected && (
                        <Badge variant="accent" className="px-1.5 py-0.5 text-[10px]">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted">{user.role}</p>
                    <p className="inline-flex items-center gap-1 text-[11px] text-muted">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/85" />
                      {user.presence}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-accent-border bg-card text-accent"
                        : "border-line bg-transparent text-muted",
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-line/90 bg-card-strong">
        <CardHeader className="gap-2 p-4 pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm">Audience</CardTitle>
            {hasSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-7 px-2 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={scrollToUsersList}
            className="group flex w-full items-center justify-between rounded-xl border border-line bg-card-muted px-3 py-2 text-left transition hover:border-accent-border hover:bg-soft-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
          >
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                Current visibility
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {selectedAudienceLabel}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted transition group-hover:text-foreground" />
          </button>
        </CardHeader>

        <CardContent className="space-y-2 px-4 pb-4 pt-0">
          <p className="text-xs leading-5 text-muted">
            Pick people from the live list above to set who can view the next share.
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              type="button"
              size="sm"
              variant={hasSelection ? "outline" : "subtle"}
              className="h-7 px-2.5 text-xs"
              onClick={onClearSelection}
            >
              Everyone
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2.5 text-xs"
              onClick={scrollToUsersList}
            >
              Choose people
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

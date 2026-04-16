import { Check, RotateCcw, UserRound, Wifi } from "lucide-react";
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

  return (
    <div className="space-y-5 xl:sticky xl:top-28">
      <Card className="rounded-[30px] border-white/80 bg-card-strong/88">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Audience</CardTitle>
              <CardDescription>
                Pick who should see the next item before it lands on the board.
              </CardDescription>
            </div>
            {hasSelection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
          <div className="rounded-[24px] border border-line bg-white/72 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Current visibility
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">
              {getAudienceLabel(selectedUserIds, peopleById)}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              No selection keeps the next share public across the whole board.
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card className="rounded-[30px] border-white/80 bg-card-strong/88">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Online right now</CardTitle>
              <CardDescription>
                Everyone on the same network who can be included.
              </CardDescription>
            </div>
            <Badge variant="neutral">{users.length + 1} active</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 rounded-[24px] border border-line bg-white/72 p-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm",
                currentUser.accent,
              )}
            >
              {getInitials(currentUser.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-foreground">
                  {currentUser.name}
                </p>
                <Badge variant="accent">You</Badge>
              </div>
              <p className="text-sm text-muted">{currentUser.role}</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-soft-emerald px-3 py-1 text-xs font-medium text-emerald-700">
              <Wifi className="h-3.5 w-3.5" />
              Live
            </div>
          </div>

          <div className="space-y-2">
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
                    "flex w-full items-center gap-3 rounded-[24px] border px-4 py-4 text-left transition",
                    isSelected
                      ? "border-blue-200 bg-soft-blue shadow-sm"
                      : "border-line bg-white/72 hover:bg-white/88",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm",
                      user.accent,
                    )}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium text-foreground">
                        {user.name}
                      </p>
                      {isSelected && <Badge variant="accent">Selected</Badge>}
                    </div>
                    <p className="text-sm text-muted">{user.role}</p>
                    <p className="text-xs text-muted/90">{user.presence}</p>
                  </div>
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-blue-200 bg-white text-accent"
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
    </div>
  );
}

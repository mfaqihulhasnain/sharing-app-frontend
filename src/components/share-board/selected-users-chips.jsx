import { AnimatePresence, motion } from "framer-motion";
import { Globe2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SelectedUsersChips({
  selectedUsers,
  onRemoveUser,
  onClear,
  className,
}) {
  if (!selectedUsers.length) {
    return (
      <div
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-2xl border border-dashed border-line bg-card-muted/65 px-3 py-2 text-xs text-muted",
          className,
        )}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-card text-accent shadow-sm">
          <Globe2 className="h-3.5 w-3.5" />
        </span>
        <span className="truncate">
          Visible to <span className="font-semibold text-foreground">everyone</span>
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-1.5 rounded-2xl border border-line bg-card-muted/55 px-2.5 py-2",
        className,
      )}
    >
      <span className="mr-0.5 text-xs font-semibold text-foreground">
        Visible to
      </span>
      <AnimatePresence initial={false}>
        {selectedUsers.map((user) => (
          <motion.button
            key={user.id}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            type="button"
            onClick={() => onRemoveUser(user.id)}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent transition hover:bg-accent-soft/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
          >
            <span className="truncate">{user.name}</span>
            <X className="h-3 w-3 shrink-0" />
          </motion.button>
        ))}
      </AnimatePresence>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="ml-auto h-7 rounded-full px-2 text-xs text-muted hover:text-foreground"
      >
        Clear
      </Button>
    </div>
  );
}

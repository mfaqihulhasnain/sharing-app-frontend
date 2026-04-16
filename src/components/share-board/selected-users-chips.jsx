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
          "flex items-center gap-2 rounded-full border border-dashed border-line bg-white/65 px-4 py-2 text-sm text-muted",
          className,
        )}
      >
        <Globe2 className="h-4 w-4 text-accent" />
        Visible to: Everyone
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm font-medium text-foreground">Visible to:</span>
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
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-soft-blue px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-soft-blue/80"
          >
            <span>{user.name}</span>
            <X className="h-3.5 w-3.5" />
          </motion.button>
        ))}
      </AnimatePresence>
      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { EmptyState } from "@/components/share-board/empty-state";
import { ShareItemCard } from "@/components/share-board/share-item-card";

export function SharedBoard({ items, peopleById }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live activity
        </div>
        {items.length > 0 && (
          <p className="text-xs text-muted">{items.length} items visible</p>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const person = peopleById[item.senderId];
              const normalizedItem = {
                ...item,
                text: typeof item.text === "string" ? item.text : "",
                files: Array.isArray(item.files)
                  ? item.files
                  : item.file
                    ? [item.file]
                    : [],
              };

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <ShareItemCard
                    item={normalizedItem}
                    person={person}
                    peopleById={peopleById}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


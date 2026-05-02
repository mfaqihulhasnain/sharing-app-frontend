import { AnimatePresence, motion } from "framer-motion";
import { EmptyState } from "@/components/share-board/empty-state";
import { ShareItemCard } from "@/components/share-board/share-item-card";

function SharedBoardSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`share-skeleton-${index + 1}`}
          className="animate-pulse rounded-2xl border border-line/80 bg-card px-4 py-3.5 sm:px-5"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-card-muted" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="h-3 w-32 rounded bg-card-muted" />
              <div className="h-3 w-full rounded bg-card-muted" />
              <div className="h-3 w-5/6 rounded bg-card-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SharedBoard({
  items,
  isLoading = false,
  peopleById,
  viewerActorId,
  onDeleteShare,
}) {
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

      {items.length === 0 && isLoading ? (
        <SharedBoardSkeleton />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const person = peopleById[item.senderId] || {
                id: item.senderId,
                name: "Unknown user",
                accent: "from-slate-400 to-slate-500",
              };
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
                    viewerActorId={viewerActorId}
                    onDeleteShare={onDeleteShare}
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


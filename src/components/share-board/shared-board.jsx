import { AnimatePresence, motion } from "framer-motion";
import { Activity, LayoutList } from "lucide-react";
import { EmptyState } from "@/components/share-board/empty-state";
import { ShareItemCard } from "@/components/share-board/share-item-card";

function SharedBoardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`share-skeleton-${index + 1}`}
          className="animate-pulse rounded-2xl border border-line/75 bg-card-strong px-3 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.035)]"
        >
          <div className="flex items-start gap-2.5">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-card-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-40 rounded bg-card-muted" />
                <div className="h-5 w-20 rounded-full bg-card-muted" />
              </div>
              <div className="h-12 rounded-xl bg-card-muted/80" />
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
  const statusLabel = items.length > 0 ? `${items.length} visible` : isLoading ? "Loading" : "Empty";

  return (
    <section className="space-y-2.5">
      <div className="rounded-2xl border border-line/80 bg-card-strong px-3 py-2.5 shadow-[0_8px_22px_rgba(15,23,42,0.045)] sm:px-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-success-border bg-success-soft text-success-text">
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <Activity className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
                Live activity
              </h2>
              <p className="truncate text-[11px] leading-4 text-muted">
                Recent shares visible to you
              </p>
            </div>
          </div>

          <div className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-line bg-card-muted px-2.5 text-xs font-medium text-muted">
            <LayoutList className="h-3.5 w-3.5 text-accent" />
            {statusLabel}
          </div>
        </div>
      </div>

      {items.length === 0 && isLoading ? (
        <SharedBoardSkeleton />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
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
    </section>
  );
}

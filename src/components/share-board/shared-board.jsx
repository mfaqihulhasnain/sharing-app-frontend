import { AnimatePresence, motion } from "framer-motion";
import { Activity, LayoutList } from "lucide-react";
import { EmptyState } from "@/components/share-board/empty-state";
import { ShareItemCard } from "@/components/share-board/share-item-card";

function SharedBoardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`share-skeleton-${index + 1}`}
          className="animate-pulse rounded-[22px] border border-line/75 bg-card-strong px-4 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:px-5"
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-card-muted" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-32 rounded bg-card-muted" />
                <div className="h-5 w-20 rounded-full bg-card-muted" />
              </div>
              <div className="h-3 w-full rounded bg-card-muted" />
              <div className="h-3 w-4/5 rounded bg-card-muted" />
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
    <section className="space-y-3">
      <div className="rounded-[22px] border border-line/85 bg-card-strong px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-success-border bg-success-soft text-success-text">
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
              <Activity className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                Live activity
              </h2>
              <p className="text-xs leading-5 text-muted">
                Updates visible to you appear in this stream.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-card-muted px-3 py-1 text-xs font-medium text-muted">
            <LayoutList className="h-3.5 w-3.5 text-accent" />
            {items.length > 0 ? `${items.length} visible` : isLoading ? "Loading" : "Empty"}
          </div>
        </div>
      </div>

      {items.length === 0 && isLoading ? (
        <SharedBoardSkeleton />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
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
    </section>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/share-board/empty-state";
import { ShareItemCard } from "@/components/share-board/share-item-card";

export function SharedBoard({ items, peopleById }) {
  return (
    <div className="space-y-4">
      <Card className="rounded-[30px] border-line bg-card-strong px-6 py-5">
        <CardHeader className="gap-1 p-0">
          <CardTitle className="text-xl">Shared board</CardTitle>
          <CardDescription>
            One stream, one surface, and only the items you&apos;re allowed to see.
          </CardDescription>
        </CardHeader>
      </Card>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
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
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <ShareItemCard item={normalizedItem} person={person} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}


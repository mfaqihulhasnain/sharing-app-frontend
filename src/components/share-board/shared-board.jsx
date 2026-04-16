import { AnimatePresence, motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/share-board/empty-state";
import { FileItemCard } from "@/components/share-board/file-item-card";
import { TextItemCard } from "@/components/share-board/text-item-card";

export function SharedBoard({ items, peopleById }) {
  return (
    <div className="space-y-4">
      <Card className="rounded-[30px] border-white/80 bg-card-strong/88 px-6 py-5">
        <CardHeader className="gap-1 p-0">
          <CardTitle className="text-xl">Shared board</CardTitle>
          <CardDescription>
            One stream, one surface, and only the items you’re allowed to see.
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

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  {item.type === "file" ? (
                    <FileItemCard item={item} person={person} />
                  ) : (
                    <TextItemCard item={item} person={person} />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

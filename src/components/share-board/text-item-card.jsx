import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BoardItemCard } from "@/components/share-board/board-item-card";

export function TextItemCard({ item, person }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.text);
      toast.success("Note copied to clipboard");
    } catch {
      toast.error("Clipboard access is not available");
    }
  };

  return (
    <BoardItemCard item={item} person={person}>
      <div className="rounded-[24px] bg-white/76 p-5 shadow-sm">
        <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/95">
          {item.text}
        </p>
      </div>
      <div className="flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
          Copy
        </Button>
      </div>
    </BoardItemCard>
  );
}

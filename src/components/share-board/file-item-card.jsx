import {
  Download,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BoardItemCard } from "@/components/share-board/board-item-card";
import { formatFileSize, getFileExtension } from "@/lib/utils";

function getFileIcon(mimeType = "") {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.includes("sheet") || mimeType.includes("excel")) {
    return "sheet";
  }

  if (mimeType.includes("zip") || mimeType.includes("archive")) {
    return "archive";
  }

  return "document";
}

function downloadSharedFile(item) {
  const blob =
    item.file.sourceFile ||
    new Blob(
      [
        `Mock file placeholder for ${item.file.name}\nThis will be replaced by a real download URL once the backend is connected.`,
      ],
      { type: item.file.mimeType || "text/plain" },
    );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = item.file.name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function FileItemCard({ item, person }) {
  const iconKind = getFileIcon(item.file.mimeType);

  const handleDownload = () => {
    downloadSharedFile(item);
    toast.success(`${item.file.name} download started`);
  };

  return (
    <BoardItemCard item={item} person={person}>
      <div className="flex flex-col gap-4 rounded-[24px] bg-card-muted p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-soft-blue text-accent shadow-sm">
            {iconKind === "image" && <FileImage className="h-6 w-6" />}
            {iconKind === "video" && <FileVideo className="h-6 w-6" />}
            {iconKind === "sheet" && <FileSpreadsheet className="h-6 w-6" />}
            {iconKind === "archive" && <FileArchive className="h-6 w-6" />}
            {iconKind === "document" && <FileText className="h-6 w-6" />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold text-foreground">
              {item.file.name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>{formatFileSize(item.file.size)}</span>
              <span>{getFileExtension(item.file.name)}</span>
            </div>
          </div>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </BoardItemCard>
  );
}

import {
  Copy,
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

function downloadSharedFile(file) {
  const blob =
    file.sourceFile ||
    new Blob(
      [
        `Mock file placeholder for ${file.name}\nThis will be replaced by a real download URL once the backend is connected.`,
      ],
      { type: file.mimeType || "text/plain" },
    );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ShareItemCard({ item, person }) {
  const text = item.text?.trim() || "";
  const files = item.files || [];

  const handleCopyText = async () => {
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success("Note copied to clipboard");
    } catch {
      toast.error("Clipboard access is not available");
    }
  };

  const handleDownload = (file) => {
    downloadSharedFile(file);
    toast.success(`${file.name} download started`);
  };

  return (
    <BoardItemCard item={item} person={person}>
      {text && (
        <div className="space-y-3">
          <div className="rounded-[24px] bg-card-muted p-5 shadow-sm">
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-foreground/95">
              {text}
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
            >
              <Copy className="h-4 w-4" />
              Copy text
            </Button>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file, index) => {
            const iconKind = getFileIcon(file.mimeType);
            const fileKey = `${file.id || file.name}-${index}`;

            return (
              <div
                key={fileKey}
                className="flex flex-col gap-4 rounded-[24px] bg-card-muted p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-soft-blue text-accent shadow-sm">
                    {iconKind === "image" && <FileImage className="h-6 w-6" />}
                    {iconKind === "video" && <FileVideo className="h-6 w-6" />}
                    {iconKind === "sheet" && (
                      <FileSpreadsheet className="h-6 w-6" />
                    )}
                    {iconKind === "archive" && <FileArchive className="h-6 w-6" />}
                    {iconKind === "document" && <FileText className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-foreground">
                      {file.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{getFileExtension(file.name)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </BoardItemCard>
  );
}

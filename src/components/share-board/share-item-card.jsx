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

export function ShareItemCard({ item, person, peopleById }) {
  const text = item.text?.trim() || "";
  const files = item.files || [];
  const hasText = Boolean(text);
  const hasFiles = files.length > 0;
  const showDivider = hasText && hasFiles;

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
    <BoardItemCard item={item} person={person} peopleById={peopleById}>
      {hasText && (
        <section className="space-y-1.5">
          <p className="whitespace-pre-wrap text-[14px] leading-6 text-foreground/95">
            {text}
          </p>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              className="h-7 rounded-md px-2 text-[11px] text-muted hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </Button>
          </div>
        </section>
      )}

      {showDivider && <div className="h-px bg-line/70" />}

      {hasFiles && (
        <section className="space-y-1.5">
          {files.map((file, index) => {
            const iconKind = getFileIcon(file.mimeType);
            const fileKey = `${file.id || file.name}-${index}`;

            return (
              <div
                key={fileKey}
                className="group flex items-center gap-2.5 rounded-xl border border-line/80 bg-card px-2.5 py-2 transition duration-200 hover:border-accent-border/70 hover:bg-card-muted/70"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-soft-blue text-accent">
                    {iconKind === "image" && <FileImage className="h-4 w-4" />}
                    {iconKind === "video" && <FileVideo className="h-4 w-4" />}
                    {iconKind === "sheet" && <FileSpreadsheet className="h-4 w-4" />}
                    {iconKind === "archive" && <FileArchive className="h-4 w-4" />}
                    {iconKind === "document" && <FileText className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium leading-5 text-foreground">
                      {file.name}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-muted">
                      <span>{formatFileSize(file.size)}</span>
                      <span>&bull;</span>
                      <span>{getFileExtension(file.name)}</span>
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 rounded-md px-2 text-[11px] text-muted hover:bg-card hover:text-foreground"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            );
          })}
        </section>
      )}
    </BoardItemCard>
  );
}

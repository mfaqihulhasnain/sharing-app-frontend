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
import { cn, formatFileSize, getFileExtension } from "@/lib/utils";

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

export function ShareItemCard({ item, person, peopleById, viewerActorId }) {
  const text = item.text?.trim() || "";
  const files = item.files || [];
  const hasText = Boolean(text);
  const hasFiles = files.length > 0;
  const isMixedPost = hasText && hasFiles;

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
    <BoardItemCard
      item={item}
      person={person}
      peopleById={peopleById}
      viewerActorId={viewerActorId}
    >
      {hasText && (
        <section className={cn("space-y-1", isMixedPost && "space-y-0.5")}>
          <p className="whitespace-pre-wrap text-[14px] leading-[1.55] text-foreground/95">
            {text}
          </p>
          <div className="inline-flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              className="h-6 rounded-md px-1.5 text-[10.5px] text-muted hover:bg-card-muted hover:text-foreground"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
        </section>
      )}

      {hasFiles && (
        <section className={cn("space-y-1", isMixedPost && "pt-0.5")}>
          {files.map((file, index) => {
            const iconKind = getFileIcon(file.mimeType);
            const fileKey = `${file.id || file.name}-${index}`;

            return (
              <div
                key={fileKey}
                className={cn(
                  "group flex items-center gap-2 rounded-lg border px-2.5 transition duration-150",
                  isMixedPost
                    ? "border-line/70 bg-card-muted/45 py-1.5 hover:border-line hover:bg-card-muted/70"
                    : "border-line/80 bg-card py-2 hover:border-accent-border/70 hover:bg-card-muted/70",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-md bg-soft-blue text-accent",
                      isMixedPost ? "h-7 w-7" : "h-8 w-8",
                    )}
                  >
                    {iconKind === "image" && (
                      <FileImage className={cn(isMixedPost ? "h-3.5 w-3.5" : "h-4 w-4")} />
                    )}
                    {iconKind === "video" && (
                      <FileVideo className={cn(isMixedPost ? "h-3.5 w-3.5" : "h-4 w-4")} />
                    )}
                    {iconKind === "sheet" && (
                      <FileSpreadsheet
                        className={cn(isMixedPost ? "h-3.5 w-3.5" : "h-4 w-4")}
                      />
                    )}
                    {iconKind === "archive" && (
                      <FileArchive className={cn(isMixedPost ? "h-3.5 w-3.5" : "h-4 w-4")} />
                    )}
                    {iconKind === "document" && (
                      <FileText className={cn(isMixedPost ? "h-3.5 w-3.5" : "h-4 w-4")} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium leading-5 text-foreground">
                      {file.name}
                    </p>
                    <p
                      className={cn(
                        "flex items-center gap-1 text-muted",
                        isMixedPost ? "text-[10.5px]" : "text-[11px]",
                      )}
                    >
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
                  className={cn(
                    "shrink-0 rounded-md text-[10.5px] text-muted hover:bg-card hover:text-foreground",
                    isMixedPost ? "h-6 px-1.5" : "h-7 px-2",
                  )}
                  onClick={() => handleDownload(file)}
                >
                  <Download className={cn(isMixedPost ? "h-3 w-3" : "h-3.5 w-3.5")} />
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

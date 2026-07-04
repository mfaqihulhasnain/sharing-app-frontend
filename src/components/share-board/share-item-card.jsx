import {
  Copy,
  Download,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BoardItemCard } from "@/components/share-board/board-item-card";
import {
  getShareFileDownloadUrl,
  getStoredAccessToken,
} from "@/lib/auth-client";
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

function downloadLocalFallbackFile(file) {
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

async function requestAndDownloadSharedFile(file) {
  const numericId = Number(file?.id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    downloadLocalFallbackFile(file);
    return;
  }

  const data = await getShareFileDownloadUrl({
    accessToken: getStoredAccessToken() || undefined,
    id: numericId,
  });
  const signedUrl =
    typeof data?.url === "string" && data.url.trim() ? data.url.trim() : "";
  if (!signedUrl) {
    throw new Error("Download URL was not received.");
  }

  const anchor = document.createElement("a");
  anchor.href = signedUrl;
  anchor.rel = "noopener noreferrer";
  anchor.click();
}

export function ShareItemCard({
  item,
  person,
  peopleById,
  viewerActorId,
  onDeleteShare,
}) {
  const canDelete =
    typeof viewerActorId === "string" &&
    viewerActorId.trim().length > 0 &&
    item?.senderId === viewerActorId;
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

  const handleDownload = async (file) => {
    try {
      await requestAndDownloadSharedFile(file);
      toast.success(`${file.name} download started`);
    } catch {
      toast.error("Unable to download this file right now");
    }
  };

  return (
    <BoardItemCard
      item={item}
      person={person}
      peopleById={peopleById}
      viewerActorId={viewerActorId}
    >
      {hasText && (
        <section
          className={cn(
            "rounded-2xl border border-line/70 bg-card-muted/45 px-3 py-3",
            isMixedPost && "pb-2.5",
          )}
        >
          <p className="whitespace-pre-wrap text-[14px] leading-[1.65] text-foreground/95">
            {text}
          </p>
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              className="h-7 rounded-full px-2 text-[11px] text-muted hover:bg-card hover:text-foreground"
            >
              <Copy className="h-3 w-3" />
              Copy
            </Button>
          </div>
        </section>
      )}

      {hasFiles && (
        <section className={cn("space-y-2", isMixedPost && "pt-0.5")}>
          {files.map((file, index) => {
            const iconKind = getFileIcon(file.mimeType);
            const fileKey = `${file.id || file.name}-${index}`;

            return (
              <div
                key={fileKey}
                className="group flex min-w-0 flex-col gap-2 rounded-2xl border border-line/75 bg-card px-3 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.035)] transition duration-150 hover:border-accent-border/70 hover:bg-card-muted/45 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-xl border border-accent-border bg-accent-soft text-accent",
                      isMixedPost ? "h-9 w-9" : "h-10 w-10",
                    )}
                  >
                    {iconKind === "image" && (
                      <FileImage
                        className={cn(isMixedPost ? "h-4 w-4" : "h-4.5 w-4.5")}
                      />
                    )}
                    {iconKind === "video" && (
                      <FileVideo
                        className={cn(isMixedPost ? "h-4 w-4" : "h-4.5 w-4.5")}
                      />
                    )}
                    {iconKind === "sheet" && (
                      <FileSpreadsheet
                        className={cn(isMixedPost ? "h-4 w-4" : "h-4.5 w-4.5")}
                      />
                    )}
                    {iconKind === "archive" && (
                      <FileArchive
                        className={cn(isMixedPost ? "h-4 w-4" : "h-4.5 w-4.5")}
                      />
                    )}
                    {iconKind === "document" && (
                      <FileText
                        className={cn(isMixedPost ? "h-4 w-4" : "h-4.5 w-4.5")}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-5 text-foreground">
                      {file.name}
                    </p>
                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted">
                      <span className="truncate">{formatFileSize(file.size)}</span>
                      <span aria-hidden>&bull;</span>
                      <span className="truncate uppercase">
                        {getFileExtension(file.name) || "file"}
                      </span>
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 rounded-full px-2.5 text-[11px] text-muted hover:bg-card hover:text-foreground sm:self-auto"
                  onClick={() => void handleDownload(file)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            );
          })}
        </section>
      )}

      {canDelete && (
        <section className="flex justify-end border-t border-line/60 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 rounded-full px-2 text-[11px] text-muted hover:bg-card-muted hover:text-foreground"
            onClick={() => onDeleteShare?.(item.id)}
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </section>
      )}
    </BoardItemCard>
  );
}

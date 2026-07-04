import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
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

const COLLAPSED_TEXT_LENGTH = 180;
const COLLAPSED_LINE_COUNT = 2;

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

function FileIcon({ iconKind, compact }) {
  const iconClassName = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  if (iconKind === "image") return <FileImage className={iconClassName} />;
  if (iconKind === "video") return <FileVideo className={iconClassName} />;
  if (iconKind === "sheet") return <FileSpreadsheet className={iconClassName} />;
  if (iconKind === "archive") return <FileArchive className={iconClassName} />;
  return <FileText className={iconClassName} />;
}

export function ShareItemCard({
  item,
  person,
  peopleById,
  viewerActorId,
  onDeleteShare,
}) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const canDelete =
    typeof viewerActorId === "string" &&
    viewerActorId.trim().length > 0 &&
    item?.senderId === viewerActorId;
  const text = item.text?.trim() || "";
  const files = item.files || [];
  const hasText = Boolean(text);
  const hasFiles = files.length > 0;
  const isMixedPost = hasText && hasFiles;
  const shouldCollapseText =
    text.length > COLLAPSED_TEXT_LENGTH ||
    text.split("\n").length > COLLAPSED_LINE_COUNT;

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

  const actions = (
    <div className="flex items-center gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
      {hasText && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={handleCopyText}
          className="rounded-full text-muted hover:bg-card-muted hover:text-foreground"
          aria-label="Copy note"
          title="Copy note"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      )}
      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted hover:bg-card-muted hover:text-foreground"
          onClick={() => onDeleteShare?.(item.id)}
          aria-label="Delete share"
          title="Delete share"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );

  return (
    <BoardItemCard
      item={item}
      person={person}
      peopleById={peopleById}
      viewerActorId={viewerActorId}
      actions={actions}
    >
      {hasText && (
        <section
          className={cn(
            "rounded-xl bg-card-muted/35 px-3 py-2.5 ring-1 ring-line/55",
            isMixedPost && "mb-0.5",
          )}
        >
          <p
            className={cn(
              "whitespace-pre-wrap text-[13.5px] leading-6 text-foreground/95",
              shouldCollapseText &&
                !isTextExpanded &&
                "max-h-12 overflow-hidden [mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)]",
            )}
          >
            {text}
          </p>
          {shouldCollapseText && (
            <button
              type="button"
              onClick={() => setIsTextExpanded((currentValue) => !currentValue)}
              className="mt-1 inline-flex items-center rounded-full text-[10px] font-medium leading-none text-accent transition hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
            >
              {isTextExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </section>
      )}

      {hasFiles && (
        <section className="space-y-1.5">
          {files.map((file, index) => {
            const iconKind = getFileIcon(file.mimeType);
            const fileKey = `${file.id || file.name}-${index}`;
            const extension = getFileExtension(file.name) || "file";

            return (
              <div
                key={fileKey}
                className="group/file flex min-w-0 items-center gap-2.5 rounded-xl border border-line/70 bg-card px-2.5 py-2 transition duration-150 hover:border-accent-border/70 hover:bg-card-muted/35"
              >
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg border border-accent-border bg-accent-soft text-accent",
                    isMixedPost ? "h-8 w-8" : "h-9 w-9",
                  )}
                >
                  <FileIcon iconKind={iconKind} compact={isMixedPost} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-5 text-foreground">
                    {file.name}
                  </p>
                  <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted">
                    <span className="truncate">{formatFileSize(file.size)}</span>
                    <span aria-hidden>&bull;</span>
                    <span className="truncate uppercase">{extension}</span>
                  </p>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 rounded-full px-2 text-[11px] text-muted hover:bg-card hover:text-foreground"
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
    </BoardItemCard>
  );
}




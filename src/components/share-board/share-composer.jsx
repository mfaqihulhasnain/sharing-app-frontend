import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Paperclip,
  SendHorizonal,
  Trash2,
  UploadCloud,
  UsersRound,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SelectedUsersChips } from "@/components/share-board/selected-users-chips";
import { cn, formatFileSize, getAudienceLabel, getFileExtension } from "@/lib/utils";

const IMAGE_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "webp",
  "gif",
  "jfif",
  "svg",
]);
const PDF_EXTENSIONS = new Set(["pdf"]);
const DOC_EXTENSIONS = new Set(["doc", "docx", "odt", "rtf"]);
const SHEET_EXTENSIONS = new Set(["xls", "xlsx", "csv", "ods"]);
const SLIDE_EXTENSIONS = new Set(["ppt", "pptx", "odp", "key"]);
const ARCHIVE_EXTENSIONS = new Set(["zip", "rar", "7z", "tar", "gz", "bz2"]);
const TEXT_EXTENSIONS = new Set(["txt", "md", "json", "xml", "yml", "yaml", "log"]);
const VIDEO_EXTENSIONS = new Set(["mp4", "mov", "avi", "mkv", "webm"]);

function getAttachmentMimeType(file = {}) {
  return (file.type || file.mimeType || "").toLowerCase();
}

function getAttachmentExtension(name = "") {
  return getFileExtension(name).toLowerCase();
}

function getAttachmentKind(file) {
  const mimeType = getAttachmentMimeType(file);
  const extension = getAttachmentExtension(file.name);

  if (mimeType.startsWith("image/") || IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (mimeType.startsWith("video/") || VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  if (mimeType.includes("pdf") || PDF_EXTENSIONS.has(extension)) {
    return "pdf";
  }

  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    DOC_EXTENSIONS.has(extension)
  ) {
    return "doc";
  }

  if (
    mimeType.includes("sheet") ||
    mimeType.includes("excel") ||
    SHEET_EXTENSIONS.has(extension)
  ) {
    return "sheet";
  }

  if (
    mimeType.includes("presentation") ||
    mimeType.includes("powerpoint") ||
    SLIDE_EXTENSIONS.has(extension)
  ) {
    return "slide";
  }

  if (mimeType.includes("zip") || mimeType.includes("archive") || ARCHIVE_EXTENSIONS.has(extension)) {
    return "archive";
  }

  if (mimeType.startsWith("text/") || TEXT_EXTENSIONS.has(extension)) {
    return "text";
  }

  return "generic";
}

function getAttachmentTypeLabel(kind, extension) {
  const upperExtension = extension?.toUpperCase();

  if (kind === "pdf") {
    return "PDF";
  }

  if (kind === "doc") {
    return "DOC";
  }

  if (kind === "sheet") {
    return "XLS";
  }

  if (kind === "slide") {
    return "PPT";
  }

  if (kind === "archive") {
    return "ZIP";
  }

  if (kind === "text") {
    return "TXT";
  }

  if (kind === "image") {
    return upperExtension || "IMG";
  }

  if (kind === "video") {
    return upperExtension || "VID";
  }

  return upperExtension || "FILE";
}

function getAttachmentVisual(kind) {
  if (kind === "image") {
    return {
      Icon: FileImage,
      tileLabel: "",
      tileClass: "border-sky-200 bg-sky-100 text-sky-700",
      metaChipClass: "bg-sky-100 text-sky-700",
    };
  }

  if (kind === "video") {
    return {
      Icon: FileVideo,
      tileLabel: "",
      tileClass: "border-violet-200 bg-violet-100 text-violet-700",
      metaChipClass: "bg-violet-100 text-violet-700",
    };
  }

  if (kind === "pdf") {
    return {
      Icon: null,
      tileLabel: "PDF",
      tileClass: "border-rose-500 bg-rose-600 text-white",
      metaChipClass: "bg-rose-100 text-rose-700",
    };
  }

  if (kind === "doc") {
    return {
      Icon: FileText,
      tileLabel: "",
      tileClass: "border-blue-200 bg-blue-100 text-blue-700",
      metaChipClass: "bg-blue-100 text-blue-700",
    };
  }

  if (kind === "sheet") {
    return {
      Icon: FileSpreadsheet,
      tileLabel: "",
      tileClass: "border-emerald-200 bg-emerald-100 text-emerald-700",
      metaChipClass: "bg-emerald-100 text-emerald-700",
    };
  }

  if (kind === "slide") {
    return {
      Icon: FileText,
      tileLabel: "",
      tileClass: "border-orange-200 bg-orange-100 text-orange-700",
      metaChipClass: "bg-orange-100 text-orange-700",
    };
  }

  if (kind === "archive") {
    return {
      Icon: FileArchive,
      tileLabel: "",
      tileClass: "border-amber-200 bg-amber-100 text-amber-700",
      metaChipClass: "bg-amber-100 text-amber-700",
    };
  }

  return {
    Icon: FileText,
    tileLabel: "",
    tileClass: "border-slate-200 bg-slate-100 text-slate-700",
    metaChipClass: "bg-slate-200 text-slate-600",
  };
}

export function ShareComposer({
  draftText,
  onDraftTextChange,
  attachments,
  onFilesAdded,
  onRemoveFile,
  onClearFiles,
  onSubmit,
  selectedUsers,
  selectedUserIds,
  onRemoveAudienceUser,
  onClearAudience,
  peopleById,
  isSharing,
  registerUploadTrigger = () => {},
  onOpenAudience = () => {},
}) {
  const hasShareContent = draftText.trim().length > 0 || attachments.length > 0;
  const totalAttachmentSize = attachments.reduce(
    (total, file) => total + file.size,
    0,
  );

  const imagePreviewSources = useMemo(() => {
    const previewById = {};
    const objectUrls = [];

    attachments.forEach((file) => {
      if (getAttachmentKind(file) !== "image" || !file.id) {
        return;
      }

      // Future backend integration can pass a persistent preview URL directly.
      const directPreviewUrl =
        file.previewUrl || file.previewSrc || file.url || file.downloadUrl;
      if (typeof directPreviewUrl === "string" && directPreviewUrl.length > 0) {
        previewById[file.id] = directPreviewUrl;
        return;
      }

      const sourceBlob = file.sourceFile || file.file;
      if (sourceBlob instanceof Blob) {
        const objectUrl = URL.createObjectURL(sourceBlob);
        objectUrls.push(objectUrl);
        previewById[file.id] = objectUrl;
      }
    });

    return {
      previewById,
      objectUrls,
    };
  }, [attachments]);

  useEffect(() => {
    return () => {
      imagePreviewSources.objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviewSources]);

  const handleClearAllFiles = () => {
    if (!attachments.length) {
      return;
    }

    if (
      attachments.length > 1 &&
      !window.confirm("Remove all attached files?")
    ) {
      return;
    }

    onClearFiles();
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles.length) {
        return;
      }

      onFilesAdded(acceptedFiles);
      toast.success(
        acceptedFiles.length === 1
          ? `${acceptedFiles[0].name} attached`
          : `${acceptedFiles.length} files attached`,
      );
    },
  });

  useEffect(() => {
    registerUploadTrigger(open);

    return () => {
      registerUploadTrigger(() => {});
    };
  }, [open, registerUploadTrigger]);

  return (
    <Card
      id="share-composer"
      className={cn(
        "relative overflow-hidden rounded-[28px] border-line/90 bg-card-strong shadow-[0_20px_50px_rgba(15,23,42,0.08)]",
        isDragActive && "border-accent-border ring-2 ring-accent/15",
      )}
    >
      <CardHeader className="relative gap-3 border-b border-line/70 bg-card-muted/25 p-4 pb-3 sm:p-5 sm:pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight sm:text-lg">
              Share to the board
            </CardTitle>
            <CardDescription className="max-w-xl text-xs leading-5">
              Post once, pick visibility, and keep everything in one shared flow.
            </CardDescription>
          </div>

          <button
            type="button"
            onClick={onOpenAudience}
            className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted shadow-sm transition hover:border-accent-border hover:bg-accent-soft/65 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
            aria-label="Open audience controls"
          >
            <UsersRound className="h-3.5 w-3.5 text-accent" />
            <span className="truncate">
              Visible to{" "}
              <span className="font-medium text-foreground">
                {getAudienceLabel(selectedUserIds, peopleById)}
              </span>
            </span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-3.5 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <SelectedUsersChips
          selectedUsers={selectedUsers}
          onRemoveUser={onRemoveAudienceUser}
          onClear={onClearAudience}
          className="min-h-9"
        />

        <div
          {...getRootProps()}
          className={cn(
            "rounded-[22px] border border-dashed border-line/80 bg-card-muted/55 p-2.5 shadow-inner shadow-slate-200/35 transition-[border-color,background-color,box-shadow] duration-150",
            isDragActive && "border-accent bg-soft-blue/70 shadow-[inset_0_0_0_1px_var(--accent-border)]",
          )}
        >
          <input {...getInputProps()} />
          <Textarea
            value={draftText}
            onChange={(event) => onDraftTextChange(event.target.value)}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                if (hasShareContent && !isSharing) {
                  onSubmit();
                }
              }
            }}
            placeholder="Share an update, note, or file handoff..."
            aria-label="Message and file note composer"
            className="min-h-[108px] rounded-2xl border-line/90 bg-card/95 px-3.5 py-3 text-sm leading-6 shadow-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-accent/15"
          />

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-line/80 px-1 pt-2.5">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <UploadCloud className="h-3.5 w-3.5 text-accent" />
              {isDragActive
                ? "Release to add files."
                : "Drag files here or use attach."}{" "}
              <span className="text-muted-soft">Ctrl/Cmd + Enter to share</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={open}
                className="h-9 rounded-full px-3"
              >
                <Paperclip className="h-3.5 w-3.5" />
                Attach
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSubmit}
                disabled={isSharing || !hasShareContent}
                className="h-9 rounded-full px-4"
              >
                <SendHorizonal className="h-3.5 w-3.5" />
                {isSharing ? "Sharing..." : "Share now"}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-2 rounded-[20px] border border-line/70 bg-card-muted/35 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold tracking-tight text-foreground">Attached files</p>
                <div className="flex items-center gap-3">
                  <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="truncate">
                      {attachments.length} file
                      {attachments.length === 1 ? "" : "s"}
                    </span>
                    <span aria-hidden>&bull;</span>
                    <span className="truncate">{formatFileSize(totalAttachmentSize)}</span>
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllFiles}
                    className="h-6 rounded-md px-1.5 text-[11px] text-muted hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                    Clear files
                  </Button>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {attachments.map((file) => {
                  const kind = getAttachmentKind(file);
                  const extension = getAttachmentExtension(file.name);
                  const typeLabel = getAttachmentTypeLabel(kind, extension);
                  const { Icon, tileLabel, tileClass, metaChipClass } =
                    getAttachmentVisual(kind);
                  const imagePreviewSrc = file.id
                    ? imagePreviewSources.previewById[file.id]
                    : "";
                  const hasImagePreview = kind === "image" && Boolean(imagePreviewSrc);

                  return (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-line/75 bg-card-strong/90 px-2.5 py-2.5 shadow-[0_8px_18px_rgba(15,23,42,0.035)] transition duration-150 hover:border-accent-border/70 hover:bg-card"
                    >
                      {hasImagePreview ? (
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-line/70 bg-card">
                          <Image
                            src={imagePreviewSrc}
                            alt={file.name}
                            width={44}
                            height={44}
                            sizes="44px"
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                            tileClass,
                          )}
                        >
                          {tileLabel ? (
                            <span className="text-[11px] font-bold tracking-[0.06em]">
                              {tileLabel}
                            </span>
                          ) : (
                            <Icon className="h-4.5 w-4.5" />
                          )}
                        </div>
                      )}

                      <div className="min-w-0 flex flex-1 flex-col gap-0.5">
                        <p className="truncate text-[13px] font-medium leading-5 text-foreground">
                          {file.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10.5px] text-muted">
                          <span className="truncate">{formatFileSize(file.size)}</span>
                          <span aria-hidden>&bull;</span>
                          <span
                            className={cn(
                              "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
                              metaChipClass,
                            )}
                          >
                            {typeLabel}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFile(file.id)}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition duration-150 hover:bg-card-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                        aria-label={`Remove ${file.name}`}
                        title={`Remove ${file.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}


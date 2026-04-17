import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

function getAttachmentVisual(file) {
  const mimeType = file.type || "";
  const extension = getFileExtension(file.name).toLowerCase();

  if (mimeType.startsWith("image/")) {
    return {
      Icon: FileImage,
      iconTone: "bg-sky-100 text-sky-600",
    };
  }

  if (mimeType.startsWith("video/")) {
    return {
      Icon: FileVideo,
      iconTone: "bg-violet-100 text-violet-600",
    };
  }

  if (
    mimeType.includes("sheet") ||
    mimeType.includes("excel") ||
    ["xls", "xlsx", "csv"].includes(extension)
  ) {
    return {
      Icon: FileSpreadsheet,
      iconTone: "bg-emerald-100 text-emerald-700",
    };
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("archive") ||
    ["zip", "rar", "7z", "tar", "gz"].includes(extension)
  ) {
    return {
      Icon: FileArchive,
      iconTone: "bg-amber-100 text-amber-700",
    };
  }

  return {
    Icon: FileText,
    iconTone: "bg-slate-200 text-slate-600",
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
        "relative overflow-hidden rounded-2xl border-line/90 bg-card-strong shadow-[0_12px_24px_rgba(15,23,42,0.04)]",
        isDragActive && "ring-2 ring-accent/15",
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,_var(--accent-soft),_transparent_70%)]" />
      <CardHeader className="relative gap-2 p-4 pb-2 sm:p-5 sm:pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2.5">
          <div className="space-y-0.5">
            <CardTitle className="text-base sm:text-[1.03rem]">
              Share to the board
            </CardTitle>
            <CardDescription className="text-xs leading-5">
              Post once, pick visibility, and keep everything in one shared flow.
            </CardDescription>
          </div>

          <button
            type="button"
            onClick={onOpenAudience}
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-card-muted px-3 py-1.5 text-xs text-muted transition hover:border-accent-border hover:bg-accent-soft/65 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
            aria-label="Open audience controls"
          >
            <UsersRound className="h-3.5 w-3.5 text-accent" />
            <span>
              Visible to{" "}
              <span className="font-medium text-foreground">
                {getAudienceLabel(selectedUserIds, peopleById)}
              </span>
            </span>
          </button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-3 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
        <SelectedUsersChips
          selectedUsers={selectedUsers}
          onRemoveUser={onRemoveAudienceUser}
          onClear={onClearAudience}
          className="min-h-8"
        />

        <div
          {...getRootProps()}
          className={cn(
            "rounded-2xl border border-dashed border-line/80 bg-card-muted/65 p-2.5 transition-[border-color,background-color,box-shadow] duration-150",
            isDragActive && "border-accent bg-soft-blue/70 shadow-sm",
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
            className="min-h-[86px] rounded-xl border-line/90 bg-card/95 px-3.5 py-2.5 text-sm leading-6 shadow-none transition-[border-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-accent/15"
          />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line/80 px-1 pt-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
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
                className="h-8"
              >
                <Paperclip className="h-3.5 w-3.5" />
                Attach
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSubmit}
                disabled={isSharing || !hasShareContent}
                className="h-8 px-3.5"
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
              className="space-y-1.5 pt-0.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-muted">Attached files</p>
                <div className="flex items-center gap-3">
                  <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                    <span>
                      {attachments.length} file
                      {attachments.length === 1 ? "" : "s"}
                    </span>
                    <span aria-hidden>&bull;</span>
                    <span>{formatFileSize(totalAttachmentSize)}</span>
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
              <div className="space-y-1">
                {attachments.map((file) => {
                  const { Icon, iconTone } = getAttachmentVisual(file);
                  const extension = getFileExtension(file.name);

                  return (
                    <motion.div
                      key={file.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="flex items-center gap-2 rounded-md bg-card-muted/45 px-2.5 py-1.5 transition duration-150 hover:bg-card-muted/70"
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                          iconTone,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0 flex flex-1 items-center gap-2">
                        <p className="truncate text-[13px] font-medium leading-5 text-foreground">
                          {file.name}
                        </p>
                        <span className="shrink-0 text-[10.5px] text-muted">
                          {formatFileSize(file.size)}
                        </span>
                        <span className="hidden shrink-0 text-[10px] uppercase tracking-wide text-muted sm:inline">
                          {extension}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFile(file.id)}
                        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition duration-150 hover:bg-card hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-3 w-3" />
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

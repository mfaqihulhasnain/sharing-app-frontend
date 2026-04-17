import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, SendHorizonal, Trash2, UploadCloud, X } from "lucide-react";
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
  registerUploadTrigger,
}) {
  const hasShareContent = draftText.trim().length > 0 || attachments.length > 0;
  const totalAttachmentSize = attachments.reduce(
    (total, file) => total + file.size,
    0,
  );

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
        "relative overflow-hidden rounded-[32px] border-line bg-card-strong",
        isDragActive && "ring-4 ring-accent/10",
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_var(--accent-soft),_transparent_70%)]" />
      <CardHeader className="relative gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">Share to the board</CardTitle>
            <CardDescription>
              Post once, keep the board unified, and choose who can access the
              item before you send it.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-line bg-card-muted px-4 py-3 text-sm text-muted">
            Audience:{" "}
            <span className="font-medium text-foreground">
              {getAudienceLabel(selectedUserIds, peopleById)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5">
        <SelectedUsersChips
          selectedUsers={selectedUsers}
          onRemoveUser={onRemoveAudienceUser}
          onClear={onClearAudience}
        />

        <div
          {...getRootProps()}
          className={cn(
            "rounded-[28px] border border-dashed border-line bg-card-muted p-3 transition",
            isDragActive && "border-accent bg-soft-blue",
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
            placeholder="Drop a quick update, a checklist, or a file handoff note here."
            aria-label="Message and file note composer"
          />

          <div className="mt-3 flex flex-col gap-3 border-t border-line px-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <UploadCloud className="h-4 w-4 text-accent" />
              {isDragActive
                ? "Release to add files to this board post."
                : "Drag files here or use attach to add them to the same board flow."}{" "}
              <span className="text-muted-soft">Ctrl/Cmd + Enter to share</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={open}
              >
                <Paperclip className="h-4 w-4" />
                Attach files
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSubmit}
                disabled={isSharing || !hasShareContent}
              >
                <SendHorizonal className="h-4 w-4" />
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
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Ready to share
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted">
                    {attachments.length} file{attachments.length === 1 ? "" : "s"} -{" "}
                    {formatFileSize(totalAttachmentSize)}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearFiles}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear files
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {attachments.map((file) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="flex items-start gap-3 rounded-[22px] border border-line bg-card p-4 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-soft-blue text-sm font-semibold text-accent">
                      {getFileExtension(file.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      className="rounded-full p-1.5 text-muted transition hover:bg-card-muted hover:text-foreground"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { ShareComposer } from "@/components/share-board/share-composer";
import { SharedBoard } from "@/components/share-board/shared-board";
import { UsersSidebar } from "@/components/share-board/users-sidebar";
import {
  currentUser,
  initialShares,
  onlineUsers,
  peopleById,
} from "@/lib/mock-data";
import { canUserSeeShare } from "@/lib/utils";

function createAttachmentRecord(file) {
  return {
    id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    type: file.type,
    sourceFile: file,
  };
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function ShareBoardShell() {
  const [shares, setShares] = useState(initialShares);
  const [draftText, setDraftText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const composerRef = useRef(null);
  const uploadTriggerRef = useRef(() => {});

  const selectedUsers = onlineUsers.filter((user) => selectedUserIds.includes(user.id));
  const visibleShares = shares
    .filter((item) => canUserSeeShare(item, currentUser.id))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  const toggleUser = (userId) => {
    setSelectedUserIds((currentSelection) =>
      currentSelection.includes(userId)
        ? currentSelection.filter((id) => id !== userId)
        : [...currentSelection, userId],
    );
  };

  const handleFilesAdded = (acceptedFiles) => {
    setAttachments((currentFiles) => [
      ...currentFiles,
      ...acceptedFiles.map(createAttachmentRecord),
    ]);
  };

  const handleRemoveFile = (fileId) => {
    setAttachments((currentFiles) =>
      currentFiles.filter((file) => file.id !== fileId),
    );
  };

  const handleClearFiles = () => {
    setAttachments([]);
  };

  const handleShare = async () => {
    const trimmedText = draftText.trim();

    if (!trimmedText && attachments.length === 0) {
      toast.error("Add a note or at least one file before sharing.");
      return;
    }

    setIsSharing(true);
    await wait(220);

    const createdAt = new Date().toISOString();
    const audienceIds = [...selectedUserIds];
    const destinationNames = onlineUsers
      .filter((user) => audienceIds.includes(user.id))
      .map((user) => user.name);
    const newShare = {
      id: `share-${createdAt}`,
      senderId: currentUser.id,
      createdAt,
      audienceIds,
      text: trimmedText,
      files: attachments.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        sourceFile: file.sourceFile,
      })),
    };

    setShares((currentShares) => [newShare, ...currentShares]);
    setDraftText("");
    setAttachments([]);
    setSelectedUserIds([]);
    setIsSharing(false);

    const destinationLabel =
      audienceIds.length === 0
        ? "everyone on the board"
        : destinationNames.join(", ");

    toast.success(
      `Shared with ${destinationLabel}`,
    );
  };

  const handleQuickUpload = () => {
    composerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    uploadTriggerRef.current?.();
  };

  const registerUploadTrigger = (open) => {
    uploadTriggerRef.current = open;
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-8rem] top-28 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute right-[-6rem] top-40 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-3)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1480px] flex-col gap-6">
        <EnterpriseNavbar />

        <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div ref={composerRef}>
              <ShareComposer
                draftText={draftText}
                onDraftTextChange={setDraftText}
                attachments={attachments}
                onFilesAdded={handleFilesAdded}
                onRemoveFile={handleRemoveFile}
                onClearFiles={handleClearFiles}
                onSubmit={handleShare}
                selectedUsers={selectedUsers}
                selectedUserIds={selectedUserIds}
                onRemoveAudienceUser={(userId) =>
                  setSelectedUserIds((currentSelection) =>
                    currentSelection.filter((id) => id !== userId),
                  )
                }
                onClearAudience={() => setSelectedUserIds([])}
                peopleById={peopleById}
                isSharing={isSharing}
                registerUploadTrigger={registerUploadTrigger}
              />
            </div>
            <SharedBoard items={visibleShares} peopleById={peopleById} />
          </div>

          <aside>
            <UsersSidebar
              currentUser={currentUser}
              users={onlineUsers}
              selectedUserIds={selectedUserIds}
              onToggleUser={toggleUser}
              onClearSelection={() => setSelectedUserIds([])}
              peopleById={peopleById}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}

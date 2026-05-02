"use client";

import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { ShareComposer } from "@/components/share-board/share-composer";
import { SharedBoard } from "@/components/share-board/shared-board";
import { UsersSidebar } from "@/components/share-board/users-sidebar";
import { currentUser as fallbackCurrentUser, initialShares } from "@/lib/mock-data";
import { usePresenceState } from "@/lib/presence-store";
import { canUserSeeShare } from "@/lib/utils";

let nextAttachmentId = 1;
let nextShareId =
  initialShares.reduce(
    (maxId, share) => Math.max(maxId, Number(share.id) || 0),
    0,
  ) + 1;

function allocateAttachmentId() {
  const id = nextAttachmentId;
  nextAttachmentId += 1;
  return id;
}

function allocateShareId() {
  const id = nextShareId;
  nextShareId += 1;
  return id;
}

function createAttachmentRecord(file) {
  return {
    id: allocateAttachmentId(),
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

function getIdKey(id) {
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  if (typeof id === "string" && id.trim()) return id.trim();
  return "";
}

export function ShareBoardShell() {
  const {
    currentUser: presenceCurrentUser,
    onlineUsers: directoryUsers,
    peopleById,
  } = usePresenceState();
  const currentUser = presenceCurrentUser || fallbackCurrentUser;

  const [shares, setShares] = useState(initialShares);
  const [draftText, setDraftText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const composerRef = useRef(null);
  const sidebarRef = useRef(null);

  const allowedIdKeys = useMemo(
    () => new Set(directoryUsers.map((user) => getIdKey(user.id))),
    [directoryUsers],
  );
  const effectiveSelectedUserIds = useMemo(
    () => selectedUserIds.filter((id) => allowedIdKeys.has(getIdKey(id))),
    [selectedUserIds, allowedIdKeys],
  );
  const selectedIdKeys = useMemo(
    () => new Set(effectiveSelectedUserIds.map((id) => getIdKey(id))),
    [effectiveSelectedUserIds],
  );

  const selectedUsers = useMemo(
    () => directoryUsers.filter((user) => selectedIdKeys.has(getIdKey(user.id))),
    [directoryUsers, selectedIdKeys],
  );

  const visibleShares = shares
    .filter((item) => canUserSeeShare(item, currentUser.id))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

  const toggleUser = (userId) => {
    const userIdKey = getIdKey(userId);

    setSelectedUserIds((currentSelection) => {
      const hasUser = currentSelection.some((id) => getIdKey(id) === userIdKey);
      if (hasUser) {
        return currentSelection.filter((id) => getIdKey(id) !== userIdKey);
      }

      return [...currentSelection, userId];
    });
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
    const audienceIds = [...effectiveSelectedUserIds];
    const selectedAudienceKeys = new Set(audienceIds.map((id) => getIdKey(id)));
    const destinationNames = directoryUsers
      .filter((user) => selectedAudienceKeys.has(getIdKey(user.id)))
      .map((user) => user.name);

    const newShare = {
      id: allocateShareId(),
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

    toast.success(`Shared with ${destinationLabel}`);
  };

  const handleOpenAudience = () => {
    sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-3 sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-28 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute -right-24 top-40 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-3)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-330 flex-col gap-4">
        <EnterpriseNavbar />

        <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
          <div className="space-y-3.5">
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
                selectedUserIds={effectiveSelectedUserIds}
                onRemoveAudienceUser={(userId) => {
                  const targetIdKey = getIdKey(userId);
                  setSelectedUserIds((currentSelection) =>
                    currentSelection.filter((id) => getIdKey(id) !== targetIdKey),
                  );
                }}
                onClearAudience={() => setSelectedUserIds([])}
                peopleById={peopleById}
                isSharing={isSharing}
                onOpenAudience={handleOpenAudience}
              />
            </div>
            <SharedBoard
              items={visibleShares}
              peopleById={peopleById}
              viewerUserId={currentUser.id}
            />
          </div>

          <aside ref={sidebarRef}>
            <UsersSidebar
              currentUser={currentUser}
              users={directoryUsers}
              selectedUserIds={effectiveSelectedUserIds}
              onToggleUser={toggleUser}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}

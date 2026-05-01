"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { ShareComposer } from "@/components/share-board/share-composer";
import { SharedBoard } from "@/components/share-board/shared-board";
import { UsersSidebar } from "@/components/share-board/users-sidebar";
import {
  getStoredAccessToken,
  getUsersDirectory,
  getUsersMe,
} from "@/lib/auth-client";
import {
  currentUser as fallbackCurrentUser,
  initialShares,
  onlineUsers as fallbackOnlineUsers,
  peopleById as fallbackPeopleById,
} from "@/lib/mock-data";
import { canUserSeeShare } from "@/lib/utils";

const USER_ACCENT_GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-fuchsia-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
];

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

function getAccentForUserId(id) {
  if (!Number.isFinite(id)) {
    return USER_ACCENT_GRADIENTS[0];
  }

  const index = Math.abs(Number(id)) % USER_ACCENT_GRADIENTS.length;
  return USER_ACCENT_GRADIENTS[index];
}

function toBoardUser(user, fallback = {}) {
  const resolvedId = Number.isFinite(user?.id) ? Number(user.id) : fallback.id || 0;
  const resolvedName =
    typeof user?.name === "string" && user.name.trim()
      ? user.name.trim()
      : fallback.name || "Unknown user";

  return {
    id: resolvedId,
    name: resolvedName,
    role: fallback.role || "Team member",
    presence: fallback.presence || "Available",
    accent: getAccentForUserId(resolvedId),
    email: user?.email || "",
  };
}

function createPeopleById(people) {
  return people.reduce((accumulator, person) => {
    accumulator[person.id] = person;
    return accumulator;
  }, {});
}

export function ShareBoardShell() {
  const [shares, setShares] = useState(initialShares);
  const [currentUser, setCurrentUser] = useState(fallbackCurrentUser);
  const [directoryUsers, setDirectoryUsers] = useState(fallbackOnlineUsers);
  const [peopleById, setPeopleById] = useState(fallbackPeopleById);
  const [draftText, setDraftText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const composerRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadLiveUsers = async () => {
      const accessToken = getStoredAccessToken();
      if (!accessToken) {
        return;
      }

      try {
        const [meResult, directoryResult] = await Promise.all([
          getUsersMe({ accessToken }),
          getUsersDirectory({
            accessToken,
            includeMe: false,
            page: 1,
            limit: 100,
          }),
        ]);

        if (!active) {
          return;
        }

        const meUser = toBoardUser(meResult?.user, fallbackCurrentUser);
        const users = Array.isArray(directoryResult?.users)
          ? directoryResult.users
              .map((user) => toBoardUser(user))
              .filter((user) => user.id !== meUser.id)
          : [];

        setCurrentUser(meUser);
        setDirectoryUsers(users);
        setPeopleById(createPeopleById([meUser, ...users]));
      } catch (_error) {
        if (!active) {
          return;
        }

        setCurrentUser(fallbackCurrentUser);
        setDirectoryUsers(fallbackOnlineUsers);
        setPeopleById(fallbackPeopleById);
      }
    };

    loadLiveUsers();

    return () => {
      active = false;
    };
  }, []);

  const selectedUsers = useMemo(
    () => directoryUsers.filter((user) => selectedUserIds.includes(user.id)),
    [directoryUsers, selectedUserIds]
  );

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
    const destinationNames = directoryUsers
      .filter((user) => audienceIds.includes(user.id))
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

    toast.success(
      `Shared with ${destinationLabel}`,
    );
  };

  const handleOpenAudience = () => {
    sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-3 sm:px-5 lg:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-8rem] top-28 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute right-[-6rem] top-40 h-64 w-64 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-3)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-4">
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
                selectedUserIds={selectedUserIds}
                onRemoveAudienceUser={(userId) =>
                  setSelectedUserIds((currentSelection) =>
                    currentSelection.filter((id) => id !== userId),
                  )
                }
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
              selectedUserIds={selectedUserIds}
              onToggleUser={toggleUser}
            />
          </aside>
        </main>
      </div>
    </div>
  );
}

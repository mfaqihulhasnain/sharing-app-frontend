"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { ShareComposer } from "@/components/share-board/share-composer";
import { SharedBoard } from "@/components/share-board/shared-board";
import { UsersSidebar } from "@/components/share-board/users-sidebar";
import { createShare, getShares, getStoredAccessToken } from "@/lib/auth-client";
import { currentUser as fallbackCurrentUser } from "@/lib/mock-data";
import {
  subscribePresenceShareEvents,
  usePresenceState,
} from "@/lib/presence-store";

let nextAttachmentId = 1;

function allocateAttachmentId() {
  const id = nextAttachmentId;
  nextAttachmentId += 1;
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

const USER_ACCENT_GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-fuchsia-500",
  "from-emerald-400 to-teal-500",
  "from-indigo-400 to-blue-500",
];

function hashString(value) {
  const normalized = typeof value === "string" ? value : String(value || "");
  let hash = 0;

  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash * 31 + normalized.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getAccentForId(id) {
  const key = getIdKey(id);
  const index = key ? hashString(key) % USER_ACCENT_GRADIENTS.length : 0;
  return USER_ACCENT_GRADIENTS[index];
}

function toActorId(userId) {
  if (typeof userId === "number" && Number.isInteger(userId)) {
    return `u:${userId}`;
  }

  const normalizedId = getIdKey(userId);
  if (!normalizedId) {
    return "";
  }

  if (normalizedId.startsWith("u:") || normalizedId.startsWith("g:")) {
    return normalizedId;
  }

  return normalizedId;
}

function toBoardShare(share) {
  if (!share || typeof share !== "object") {
    return null;
  }

  const senderActorId = getIdKey(share.senderActorId);
  if (!senderActorId) {
    return null;
  }

  return {
    id: share.id,
    senderId: senderActorId,
    createdAt: share.createdAt,
    audienceIds: Array.isArray(share.audienceActorIds)
      ? [...new Set(share.audienceActorIds.map((id) => getIdKey(id)).filter(Boolean))]
      : [],
    text: typeof share.text === "string" ? share.text : "",
    files: [],
    senderUser: share.senderUser || null,
  };
}

function normalizeSharePayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.share && typeof payload.share === "object") {
    return payload.share;
  }

  return payload;
}

function canActorSeeShare(share, actorId) {
  const normalizedActorId = getIdKey(actorId);
  if (!normalizedActorId) return false;

  if (getIdKey(share.senderId) === normalizedActorId) {
    return true;
  }

  if (!Array.isArray(share.audienceIds) || share.audienceIds.length === 0) {
    return true;
  }

  return share.audienceIds.some((id) => getIdKey(id) === normalizedActorId);
}

function sortShares(shares) {
  return [...shares].sort((left, right) => {
    const byDate = new Date(right.createdAt) - new Date(left.createdAt);
    if (byDate !== 0) return byDate;
    return getIdKey(right.id).localeCompare(getIdKey(left.id));
  });
}

function mergeShares(currentShares, incomingShares) {
  const map = new Map();

  currentShares.forEach((share) => {
    map.set(getIdKey(share.id), share);
  });

  incomingShares.forEach((share) => {
    if (!share) return;
    map.set(getIdKey(share.id), share);
  });

  return sortShares(Array.from(map.values()));
}

function buildShareSenderPerson(share) {
  const senderId = getIdKey(share.senderId);
  const senderName =
    typeof share?.senderUser?.name === "string" && share.senderUser.name.trim()
      ? share.senderUser.name.trim()
      : senderId.startsWith("g:")
        ? "Guest"
        : "Team member";

  return {
    id: senderId,
    name: senderName,
    role: senderId.startsWith("g:") ? "Guest" : "Team member",
    presence: "Online now",
    accent: getAccentForId(senderId),
    email: typeof share?.senderUser?.email === "string" ? share.senderUser.email : "",
  };
}

export function ShareBoardShell() {
  const {
    currentUser: presenceCurrentUser,
    onlineUsers: directoryUsers,
    peopleById,
    viewerActorId,
    topic,
  } = usePresenceState();
  const currentUser = presenceCurrentUser || fallbackCurrentUser;

  const [shares, setShares] = useState([]);
  const [draftText, setDraftText] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const composerRef = useRef(null);
  const sidebarRef = useRef(null);
  const viewerShareActorId = getIdKey(viewerActorId);

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

  const boardPeopleById = useMemo(() => {
    const combined = { ...peopleById };

    shares.forEach((share) => {
      const senderKey = getIdKey(share.senderId);
      if (!senderKey || combined[senderKey]) {
        return;
      }

      combined[senderKey] = buildShareSenderPerson(share);
    });

    return combined;
  }, [peopleById, shares]);

  useEffect(() => {
    let active = true;

    const loadShares = async () => {
      try {
        const data = await getShares({
          accessToken: getStoredAccessToken() || undefined,
          limit: 100,
        });

        if (!active) return;

        const loadedShares = Array.isArray(data?.shares)
          ? data.shares.map(toBoardShare).filter(Boolean)
          : [];
        setShares(sortShares(loadedShares));
      } catch {
        if (!active) return;
        setShares([]);
      }
    };

    void loadShares();

    return () => {
      active = false;
    };
  }, [viewerActorId]);

  useEffect(() => {
    const unsubscribe = subscribePresenceShareEvents((message) => {
      if (!message || message.event !== "share_created") {
        return;
      }

      if (topic && message.topic && message.topic !== topic) {
        return;
      }

      const sharePayload = normalizeSharePayload(message.payload);
      const boardShare = toBoardShare(sharePayload);
      if (!boardShare) {
        return;
      }
      if (!canActorSeeShare(boardShare, viewerShareActorId)) {
        return;
      }

      setShares((currentShares) => mergeShares(currentShares, [boardShare]));
    });

    return unsubscribe;
  }, [topic, viewerShareActorId]);

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
    if (attachments.length > 0) {
      toast.error("File upload backend is not enabled yet.");
      return;
    }
    if (!viewerShareActorId) {
      toast.error("Unable to resolve your sharing identity.");
      return;
    }

    setIsSharing(true);
    await wait(220);

    const createdAt = new Date().toISOString();
    const audienceIds = [...effectiveSelectedUserIds];
    const audienceActorIds = [
      ...new Set(audienceIds.map((id) => toActorId(id)).filter(Boolean)),
    ];
    const selectedAudienceKeys = new Set(audienceIds.map((id) => getIdKey(id)));
    const destinationNames = directoryUsers
      .filter((user) => selectedAudienceKeys.has(getIdKey(user.id)))
      .map((user) => user.name);
    const optimisticShareId = `temp:${Date.now()}`;

    const optimisticShare = {
      id: optimisticShareId,
      senderId: viewerShareActorId,
      createdAt,
      audienceIds: audienceActorIds,
      text: trimmedText,
      files: [],
      senderUser:
        typeof currentUser?.id === "number" && Number.isInteger(currentUser.id)
          ? {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email || "",
            }
          : null,
    };

    setShares((currentShares) => mergeShares(currentShares, [optimisticShare]));

    try {
      const data = await createShare({
        accessToken: getStoredAccessToken() || undefined,
        text: trimmedText,
        audienceActorIds,
      });
      const createdShare = toBoardShare(data?.share);

      setShares((currentShares) => {
        const withoutOptimistic = currentShares.filter(
          (share) => getIdKey(share.id) !== optimisticShareId,
        );
        return createdShare
          ? mergeShares(withoutOptimistic, [createdShare])
          : withoutOptimistic;
      });
      setDraftText("");
      setAttachments([]);
      setSelectedUserIds([]);

      const destinationLabel =
        audienceIds.length === 0
          ? "everyone on the board"
          : destinationNames.join(", ");
      toast.success(`Shared with ${destinationLabel}`);
    } catch (error) {
      setShares((currentShares) =>
        currentShares.filter((share) => getIdKey(share.id) !== optimisticShareId),
      );
      toast.error(
        typeof error?.message === "string" && error.message
          ? error.message
          : "Unable to share right now.",
      );
    } finally {
      setIsSharing(false);
    }
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
                peopleById={boardPeopleById}
                isSharing={isSharing}
                onOpenAudience={handleOpenAudience}
              />
            </div>
            <SharedBoard
              items={shares}
              peopleById={boardPeopleById}
              viewerActorId={viewerShareActorId}
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

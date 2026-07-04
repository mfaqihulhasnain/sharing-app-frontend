import { Clock3, Globe2, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatTimestamp, getInitials } from "@/lib/utils";

function getIdKey(id) {
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  if (typeof id === "string" && id.trim()) return id.trim();
  return "";
}

function resolveAudiencePerson(peopleById, audienceId) {
  const directKey = getIdKey(audienceId);
  if (directKey && peopleById?.[directKey]) {
    return peopleById[directKey];
  }

  if (typeof audienceId === "string" && audienceId.startsWith("u:")) {
    const userId = audienceId.slice(2).trim();
    if (userId && peopleById?.[userId]) {
      return peopleById[userId];
    }
  }

  return null;
}

function getVisibilityInfo(item, peopleById) {
  if (!item.audienceIds?.length) {
    return {
      label: "Everyone",
      detail: "Visible to everyone on this board",
      icon: Globe2,
      variant: "neutral",
    };
  }

  const names = item.audienceIds
    .map((id) => resolveAudiencePerson(peopleById, id)?.name)
    .filter(Boolean);

  if (!names.length) {
    const peopleLabel = item.audienceIds.length === 1 ? "person" : "people";

    return {
      label: `Only ${item.audienceIds.length} ${peopleLabel}`,
      detail: "Visible only to selected users",
      icon: Users2,
      variant: "accent",
    };
  }

  const leadNames = names.slice(0, 2).join(", ");
  const remainingCount = names.length - 2;
  const suffix = remainingCount > 0 ? ` +${remainingCount}` : "";

  return {
    label: `Only ${leadNames}${suffix}`,
    detail: `Visible only to ${names.join(", ")}`,
    icon: Users2,
    variant: "accent",
  };
}

export function BoardItemCard({
  item,
  person,
  peopleById,
  viewerActorId,
  actions,
  children,
}) {
  const visibility = getVisibilityInfo(item, peopleById);
  const VisibilityIcon = visibility.icon;
  const senderId = getIdKey(item.senderId);
  const viewerId = getIdKey(viewerActorId);

  return (
    <Card className="group overflow-hidden rounded-2xl border-line/80 bg-card-strong shadow-[0_8px_24px_rgba(15,23,42,0.045)] transition duration-200 hover:border-accent-border/70 hover:shadow-[0_14px_32px_rgba(15,23,42,0.065)]">
      <div className="p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm ring-1 ring-white/35",
                person.accent,
              )}
            >
              {getInitials(person.name)}
            </div>

            <div className="min-w-0 pt-0.5">
              <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                <p className="max-w-full truncate text-sm font-semibold leading-5 tracking-tight text-foreground">
                  {person.name}
                </p>
                {viewerId && senderId === viewerId && (
                  <Badge variant="accent" className="px-1.5 py-0.5 text-[10px]">
                    You
                  </Badge>
                )}
                <span className="hidden text-muted-soft sm:inline" aria-hidden="true">
                  &bull;
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatTimestamp(item.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <div
              className={cn(
                "inline-flex max-w-[12rem] items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                visibility.variant === "accent"
                  ? "border-accent-border bg-accent-soft text-accent"
                  : "border-line bg-card-muted text-muted",
              )}
              title={visibility.detail}
            >
              <VisibilityIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{visibility.label}</span>
            </div>
            {actions}
          </div>
        </div>

        <div className="mt-2.5 space-y-2">{children}</div>
      </div>
    </Card>
  );
}

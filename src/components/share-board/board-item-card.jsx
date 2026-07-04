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
    return {
      label: `Only ${item.audienceIds.length} people`,
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
  children,
}) {
  const visibility = getVisibilityInfo(item, peopleById);
  const VisibilityIcon = visibility.icon;
  const senderId = getIdKey(item.senderId);
  const viewerId = getIdKey(viewerActorId);

  return (
    <Card className="group rounded-[22px] border-line/85 bg-card-strong p-4 shadow-[0_12px_30px_rgba(15,23,42,0.045)] transition duration-200 hover:-translate-y-0.5 hover:border-accent-border/70 hover:shadow-[0_18px_38px_rgba(15,23,42,0.075)] sm:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[12px] font-semibold text-white shadow-sm ring-1 ring-white/35",
                person.accent,
              )}
            >
              {getInitials(person.name)}
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate text-sm font-semibold leading-none tracking-tight text-foreground">
                  {person.name}
                </p>
                {viewerId && senderId === viewerId && (
                  <Badge variant="accent" className="px-1.5 py-0.5 text-[10px]">
                    You
                  </Badge>
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatTimestamp(item.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "inline-flex max-w-full shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:max-w-[15rem]",
              visibility.variant === "accent"
                ? "border-accent-border bg-accent-soft text-accent"
                : "border-line bg-card-muted text-muted",
            )}
            title={visibility.detail}
          >
            <VisibilityIcon className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{visibility.label}</span>
          </div>
        </div>

        <div className="space-y-2.5">{children}</div>
      </div>
    </Card>
  );
}

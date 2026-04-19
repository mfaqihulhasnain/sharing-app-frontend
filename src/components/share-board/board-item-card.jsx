import { Clock3, Globe2, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { currentUser } from "@/lib/mock-data";
import { cn, formatTimestamp, getInitials } from "@/lib/utils";

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
    .map((id) => peopleById?.[id]?.name)
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
  children,
}) {
  const visibility = getVisibilityInfo(item, peopleById);
  const VisibilityIcon = visibility.icon;

  return (
    <Card className="rounded-2xl border-line bg-card-strong p-3.5 transition duration-200 hover:border-accent-border/60 sm:p-4">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-start gap-2.5">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-semibold text-white shadow-sm",
                person.accent,
              )}
            >
              {getInitials(person.name)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="truncate text-sm font-semibold leading-none tracking-tight text-foreground">
                  {person.name}
                </p>
                {item.senderId === currentUser.id && (
                  <Badge variant="accent" className="px-1.5 py-0.5 text-[10px]">
                    You
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatTimestamp(item.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
              visibility.variant === "accent"
                ? "border-accent-border bg-accent-soft text-accent"
                : "border-line bg-card-muted text-muted",
            )}
            title={visibility.detail}
          >
            <VisibilityIcon className="h-3.5 w-3.5" />
            <span className="max-w-[12rem] truncate">{visibility.label}</span>
          </div>
        </div>

        <div className="space-y-2">{children}</div>
      </div>
    </Card>
  );
}

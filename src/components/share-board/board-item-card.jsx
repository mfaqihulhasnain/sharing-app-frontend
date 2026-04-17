import { Clock3, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatTimestamp, getInitials } from "@/lib/utils";

export function BoardItemCard({ item, person, children }) {
  return (
    <Card className="rounded-[28px] border-line bg-card-strong p-5 transition duration-300 hover:-translate-y-0.5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-semibold text-white shadow-sm",
              person.accent,
            )}
          >
            {getInitials(person.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold tracking-tight text-foreground">
                {person.name}
              </p>
              {item.senderId === "you" && <Badge variant="accent">You</Badge>}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {formatTimestamp(item.createdAt)}
              </span>
              {item.audienceIds.length > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Users2 className="h-3.5 w-3.5" />
                  {item.audienceIds.length} selected
                </span>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </Card>
  );
}

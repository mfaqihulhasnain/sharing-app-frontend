import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ connected = true, label }) {
  const Icon = connected ? Wifi : WifiOff;

  return (
    <Badge
      variant={connected ? "success" : "neutral"}
      className="gap-2 px-3.5 py-1.5 text-[12px]"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

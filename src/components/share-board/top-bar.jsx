import { PanelTopOpen, Settings2, Sparkles, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/share-board/status-badge";

export function TopBar({ onlineCount, onQuickUpload }) {
  return (
    <Card className="sticky top-4 z-20 rounded-[30px] border-line bg-card-strong px-4 py-4 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-sm"
          >
            <PanelTopOpen className="h-5 w-5" />
          </motion.div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[1.15rem] font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
                Nearboards
              </h1>
              <Badge variant="accent" className="hidden sm:inline-flex">
                Single shared workspace
              </Badge>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted">
              Share notes and files across the same local board, then let
              audience rules quietly handle who can see each item.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" className="gap-2 px-3.5 py-1.5">
              <UsersRound className="h-3.5 w-3.5" />
              {onlineCount} online now
            </Badge>
            <StatusBadge connected label="Local network connected" />
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="shadow-none" onClick={onQuickUpload}>
              <Sparkles className="h-4 w-4" />
              Upload
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Settings placeholder"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}


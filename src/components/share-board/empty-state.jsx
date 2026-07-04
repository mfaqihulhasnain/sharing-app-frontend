import { LayoutGrid, UploadCloud } from "lucide-react";

export function EmptyState() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-dashed border-line/85 bg-card-strong shadow-[0_14px_34px_rgba(15,23,42,0.045)]">
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center sm:px-8 sm:py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-accent-border bg-accent-soft text-accent shadow-sm">
          <LayoutGrid className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
          Nothing is visible on your board yet
        </h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">
          Add a note or attach files in the composer above. Shares you can access
          will appear here in the live activity stream.
        </p>
        <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-card-muted px-3 py-1.5 text-xs text-muted">
          <UploadCloud className="h-3.5 w-3.5 shrink-0 text-accent" />
          <span className="truncate">Drag files into the composer to start.</span>
        </div>
      </div>
    </div>
  );
}

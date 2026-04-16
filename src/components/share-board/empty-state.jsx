import { LayoutGrid } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[30px] border border-dashed border-line bg-white/62 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-soft-blue text-accent">
        <LayoutGrid className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">
        Nothing is visible on your board yet
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted">
        Share a note or drop a file into the composer above. Everything you can
        access will appear here in the same unified stream.
      </p>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[132px] w-full rounded-[24px] border border-line bg-card px-5 py-4 text-sm leading-7 text-foreground shadow-sm outline-none transition placeholder:text-muted-soft focus-visible:border-accent/45 focus-visible:ring-4 focus-visible:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

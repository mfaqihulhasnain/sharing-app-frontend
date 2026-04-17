import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "border-line bg-card-muted text-muted",
        success: "border-success-border bg-success-soft text-success-text",
        accent: "border-accent-border bg-accent-soft text-accent",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

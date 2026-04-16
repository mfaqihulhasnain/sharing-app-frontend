import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        neutral: "border-line bg-white/75 text-muted",
        success: "border-emerald-200 bg-soft-emerald text-emerald-700",
        accent: "border-blue-200 bg-soft-blue text-accent",
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

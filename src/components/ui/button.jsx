import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent/30",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover",
        secondary:
          "border border-line bg-card text-foreground shadow-sm hover:bg-card-muted",
        outline:
          "border border-line bg-card-muted text-foreground hover:bg-card",
        ghost: "text-muted hover:bg-card-muted hover:text-foreground",
        subtle: "bg-accent-soft text-accent hover:bg-accent-soft/80",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-6 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { buttonVariants };

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent/30",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground shadow-[0_12px_30px_rgba(45,116,255,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(45,116,255,0.28)]",
        secondary:
          "bg-white/90 text-foreground shadow-sm hover:bg-white",
        outline:
          "border border-line bg-white/70 text-foreground hover:bg-white/90",
        ghost: "text-muted hover:bg-white/70 hover:text-foreground",
        subtle: "bg-soft-blue text-accent hover:bg-soft-blue/80",
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

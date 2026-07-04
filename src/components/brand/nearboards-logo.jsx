import { cn } from "@/lib/utils";

export function NearboardsMark({ className, inverse = false }) {
  const baseFill = inverse ? "#ffffff" : "#f8fbff";
  const baseStroke = inverse ? "rgba(255,255,255,0.34)" : "#d8e4f2";
  const mutedBoard = inverse ? "#dbeafe" : "#eaf2ff";

  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill={baseFill}
        stroke={baseStroke}
        strokeWidth="1.5"
      />
      <path
        d="M12.7 27.3V12.7L27.3 27.3V12.7"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="8.3" y="8.3" width="9.2" height="9.2" rx="3" fill="#2563eb" />
      <rect x="8.3" y="22.5" width="9.2" height="9.2" rx="3" fill={mutedBoard} />
      <rect x="22.5" y="8.3" width="9.2" height="9.2" rx="3" fill={mutedBoard} />
      <rect x="22.5" y="22.5" width="9.2" height="9.2" rx="3" fill="#0f172a" />
      <circle cx="12.9" cy="27.1" r="1.55" fill="#2563eb" />
      <circle cx="27.1" cy="12.9" r="1.55" fill="#2563eb" />
    </svg>
  );
}

export function NearboardsLogo({
  className,
  markClassName,
  wordmarkClassName,
  inverse = false,
  showWordmark = true,
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <NearboardsMark className={markClassName} inverse={inverse} />
      {showWordmark ? (
        <span
          className={cn(
            "text-[15px] font-semibold leading-none tracking-normal text-foreground",
            inverse && "text-white",
            wordmarkClassName,
          )}
        >
          Nearboards
        </span>
      ) : null}
    </span>
  );
}

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 18 18"
      className="h-4 w-4"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.56 2.68-3.86 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.33-1.58-5.04-3.7H.96v2.32A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.96 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.28-1.72V4.96H.96A9 9 0 0 0 0 9c0 1.45.34 2.82.96 4.04l3-2.32Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.34l2.58-2.58C13.46.9 11.42 0 9 0A9 9 0 0 0 .96 4.96l3 2.32c.7-2.12 2.7-3.7 5.04-3.7Z"
      />
    </svg>
  );
}

const GOOGLE_BUTTON_TEXT_BY_ACTION = {
  sign_in: "Sign in with Google",
  sign_up: "Sign up with Google",
  continue: "Continue with Google",
};

export function GoogleAuthButton({ href, className, action = "continue" }) {
  const buttonText =
    GOOGLE_BUTTON_TEXT_BY_ACTION[action] || GOOGLE_BUTTON_TEXT_BY_ACTION.continue;

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "h-10 w-full rounded-full border border-[#747775] bg-white px-0 text-sm font-medium text-[#1f1f1f] shadow-none transition-colors hover:bg-[#f8f9fa] hover:text-[#1f1f1f] focus-visible:border-[#1a73e8] focus-visible:ring-4 focus-visible:ring-[#1a73e8]/20 disabled:border-0 disabled:bg-[#f2f2f2] disabled:text-[#9aa0a6]",
        className,
      )}
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
      asChild
    >
      <a href={href} className="flex w-full items-center justify-center gap-2.5 px-3">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
          <GoogleMark />
        </span>
        <span className="leading-5">{buttonText}</span>
      </a>
    </Button>
  );
}

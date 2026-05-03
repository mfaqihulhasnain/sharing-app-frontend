import Link from "next/link";
import { ArrowLeft, CheckCircle2, Grid2x2Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthShell({
  title,
  description,
  children,
  footer,
  showSidebar = true,
  showBrand = true,
  showBackHome = false,
}) {
  return (
    <div className="relative h-dvh overflow-hidden px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 [@media(max-height:780px)]:px-3 [@media(max-height:780px)]:py-3">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-20 top-16 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute -right-12 top-28 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "var(--bg-orb-2)" }}
        />
      </div>

      <div
        className={cn(
          "relative mx-auto grid h-full w-full gap-5 lg:gap-6 [@media(max-height:860px)]:gap-4",
          showSidebar ? "max-w-6xl lg:grid-cols-[minmax(0,1fr)_470px]" : "max-w-[460px]",
        )}
      >
        {showSidebar ? (
          <Card className="hidden min-h-[560px] overflow-hidden rounded-[30px] border-line/90 bg-card-strong p-8 lg:flex lg:flex-col lg:justify-between [@media(max-height:860px)]:p-6">
            <div className="space-y-10 [@media(max-height:860px)]:space-y-6">
              <Link
                href="/"
                className="inline-flex w-fit items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-card-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Grid2x2Check className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  Sharing Board
                </span>
              </Link>

              <div className="space-y-3 [@media(max-height:860px)]:space-y-2">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Trusted local collaboration
                </p>
                <h2 className="max-w-md text-[1.92rem] leading-tight font-semibold tracking-tight text-foreground [@media(max-height:860px)]:text-[1.6rem]">
                  Share what matters, without noise.
                </h2>
                <p className="max-w-md text-sm leading-6 text-muted [@media(max-height:860px)]:leading-5">
                  One clean board for quick handoffs, private updates, and fewer
                  coordination gaps across your team.
                </p>
              </div>
            </div>

          </Card>
        ) : null}

        <div className="flex h-full items-center justify-center">
          <Card
            className={cn(
              "w-full max-w-[470px] rounded-[28px] border-line/90 bg-card-strong px-5 py-6 [@media(max-height:860px)]:px-4 [@media(max-height:860px)]:py-4",
              showSidebar
                ? "sm:px-7 sm:py-7"
                : "max-w-[460px] border-line bg-card-strong shadow-board sm:px-7 sm:py-7",
            )}
          >
            <div
              className={cn(
                "space-y-5 [@media(max-height:860px)]:space-y-3",
                !showSidebar && "[@media(min-height:900px)]:space-y-6",
              )}
            >
              <div className={cn("space-y-3 [@media(max-height:860px)]:space-y-2", !showSidebar && "space-y-4")}>
                {showBackHome ? (
                  <Link
                    href="/"
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg px-1 py-1 text-xs font-medium text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to home
                  </Link>
                ) : null}

                {showBrand ? (
                  <Link
                    href="/"
                    className={cn(
                      "inline-flex w-fit items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-card-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                      showSidebar ? "lg:hidden" : "mx-auto justify-center",
                    )}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Grid2x2Check className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-base font-semibold tracking-tight text-foreground">
                      Sharing Board
                    </span>
                  </Link>
                ) : null}
                <div className={cn("space-y-1 [@media(max-height:860px)]:space-y-0.5", !showSidebar && "space-y-1.5 text-center")}>
                  <h1
                    className={cn(
                      "text-2xl font-semibold tracking-tight text-foreground [@media(max-height:860px)]:text-[1.35rem]",
                      !showSidebar && "text-[1.9rem] [@media(max-height:860px)]:text-[1.45rem]",
                    )}
                  >
                    {title}
                  </h1>
                  <p className="text-sm leading-6 text-muted [@media(max-height:860px)]:text-[13px] [@media(max-height:860px)]:leading-5 [@media(max-height:760px)]:hidden">
                    {description}
                  </p>
                </div>
              </div>

              <div>{children}</div>

              {footer ? (
                <p
                  className={cn(
                    "text-center text-sm text-muted [@media(max-height:760px)]:text-xs [@media(max-height:760px)]:leading-4 [&_a]:font-medium [&_a]:text-foreground [&_a]:underline-offset-4 [&_a]:transition hover:[&_a]:underline",
                  )}
                >
                  {footer}
                </p>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


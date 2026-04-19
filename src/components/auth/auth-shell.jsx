import Link from "next/link";
import { CheckCircle2, Grid2x2Check, Lock, ShieldCheck, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Secure by design",
    description: "Private board sessions with clear visibility controls for every share.",
  },
  {
    icon: UsersRound,
    title: "Built for teams",
    description: "Keep everyone aligned with one shared local workspace.",
  },
  {
    icon: Lock,
    title: "Reliable handoffs",
    description: "Pass files and notes quickly without losing context.",
  },
];

export function AuthShell({ title, description, children, footer }) {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
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

      <div className="relative mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_470px] lg:gap-6">
        <Card className="hidden min-h-[560px] overflow-hidden rounded-[30px] border-line/90 bg-card-strong p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-8">
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

            <div className="space-y-2">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Local collaboration, enterprise-grade UX
              </p>
              <h2 className="max-w-md text-[1.8rem] leading-tight font-semibold tracking-tight text-foreground">
                Move files and updates across your workspace with total clarity.
              </h2>
              <p className="max-w-md text-sm leading-6 text-muted">
                Sign in to continue sharing text and files with everyone, or only the
                teammates who need to see them.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-line/80 bg-card-muted/55 p-3.5"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-card text-accent">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs leading-5 text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center lg:min-h-0">
          <Card className="w-full max-w-[470px] rounded-[28px] border-line/90 bg-card-strong px-5 py-6 sm:px-7 sm:py-7">
            <div className="space-y-5">
              <div className="space-y-3">
                <Link
                  href="/"
                  className="inline-flex w-fit items-center gap-2 rounded-xl px-1 py-1 transition hover:bg-card-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 lg:hidden"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Grid2x2Check className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-base font-semibold tracking-tight text-foreground">
                    Sharing Board
                  </span>
                </Link>
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {title}
                  </h1>
                  <p className="text-sm leading-6 text-muted">{description}</p>
                </div>
              </div>

              <div>{children}</div>

              {footer ? (
                <p
                  className={cn(
                    "text-center text-sm text-muted [&_a]:font-medium [&_a]:text-foreground [&_a]:underline-offset-4 [&_a]:transition hover:[&_a]:underline",
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


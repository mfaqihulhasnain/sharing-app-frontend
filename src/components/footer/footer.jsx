"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Wifi } from "lucide-react";
import { NearboardsLogo } from "@/components/brand/nearboards-logo";
import { cn } from "@/lib/utils";

const FOOTER_LINK_GROUPS = [
  {
    heading: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Features", href: "/features" },
      { label: "Open board", href: "/#share-composer" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Create account", href: "/register" },
      { label: "Sign in", href: "/login" },
      { label: "Reset password", href: "/forgot-password" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];


function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  );
}

function isLinkActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  const [pathPart] = href.split("#");
  if (!pathPart || pathPart === "/") {
    return pathname === "/";
  }

  return pathname === pathPart || pathname.startsWith(`${pathPart}/`);
}

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto w-full overflow-hidden border-t border-white/10 bg-[#050913] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-24 bottom-10 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-330 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="space-y-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-lg px-1 py-1 transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <NearboardsLogo
                inverse
                markClassName="h-8 w-8"
                wordmarkClassName="text-[17px] text-white"
              />
            </Link>

            <p
              className="max-w-[18rem] text-[1.95rem] leading-[1.07] tracking-[-0.05em] text-white/95"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
            >
              Built for local-first teams.
            </p>

            <p className="max-w-92 text-[13.5px] leading-6 text-white/55">
              One shared board for fast handoffs, clear updates, and better
              coordination across the same network.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-medium text-[#0a0f18] transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Start free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center rounded-full border border-white/20 px-3.5 py-1.5 text-[12px] font-medium text-white/75 transition hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              >
                Explore features
              </Link>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/45 px-3 py-1.5">
              <LiveDot />
              <Wifi className="h-3.5 w-3.5 text-emerald-300/90" />
              <span className="text-[11px] font-medium text-emerald-300">
                Runs on your local WiFi
              </span>
            </div>
          </div>

          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-3">
              <p className="text-[11px] font-medium uppercase tracking-[1.5px] text-white/35">
                {group.heading}
              </p>
              <nav aria-label={`${group.heading} links`} className="flex flex-col gap-2">
                {group.links.map((link) => {
                  const active = isLinkActive(pathname, link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "w-fit rounded-md px-1 py-0.5 text-[14px] font-light transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                        active
                          ? "text-white"
                          : "text-white/58 hover:text-white/90",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-[12px] text-white/32">
            &copy; {currentYear} Nearboards. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5 text-[12px] text-white/28">
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M6 10S1.5 7 1.5 4a2.5 2.5 0 015 0 2.5 2.5 0 015 0C11.5 7 6 10 6 10z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Made with care for local teams
          </p>
        </div>
      </div>
    </footer>
  );
}


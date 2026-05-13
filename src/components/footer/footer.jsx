"use client";

import Link from "next/link";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const NAV_COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function BrandMark() {
  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] bg-white">
      <div className="h-[10px] w-[10px] rounded-[2.5px] border-[1.8px] border-[#0d0e12]" />
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full px-4 pb-4 sm:px-5 lg:px-6">
      <div className="mx-auto w-full max-w-330 overflow-hidden rounded-[20px] bg-[#0d0e12]">

        {/* ── MAIN CONTENT ── */}
        <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.6fr_repeat(3,1fr)]">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            {/* Logo row */}
            <div className="flex items-center gap-2">
              <BrandMark />
              <span
                className="text-[15px] tracking-[-0.3px] text-white"
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontWeight: 400,
                }}
              >
                Sharing Board
              </span>
            </div>

            {/* Tagline */}
            <p
              className="max-w-[200px] text-[18px] font-light leading-[1.3] tracking-[-0.03em] text-white/85"
              style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
            >
              One board. Everyone in the room.{" "}
              <em
                className="not-italic"
                style={{ fontStyle: "italic", color: "rgba(255,255,255,0.45)" }}
              >
                Always in sync.
              </em>
            </p>

            {/* WiFi badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/50 px-3 py-1.5">
              <LiveDot />
              <span className="text-[11px] font-medium text-emerald-300">
                Runs on your local WiFi
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[1.3px] text-white/35">
                {col.heading}
              </p>
              <nav className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[13px] font-light text-white/55 transition-colors duration-150 hover:text-white/90 focus-visible:outline-none focus-visible:text-white/90"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] px-8 py-4 sm:px-10">
          <p className="text-[12px] font-light text-white/30">
            &copy; {currentYear} Sharing Board. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-[12px] font-light text-white/25">
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              className="flex-shrink-0"
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
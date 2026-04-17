"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Grid2x2Check, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isItemActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function EnterpriseNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1480px]">
        <nav
          aria-label="Primary navigation"
          className="relative flex h-16 items-center justify-between rounded-2xl border border-line/90 bg-card/88 px-3 shadow-[0_12px_26px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-4"
        >
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="group inline-flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-foreground transition hover:bg-card-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:scale-[1.02]">
              <Grid2x2Check className="h-4.5 w-4.5" />
            </span>
            <span className="text-[1.03rem] font-semibold tracking-tight">
              Sharing Board
            </span>
          </Link>

          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                      active
                        ? "text-foreground"
                        : "text-muted hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && (
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-accent-border bg-accent-soft"
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Button
            type="button"
            size="icon"
            variant="outline"
            className={cn(
              "lg:hidden",
              isOpen && "border-accent-border bg-accent-soft text-accent",
            )}
            aria-expanded={isOpen}
            aria-controls="mobile-navbar-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((currentOpen) => !currentOpen)}
          >
            {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </Button>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close mobile navigation menu"
                className="fixed inset-0 z-40 bg-foreground/8 backdrop-blur-[2px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                id="mobile-navbar-menu"
                className="absolute inset-x-0 top-[calc(100%+0.65rem)] z-50 lg:hidden"
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="rounded-2xl border border-line bg-card p-2 shadow-board">
                  <ul className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const active = isItemActive(pathname, item.href);

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex w-full items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                              active
                                ? "border border-accent-border bg-accent-soft text-foreground"
                                : "text-muted hover:bg-card-muted hover:text-foreground",
                            )}
                            aria-current={active ? "page" : undefined}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Loader2,
  LogOut,
  Menu,
  UserCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  logoutSession,
} from "@/lib/auth-client";
import {
  clearCurrentUserState,
  loadCurrentUser,
  readCurrentUserState,
  subscribeCurrentUser,
} from "@/lib/current-user-store";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   CONSTANTS — unchanged from original
───────────────────────────────────────────── */

const BASE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/* ─────────────────────────────────────────────
   HELPERS — unchanged from original
───────────────────────────────────────────── */

function isItemActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getCircleLabel(user) {
  const rawName = user?.name?.trim() || user?.email?.trim() || "U";
  return rawName.charAt(0).toUpperCase();
}

/* ─────────────────────────────────────────────
   BRAND MARK — self-contained, no icon dep
───────────────────────────────────────────── */

function BrandMark() {
  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] bg-foreground">
      <div className="h-[10px] w-[10px] rounded-[2.5px] border-[2px] border-white/88" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LIVE DOT — for board nav item when signed in
───────────────────────────────────────────── */

function LiveDot() {
  return (
    <span className="relative mr-1.5 flex h-1.5 w-1.5 flex-shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
    </span>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT — all logic identical to original
───────────────────────────────────────────── */

export function EnterpriseNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  /* ── All state exactly as original ── */
  const initialUserState = readCurrentUserState();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(initialUserState.user);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef(null);

  const isSignedIn = Boolean(currentUser);

  /* ── navItems memo exactly as original ── */
  const navItems = useMemo(
    () =>
      isSignedIn
        ? BASE_NAV_ITEMS
        : isCheckingAuth
          ? BASE_NAV_ITEMS
          : [...BASE_NAV_ITEMS, { label: "Login", href: "/login" }],
    [isSignedIn, isCheckingAuth],
  );

  /* ── Auth loading effect exactly as original ── */
  useEffect(() => {
    let active = true;

    const applyUserState = (nextState) => {
      if (!active) return;
      const hasToken = Boolean(getStoredAccessToken());
      setCurrentUser(nextState.user);
      setIsCheckingAuth(
        nextState.isLoading || (!nextState.hasResolved && hasToken),
      );
    };

    applyUserState(readCurrentUserState());
    const unsubscribe = subscribeCurrentUser(applyUserState);
    void loadCurrentUser().catch(() => {});

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  /* ── Escape key effect exactly as original ── */
  useEffect(() => {
    if (!isOpen && !isUserMenuOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, isUserMenuOpen]);

  /* ── Outside click effect exactly as original ── */
  useEffect(() => {
    if (!isUserMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (userMenuRef.current?.contains(event.target)) return;
      setIsUserMenuOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isUserMenuOpen]);

  /* ── Logout handler exactly as original ── */
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutSession({ accessToken: getStoredAccessToken() });
    } catch {
      // Local sign-out should still proceed even if backend revoke fails.
    }

    clearStoredAccessToken();
    clearCurrentUserState();
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    setIsOpen(false);
    setIsLoggingOut(false);

    router.push("/login");
    router.refresh();
  };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */

  return (
    <header className="sticky top-2 z-50">

      {/* ── MAIN NAV BAR ── */}
      <nav
        aria-label="Primary navigation"
        className="relative flex h-[52px] items-center gap-2 rounded-[14px] border border-line/90 bg-card/95 px-3 shadow-[0_8px_20px_rgba(15,23,42,0.07)] backdrop-blur-lg"
      >

        {/* Brand */}
        <Link
          href="/"
          onClick={() => {
            setIsOpen(false);
            setIsUserMenuOpen(false);
          }}
          className="group inline-flex flex-shrink-0 items-center gap-2 rounded-[10px] px-2 py-1.5 text-foreground transition-colors duration-150 hover:bg-card-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <BrandMark />
          <span
            className="text-[15px] tracking-[-0.3px] text-foreground"
            style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontWeight: 400 }}
          >
            Sharing Board
          </span>
        </Link>

        {/* ── Desktop nav pills ── */}
        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <ul className="flex items-center gap-0.5 rounded-full border border-line/75 bg-card-muted/70 p-[3px]">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item.href);
              const isBoard = item.href === "/" && isSignedIn;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center rounded-full px-3.5 py-[5px] text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                      active
                        ? "font-medium text-foreground"
                        : "font-normal text-muted hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {/* Active pill background */}
                    {active && (
                      <motion.span
                        layoutId="active-nav-pill"
                        className="absolute inset-0 -z-10 rounded-full border border-line/80 bg-card shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                    {/* Live dot on Board item when signed in */}
                    {isBoard && <LiveDot />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Right side actions ── */}
        <div className="ml-auto flex items-center gap-2">

          {/* Auth checking skeleton */}
          {isCheckingAuth && (
            <div className="hidden h-[34px] w-[68px] animate-pulse items-center justify-center rounded-[9px] border border-line/70 bg-card-muted/50 lg:flex">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-muted/60" />
            </div>
          )}

          {/* Signed-in user chip + dropdown */}
          {!isCheckingAuth && isSignedIn && (
            <div ref={userMenuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className={cn(
                  "inline-flex h-[34px] items-center gap-1.5 rounded-full border bg-card-muted/60 pl-1 pr-2.5 text-[13px] font-normal text-foreground transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                  isUserMenuOpen
                    ? "border-accent/30 bg-accent-soft/60"
                    : "border-line/80 hover:border-line hover:bg-card",
                )}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label="Open account menu"
              >
                {/* Avatar circle */}
                <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
                  {getCircleLabel(currentUser)}
                </span>
                {/* Name — show first name only if available */}
                <span className="max-w-[80px] truncate">
                  {currentUser?.name?.split(" ")[0] || currentUser?.email?.split("@")[0] || "Account"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 flex-shrink-0 text-muted transition-transform duration-200",
                    isUserMenuOpen && "rotate-180 text-foreground",
                  )}
                />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-[calc(100%+6px)] z-50 w-44 overflow-hidden rounded-[14px] border border-line/80 bg-card shadow-[0_12px_28px_rgba(15,23,42,0.1)]"
                    role="menu"
                  >
                    {/* User info header */}
                    <div className="border-b border-line/70 px-3 py-2.5">
                      <p className="text-[13px] font-medium text-foreground">
                        {currentUser?.name || "Your account"}
                      </p>
                      {currentUser?.email && (
                        <p className="mt-0.5 truncate text-[11px] font-light text-muted">
                          {currentUser.email}
                        </p>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-[13px] font-normal text-foreground transition-colors duration-100 hover:bg-card-muted"
                        role="menuitem"
                      >
                        <UserCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-muted" />
                        Profile
                      </Link>

                      <div className="my-1 h-px bg-line/60" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-[13px] font-normal text-red-600 transition-colors duration-100 hover:bg-red-50 disabled:opacity-60"
                        role="menuitem"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-3.5 w-3.5 flex-shrink-0 animate-spin" />
                        ) : (
                          <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                        {isLoggingOut ? "Logging out…" : "Log out"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Signed-out CTA buttons — desktop */}
          {!isCheckingAuth && !isSignedIn && (
            <div className="hidden items-center gap-2 lg:flex">
              <Button
                asChild
                variant="outline"
                className="h-[34px] px-3.5 text-[13px] font-normal shadow-none"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                className="h-[34px] gap-1.5 px-3.5 text-[13px] font-medium shadow-none"
              >
                <Link href="/register">
                  Get started
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <path
                      d="M2.5 6h7M6.5 3l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </Button>
            </div>
          )}

          {/* ── Mobile hamburger ── */}
          <Button
            type="button"
            size="icon"
            variant="outline"
            className={cn(
              "h-[34px] w-[34px] rounded-[9px] shadow-none lg:hidden",
              isOpen && "border-accent/30 bg-accent-soft/60 text-accent",
            )}
            aria-expanded={isOpen}
            aria-controls="mobile-navbar-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close mobile navigation menu"
              className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              id="mobile-navbar-menu"
              className="absolute inset-x-0 top-[calc(100%+6px)] z-50 lg:hidden"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="overflow-hidden rounded-[14px] border border-line/80 bg-card shadow-[0_16px_36px_rgba(15,23,42,0.1)]">

                {/* Nav links */}
                <ul className="p-1.5">
                  {navItems.map((item) => {
                    const active = isItemActive(pathname, item.href);
                    const isBoard = item.href === "/" && isSignedIn;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-[9px] px-3 py-2.5 text-[14px] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                            active
                              ? "bg-card-muted/70 font-medium text-foreground"
                              : "font-normal text-muted hover:bg-card-muted/50 hover:text-foreground",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          {isBoard && <LiveDot />}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile user section or CTA */}
                <div className="border-t border-line/70 p-2">
                  {!isCheckingAuth && isSignedIn ? (
                    /* Signed-in: show avatar row + logout */
                    <div className="space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 rounded-[9px] px-3 py-2.5 text-[14px] font-normal text-foreground transition-colors hover:bg-card-muted/50"
                      >
                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                          {getCircleLabel(currentUser)}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-[13px] font-medium text-foreground leading-tight">
                            {currentUser?.name || "Your account"}
                          </span>
                          {currentUser?.email && (
                            <span className="text-[11px] font-light text-muted leading-tight">
                              {currentUser.email}
                            </span>
                          )}
                        </span>
                        <UserCircle2 className="ml-auto h-4 w-4 text-muted" />
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center gap-2 rounded-[9px] px-3 py-2.5 text-[14px] font-normal text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                      >
                        {isLoggingOut ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        {isLoggingOut ? "Logging out…" : "Log out"}
                      </button>
                    </div>
                  ) : (
                    /* Signed-out: show auth buttons */
                    <div className="flex flex-col gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="h-10 w-full text-[14px] font-normal shadow-none"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/login">Sign in</Link>
                      </Button>
                      <Button
                        asChild
                        className="h-10 w-full gap-1.5 text-[14px] font-medium shadow-none"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/register">
                          Get started
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className="flex-shrink-0"
                          >
                            <path
                              d="M2.5 6h7M6.5 3l3 3-3 3"
                              stroke="currentColor"
                              strokeWidth="1.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Grid2x2Check, Loader2, LogOut, Menu, UserCircle2, X } from "lucide-react";
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

const BASE_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
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

function getCircleLabel(user) {
  const rawName = user?.name?.trim() || user?.email?.trim() || "U";
  return rawName.charAt(0).toUpperCase();
}

export function EnterpriseNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const initialUserState = readCurrentUserState();
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState(initialUserState.user);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userMenuRef = useRef(null);

  const isSignedIn = Boolean(currentUser);
  const navItems = useMemo(
    () =>
      isSignedIn
        ? BASE_NAV_ITEMS
        : isCheckingAuth
          ? BASE_NAV_ITEMS
          : [...BASE_NAV_ITEMS, { label: "Login", href: "/login" }],
    [isSignedIn, isCheckingAuth],
  );

  useEffect(() => {
    let active = true;

    const applyUserState = (nextState) => {
      if (!active) {
        return;
      }

      const hasToken = Boolean(getStoredAccessToken());
      setCurrentUser(nextState.user);
      setIsCheckingAuth(nextState.isLoading || (!nextState.hasResolved && hasToken));
    };

    applyUserState(readCurrentUserState());
    const unsubscribe = subscribeCurrentUser(applyUserState);
    void loadCurrentUser().catch(() => {});

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isOpen && !isUserMenuOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isUserMenuOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (userMenuRef.current?.contains(event.target)) {
        return;
      }

      setIsUserMenuOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isUserMenuOpen]);

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

  return (
    <header className="sticky top-2 z-50">
      <nav
        aria-label="Primary navigation"
        className="relative flex h-14 items-center rounded-xl border border-line/90 bg-card/92 px-2.5 shadow-[0_8px_18px_rgba(15,23,42,0.06)] backdrop-blur-lg sm:px-3.5"
      >
        <Link
          href="/"
          onClick={() => {
            setIsOpen(false);
            setIsUserMenuOpen(false);
          }}
          className="group inline-flex shrink-0 items-center gap-2 rounded-lg px-1.5 py-1 text-foreground transition hover:bg-card-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent transition group-hover:scale-[1.02]">
            <Grid2x2Check className="h-4 w-4" />
          </span>
          <span className="text-[0.98rem] font-semibold tracking-tight">
            Sharing Board
          </span>
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <ul className="flex items-center gap-0.5 rounded-full border border-line/80 bg-card-muted/75 p-1">
            {navItems.map((item) => {
              const active = isItemActive(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
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
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {!isCheckingAuth && isSignedIn ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((open) => !open)}
                className={cn(
                  "inline-flex h-9 items-center gap-1 rounded-full border border-line bg-card-muted/65 px-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
                  isUserMenuOpen && "border-accent-border bg-accent-soft/70",
                )}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                aria-label="Open account menu"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
                  {getCircleLabel(currentUser)}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted transition",
                    isUserMenuOpen && "rotate-180 text-foreground",
                  )}
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute right-0 top-[calc(100%+0.45rem)] z-50 w-40 rounded-xl border border-line bg-card p-1.5 shadow-board"
                    role="menu"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-card-muted"
                      role="menuitem"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-card-muted disabled:opacity-70"
                      role="menuitem"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4" />
                      )}
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          <Button
            type="button"
            size="icon"
            variant="outline"
            className={cn(
              "h-9 w-9 lg:hidden",
              isOpen && "border-accent-border bg-accent-soft text-accent",
            )}
            aria-expanded={isOpen}
            aria-controls="mobile-navbar-menu"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((currentOpen) => !currentOpen)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
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
              className="absolute inset-x-0 top-[calc(100%+0.45rem)] z-50 lg:hidden"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="rounded-xl border border-line bg-card p-1.5 shadow-board">
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const active = isItemActive(pathname, item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
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
    </header>
  );
}

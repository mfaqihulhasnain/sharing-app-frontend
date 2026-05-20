"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  DoorOpen,
  Eye,
  FileText,
  Info,
  LogOut,
  ShieldCheck,
  Trash2,
  UserCheck,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const viewportOnce = { once: true, amount: 0.1 };

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const GLANCE_ITEMS = [
  {
    icon: UserCheck,
    text: "You own everything you post. We make no claim over your content.",
  },
  {
    icon: WifiOff,
    text: "Your data lives on your local WiFi. We cannot access it.",
  },
  {
    icon: Eye,
    text: "You decide who sees each post — no one else makes that choice for you.",
  },
  {
    icon: Trash2,
    text: "You can leave and delete your account any time, no questions asked.",
  },
];

const TOC_ITEMS = [
  { num: "01", label: "Who can use Sharing Board" },
  { num: "02", label: "Your account" },
  { num: "03", label: "What you can do on the board" },
  { num: "04", label: "What you cannot do" },
  { num: "05", label: "What you own — and what we don't" },
  { num: "06", label: "Visibility and sharing — your responsibility" },
  { num: "07", label: "Google sign-in" },
  { num: "08", label: "The service as it is — honest and upfront" },
  { num: "09", label: "Ending your account" },
  { num: "10", label: "When these terms change" },
  { num: "11", label: "Governing law" },
];

const CAN_DO_ITEMS = [
  "Post work updates and announcements",
  "Attach and share files with your team",
  "Choose exactly who sees each post",
  "Manage and delete your own posts and files",
];

const CANNOT_DO_ITEMS = [
  "Post content that is harmful, abusive, or harassing",
  "Share files that contain malware, viruses, or malicious code",
  "Share someone's personal data without their consent",
  "Attempt to access another user's account or interfere with the network",
  "Use the product for any unlawful purpose",
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/* Callout block — blue / green / amber */
function Callout({ variant = "blue", icon: Icon, children }) {
  const styles = {
    blue: {
      wrap: "bg-blue-50 border-blue-200",
      icon: "text-blue-700",
      text: "text-blue-800",
    },
    green: {
      wrap: "bg-emerald-50 border-emerald-200",
      icon: "text-emerald-700",
      text: "text-emerald-800",
    },
    amber: {
      wrap: "bg-amber-50 border-amber-200",
      icon: "text-amber-700",
      text: "text-amber-800",
    },
  };
  const s = styles[variant];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[10px] border p-3.5",
        s.wrap
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", s.icon)} />
      <p className={cn("text-[13px] font-light leading-relaxed", s.text)}>
        {children}
      </p>
    </div>
  );
}

/* Section divider */
function SectionDivider() {
  return <div className="h-px w-full bg-line/60" />;
}

/* Numbered section wrapper */
function Section({ num, title, children }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <SectionDivider />
      <div className="flex items-start gap-3 pt-2">
        <span className="mt-0.5 min-w-5.5 text-[11px] font-medium text-muted">
          {num}
        </span>
        <h2 className="text-[17px] font-medium leading-snug tracking-[-0.02em] text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-3 pl-8.5">{children}</div>
    </motion.div>
  );
}

function BodyText({ children }) {
  return (
    <p className="text-[13.5px] font-light leading-7 text-muted">{children}</p>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */

export function TermsOfServicePage() {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-3 sm:px-5 lg:px-6">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-28 h-72 w-72 rounded-full blur-3xl opacity-60"
          style={{ background: "var(--bg-orb-1)" }}
        />
        <div
          className="absolute -right-24 top-40 h-64 w-64 rounded-full blur-3xl opacity-50"
          style={{ background: "var(--bg-orb-2)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--bg-orb-3)" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-330 flex-col gap-4">
        <EnterpriseNavbar />

        <main className="space-y-4 pb-16 pt-4">

          {/* ── HERO ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="rounded-[28px] border-line/90 bg-card-strong p-7 sm:p-9">
              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <span className="text-[11px] font-medium text-blue-700">
                  Fair &amp; straightforward
                </span>
              </div>

              {/* Headline */}
              <h1
                className="mb-3 text-[2rem] font-light leading-[1.08] tracking-[-0.05em] text-foreground sm:text-[2.4rem]"
                style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
              >
                Terms of Service —{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--accent, #1a56f5)",
                  }}
                >
                  plain and simple.
                </em>
              </h1>

              <p className="mb-6 max-w-xl text-[14px] font-light leading-7 text-muted">
                These terms explain what you agree to when you use Sharing
                Board, what we promise in return, and how this relationship
                works. We wrote them to be read — not just agreed to.
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 border-t border-line/60 pt-5">
                {[
                  { icon: CalendarDays, text: "Last updated: January 2025" },
                  { icon: Wifi, text: "Local WiFi product" },
                  { icon: FileText, text: "11 sections · plain English" },
                ].map((m) => (
                  <div
                    key={m.text}
                    className="flex items-center gap-1.5 text-[12px] text-muted"
                  >
                    <m.icon className="h-3.5 w-3.5 shrink-0" />
                    {m.text}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── KEY TERMS AT A GLANCE ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
          >
            <Card className="rounded-[20px] border-line/80 bg-card-muted/50 p-5">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[1.3px] text-muted">
                Key terms at a glance
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {GLANCE_ITEMS.map((item) => (
                  <motion.div
                    key={item.text}
                    variants={fadeUp}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 rounded-xl border border-line/70 bg-card-strong p-3.5"
                  >
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <p className="text-[12.5px] font-light leading-[1.55] text-foreground">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── TABLE OF CONTENTS ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.35 }}
          >
            <Card className="rounded-[16px] border-line/80 bg-card-strong p-5">
              <p className="mb-3.5 text-[11px] font-medium uppercase tracking-[1.3px] text-muted">
                Jump to a section
              </p>
              <div className="flex flex-col gap-0.5">
                {TOC_ITEMS.map((item) => (
                  <div
                    key={item.num}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 transition-colors duration-100 hover:bg-card-muted/50"
                  >
                    <span className="min-w-5.5 text-[11px] font-medium text-muted">
                      {item.num}
                    </span>
                    <ArrowRight
                      className="h-3 w-3 shrink-0"
                      style={{ color: "var(--accent, #1a56f5)" }}
                    />
                    <span
                      className="text-[13px] font-light"
                      style={{ color: "var(--accent, #1a56f5)" }}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── ALL SECTIONS ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.35 }}
          >
            <Card className="rounded-[24px] border-line/85 bg-card-strong p-6 sm:p-8">
              <div className="space-y-6">

                {/* 01 */}
                <Section num="01" title="Who can use Sharing Board">
                  <BodyText>
                    Sharing Board is designed for{" "}
                    <strong className="font-medium text-foreground">
                      workplace use by adults aged 16 and over
                    </strong>
                    . By creating an account, you confirm that you meet this
                    requirement and that you are using the product in a
                    professional or team context.
                  </BodyText>
                  <BodyText>
                    You need to create an account to use the board. You can
                    register with your email and a password, or sign in with
                    your Google account. Either way, the same terms apply.
                  </BodyText>
                  <Callout variant="blue" icon={Info}>
                    Sharing Board is a workplace tool. It is not designed for
                    personal or consumer use outside of a team context.
                  </Callout>
                </Section>

                {/* 02 */}
                <Section num="02" title="Your account">
                  <BodyText>
                    You are responsible for keeping your sign-in credentials
                    private. Do not share your password with anyone, and do not
                    let others use your account. If you think your account has
                    been accessed by someone else, change your password
                    immediately.
                  </BodyText>
                  <BodyText>
                    Everything posted or shared under your account is your
                    responsibility — so keep your credentials secure.
                  </BodyText>
                  <Callout variant="amber" icon={AlertTriangle}>
                    Your account is yours alone. Sharing login details puts your
                    posts, files, and team content at risk.
                  </Callout>
                </Section>

                {/* 03 */}
                <Section num="03" title="What you can do on the board">
                  <BodyText>
                    You can post updates, share files, and choose your audience.
                    That is what the board is for, and we encourage you to use
                    it fully.
                  </BodyText>
                  <div className="flex flex-col gap-1.5">
                    {CAN_DO_ITEMS.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-lg bg-card-muted/50 px-3 py-2.5"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span className="text-[13px] font-light text-muted">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* 04 */}
                <Section num="04" title="What you cannot do">
                  <BodyText>
                    These rules exist to keep the board safe and productive for
                    everyone on the network. They are common sense, not a list
                    of traps.
                  </BodyText>
                  <div className="flex flex-col gap-1.5">
                    {CANNOT_DO_ITEMS.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2.5 rounded-lg bg-card-muted/50 px-3 py-2.5"
                      >
                        <X className="h-3.5 w-3.5 shrink-0 text-red-500" />
                        <span className="text-[13px] font-light text-muted">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* 05 */}
                <Section num="05" title="What you own — and what we don't">
                  <BodyText>
                    <strong className="font-medium text-foreground">
                      Everything you post belongs to you.
                    </strong>{" "}
                    Your updates, files, and any content you create on the board
                    remain yours. We make no claim over your content, and we
                    never will.
                  </BodyText>
                  <BodyText>
                    By posting content, you grant Sharing Board only the limited
                    technical permission needed to display it to the people you
                    choose. We do not use your content for any other purpose.
                  </BodyText>
                  <Callout variant="green" icon={CheckCircle2}>
                    You own your content. Always. We are just the board it sits
                    on.
                  </Callout>
                </Section>

                {/* 06 */}
                <Section
                  num="06"
                  title="Visibility and sharing — your responsibility"
                >
                  <BodyText>
                    Every post has a visibility setting you choose before
                    posting.{" "}
                    <strong className="font-medium text-foreground">
                      Everyone on the network
                    </strong>{" "}
                    means all people on your WiFi can see it.{" "}
                    <strong className="font-medium text-foreground">
                      Selected people only
                    </strong>{" "}
                    means only the specific teammates you pick can see it.
                  </BodyText>
                  <BodyText>
                    You are responsible for choosing the right setting for each
                    post. Think carefully before sharing sensitive information
                    with everyone on the network.
                  </BodyText>
                  <Callout variant="amber" icon={Eye}>
                    Once a post is visible to others on the network, they may
                    have seen it before you delete it. Choose your audience
                    carefully.
                  </Callout>
                </Section>

                {/* 07 */}
                <Section num="07" title="Google sign-in">
                  <BodyText>
                    If you sign in with Google, you are also agreeing to
                    Google's own Terms of Service and Privacy Policy. We only
                    receive your name and email address from Google — nothing
                    else.
                  </BodyText>
                  <BodyText>
                    Choosing Google sign-in is optional. You can always register
                    with your email and password instead. Both methods give you
                    the same full access to the board.
                  </BodyText>
                  <Callout variant="blue" icon={Info}>
                    Google sign-in is a convenience option. It does not give us
                    access to any of your other Google data.
                  </Callout>
                </Section>

                {/* 08 */}
                <Section
                  num="08"
                  title="The service as it is — honest and upfront"
                >
                  <BodyText>
                    We work hard to keep Sharing Board reliable. But like any
                    software, it may occasionally be unavailable due to
                    maintenance or unexpected issues. We do not guarantee 100%
                    uptime.
                  </BodyText>
                  <BodyText>
                    Because the board runs on your local network, the
                    reliability of your own WiFi infrastructure also plays a
                    role in your experience.
                  </BodyText>
                  <Callout variant="blue" icon={Info}>
                    We are honest about limitations. We will always communicate
                    planned downtime and work to resolve issues quickly.
                  </Callout>
                </Section>

                {/* 09 */}
                <Section num="09" title="Ending your account">
                  <BodyText>
                    You can delete your account at any time from your profile
                    settings. When you do, all your posts, files, and personal
                    information are permanently deleted — no waiting period, no
                    questions asked.
                  </BodyText>
                  <BodyText>
                    If you seriously or repeatedly break these terms, we reserve
                    the right to suspend or remove your account. We will always
                    act fairly and only do this when there is a genuine reason.
                  </BodyText>
                  <Callout variant="green" icon={LogOut}>
                    Leaving is always your choice. Delete your account any time
                    and everything goes with it — permanently and immediately.
                  </Callout>
                </Section>

                {/* 10 */}
                <Section num="10" title="When these terms change">
                  <BodyText>
                    If we update these terms, we will post the new version here
                    with a new date at the top. For significant changes that
                    affect your rights, we will notify you directly — on the
                    board or by email — before the changes take effect.
                  </BodyText>
                  <BodyText>
                    Continuing to use Sharing Board after a change means you
                    accept the updated terms. If you disagree, you can always
                    delete your account before it takes effect.
                  </BodyText>
                  <Callout variant="blue" icon={Bell}>
                    No silent updates. You will always know when these terms
                    change and have time to decide if you are still happy with
                    them.
                  </Callout>
                </Section>

                {/* 11 */}
                <Section num="11" title="Governing law">
                  <BodyText>
                    These terms are governed by the laws of the jurisdiction in
                    which Sharing Board is registered. We keep this section
                    short because we would always rather resolve any issue by
                    talking directly than through legal processes.
                  </BodyText>
                  <BodyText>
                    If a specific clause in these terms is found to be
                    unenforceable, the rest of the terms remain fully in effect.
                  </BodyText>
                </Section>

              </div>
            </Card>
          </motion.div>

          {/* ── CLOSING DARK CARD ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            <Card className="relative overflow-hidden rounded-[24px] border-line/90 bg-foreground p-8 text-center sm:p-12">
              {/* Decorative orbs */}
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-25"
                style={{ background: "var(--accent, #1a56f5)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full blur-3xl opacity-15"
                style={{ background: "var(--accent, #1a56f5)" }}
              />

              <div className="relative mx-auto max-w-xl space-y-3">
                <h2
                  className="text-[1.6rem] font-light leading-[1.15] tracking-[-0.04em] text-white sm:text-[1.9rem]"
                  style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
                >
                  Terms written to be{" "}
                  <em className="italic opacity-50">read,</em> not feared.
                </h2>
                <p className="text-[13.5px] font-light leading-7 text-white/50">
                  These terms are meant to be fair to everyone who uses Sharing
                  Board. We wrote them clearly because you deserve to understand
                  what you are agreeing to. If something ever feels unclear,
                  that is something we want to fix.
                </p>
              </div>
            </Card>
          </motion.div>

        </main>
      </div>
    </div>
  );
}

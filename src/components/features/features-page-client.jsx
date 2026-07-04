"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Handshake,
  LayoutGrid,
  Lock,
  ShieldCheck,
  Sparkles,
  Upload,
  UsersRound,
  Zap,
  Eye,
  Settings2,
} from "lucide-react";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const VALUE_PILLARS = [
  {
    icon: Zap,
    emoji: "⚡",
    color: "bg-blue-50 text-blue-600",
    title: 'Stop the daily "where is that file?" moment',
    description:
      "Everything lives in one place. Updates, files, and context are always together — no more hunting across three apps.",
  },
  {
    icon: Lock,
    emoji: "🔐",
    color: "bg-emerald-50 text-emerald-600",
    title: "Share confidently, not carelessly",
    description:
      "Choose who sees what in a single click. Sensitive updates reach only the right people, automatically.",
  },
  {
    icon: UsersRound,
    emoji: "🎯",
    color: "bg-amber-50 text-amber-600",
    title: "Everyone knows what to do next",
    description:
      "Live updates and clear context mean fewer follow-up messages and faster decisions — across every department.",
  },
];

const CORE_FEATURES = [
  {
    number: "01",
    icon: LayoutGrid,
    title: "One unified workspace for every update",
    benefit:
      "Notes, announcements, files, and decisions all live in a single shared board. Your team stops asking did you see my message? because everything is always visible.",
    outcome:
      "You save hours every week that were lost to duplicate messages and tool-switching.",
  },
  {
    number: "02",
    icon: Eye,
    title: "Visibility control built into every post",
    benefit:
      "Share broadly with the whole team, or selectively with just Finance or Leadership. You decide per post — no complex settings, no separate permissions panel.",
    outcome: "Confidential updates stay confidential, without any extra work.",
  },
  {
    number: "03",
    icon: Upload,
    title: "File sharing that stays in context",
    benefit:
      "Attach contracts, reports, or presentations directly alongside the relevant message. No more hunting for the file I sent last week in a separate drive folder." ,
    outcome:
      "Files and their context are always together — your handoffs are cleaner and faster.",
  },
  {
    number: "04",
    icon: Clock3,
    title: "Real-time activity — see it as it happens",
    benefit:
      "New posts appear the moment they're created, with clear timestamps and sender info. You always know what's current without refreshing or following up.",
    outcome:
      "Decisions move faster because the team is always working from the same live picture.",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Secure access you can trust",
    benefit:
      "Protected sign-in, session security, and access controls that actually work — built for everyday business use, not just enterprise IT teams.",
    outcome:
      "Your team collaborates confidently, knowing sensitive information is safe.",
  },
  {
    number: "06",
    icon: Handshake,
    title: "Works for every role, not just developers",
    benefit:
      "Ops, admin, finance, legal, design, and leadership — everyone on your team can use this from day one, with no training required.",
    outcome:
      "The whole organisation moves on the same rhythm, not just the technical teams.",
  },
];

const WORKFLOW_STEPS = [
  {
    number: "01",
    title: "Open your team's board",
    description:
      "Everyone arrives at one shared workspace — no setup, no onboarding maze. The board is your team's new home base.",
  },
  {
    number: "02",
    title: "Post an update with context",
    description:
      "Write your message, attach any files, and choose who should see it. The whole thing takes under 30 seconds.",
  },
  {
    number: "03",
    title: "The right people act immediately",
    description:
      "Updates appear live for everyone who should see them. No follow-ups. No confusion about what's current.",
  },
];

const WHO_IS_IT_FOR = [
  {
    icon: Building2,
    tag: "Operations & Admin",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    title: "Coordinate without chaos",
    description:
      "Approvals, vendor updates, and internal requests — all tracked in one board without long message threads or lost emails.",
  },
  {
    icon: UsersRound,
    tag: "Cross-functional teams",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Align across departments",
    description:
      "Keep product, finance, legal, and leadership working from the same source of truth — no matter how large or distributed your team is.",
  },
  {
    icon: Zap,
    tag: "Fast-moving environments",
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
    title: "Keep up with the pace",
    description:
      "When things move fast, clarity is everything. Nearboards gives high-speed teams the speed and structure they need to stay ahead.",
  },
];

const COMPARISON_ROWS = [
  {
    before: "Updates scattered across email, chat, and WhatsApp",
    after: "One board holds every update — always organised, always current",
  },
  {
    before: "Files and messages get separated — context is lost",
    after: "Files and context stay attached — everything in one place",
  },
  {
    before: "No one knows who should see what",
    after: "Visibility is chosen per post in a single click",
  },
  {
    before: "Teams spend time chasing status instead of delivering work",
    after: "Status is visible live — everyone moves faster",
  },
];

const TRUST_POINTS = [
  {
    icon: "🔐",
    title: "Protected sign-in and secure sessions",
    description:
      "Verified access for every team member, with session protection built in from the start.",
  },
  {
    icon: "👁",
    title: "Per-post audience control",
    description:
      "Every update can be scoped to exactly the right people — reducing accidental sharing before it happens.",
  },
  {
    icon: "📎",
    title: "Controlled file access",
    description:
      "Clear upload permissions and access controls keep sensitive documents with the right people.",
  },
  {
    icon: "⚙️",
    title: "Built for real business usage",
    description:
      "Designed for everyday teams — not just technical users — with practical limits that match how real businesses work.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Do we need a technical team to set this up?",
    answer:
      "Not at all. Nearboards is designed for everyday business users. If your team can send an email, they can use this — from day one, with no training or IT support required.",
  },
  {
    question: "Can we control who sees each update?",
    answer:
      "Yes. When you create a post, you choose one of two options: share it with everyone currently on the WiFi network, or share it only with specific people you select. That's the full extent of the visibility control — and it's all you need.",
  },
  {
    question: "How is this different from a group chat?",
    answer:
      "Group chats show everything to everyone. Nearboards lets you decide per post who sees it — the whole network or just selected people. Plus, files stay attached to the post they belong to, so nothing loses context.",
  },
  {
    question: "Can people outside our office see the board?",
    answer:
      "No. The board is only accessible to people connected to the same WiFi network. Anyone outside your local network — whether that's another building, a remote worker, or anyone on mobile data — cannot access it.",
  },
];

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

const viewportOnce = { once: true, amount: 0.15 };

/* ─────────────────────────────────────────────
   REUSABLE COMPONENTS
───────────────────────────────────────────── */

function SectionHeader({ label, title, description, centered = false }) {
  return (
    <div className={cn("space-y-3 mb-10", centered && "text-center")}>
      <p
        className={cn(
          "text-[11px] font-medium tracking-[1.4px] uppercase text-muted",
          centered && "mx-auto"
        )}
      >
        {label}
      </p>
      <h2
        className={cn(
          "font-serif text-[2rem] sm:text-[2.4rem] font-light leading-[1.1] tracking-[-0.06em] text-foreground max-w-2xl",
          centered && "mx-auto"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-sm sm:text-base font-light leading-7 text-muted max-w-xl",
            centered && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* Live activity indicator dot */
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
}

/* Product preview card — right side of hero */
function ProductPreview() {
  return (
    <Card className="overflow-hidden rounded-[28px] border-line/90 bg-card-strong p-1 shadow-[0_28px_64px_rgba(15,23,42,0.12)]">
      {/* Browser chrome */}
      <div className="rounded-[22px] overflow-hidden border border-line/80">
        {/* Topbar */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-card-muted/80 border-b border-line/80">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          <span className="ml-2 flex-1 text-center text-[10px] text-muted">
            sharingboard.app — Team board
          </span>
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-2 p-3 bg-card">
          {/* Post 1 */}
          <div className="rounded-xl border border-line/80 bg-card-strong p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[9px] font-semibold flex-shrink-0">
                SR
              </span>
              <span className="text-[11px] font-medium text-foreground">Sofia R.</span>
              <span className="ml-auto text-[10px] text-muted">2:45 PM</span>
            </div>
            <p className="text-[11px] leading-[1.5] text-foreground/80">
              Invoice pack for Q3 is ready. Tagged Finance and Ops for sign-off — please review by EOD.
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium rounded-md px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200">
                🔒 Finance &amp; Ops only
              </span>
            </div>
          </div>

          {/* Post 2 */}
          <div className="rounded-xl border border-line/80 bg-card-strong p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-semibold flex-shrink-0">
                MK
              </span>
              <span className="text-[11px] font-medium text-foreground">Marcus K.</span>
              <span className="ml-auto text-[10px] text-muted">1:12 PM</span>
            </div>
            <p className="text-[11px] leading-[1.5] text-foreground/80">
              Weekly design review notes attached. Visible to everyone on the network
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium rounded-md px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200">
                🌍 Shared with everyone
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium rounded-md px-2 py-1 bg-card-muted/60 text-foreground/60 border border-line/80">
                📎 design-notes.pdf
              </span>
            </div>
          </div>

          {/* Post 3 */}
          <div className="rounded-xl border border-line/80 bg-card-strong p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-[9px] font-semibold flex-shrink-0">
                JP
              </span>
              <span className="text-[11px] font-medium text-foreground">Jamie P.</span>
              <span className="ml-auto text-[10px] text-muted">10:30 AM</span>
            </div>
            <p className="text-[11px] leading-[1.5] text-foreground/80">
              Vendor contract updated. Legal approval pending.
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium rounded-md px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200">
                🔒 Legal &amp; Leadership
              </span>
            </div>
          </div>
        </div>

        {/* Live bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border-t border-emerald-100">
          <LiveDot />
          <span className="text-[11px] font-medium text-emerald-700">
            3 teammates active now · Updates appear instantly
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */

export function FeaturesPageClient() {
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

        <main className="space-y-8 sm:space-y-12 lg:space-y-16">

          {/* ── HERO ─────────────────────────────── */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid gap-6 pt-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.45, ease: "easeOut" }}>
              <Card className="rounded-[30px] border-line/90 bg-card-strong p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Live badge */}
                  <div className="flex items-center gap-2 w-fit rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5">
                    <LiveDot />
                    <span className="text-[11px] font-medium text-emerald-700">
                      Works over your local WiFi
                    </span>
                  </div>

                  {/* Headline */}
                  <div className="space-y-3">
                    <h1 className="font-serif text-[2.4rem] sm:text-[3.2rem] font-light leading-[1.06] tracking-[-0.065em] text-foreground">
                      The fastest way your team stays{" "}
                      <em className="italic text-accent not-italic" style={{ color: "var(--accent, #1a56f5)", fontStyle: "italic" }}>
                        truly
                      </em>{" "}
                      in sync.
                    </h1>
                    <p className="max-w-lg text-sm sm:text-base font-light leading-7 text-muted">
                      Nearboards gives every person on your WiFi a single shared board — where
                      updates appear instantly, files stay in context, and every post reaches
                      exactly who it should. No group chats. No scattered messages. Just one clear
                      place for everyone in the room.
                    </p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2.5">
                    <Button asChild className="h-11 px-5 text-sm shadow-none">
                      <Link href="/register">
                        Get started free
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-11 px-5 text-sm">
                      <Link href="#how-it-works">See how it works</Link>
                    </Button>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap gap-6 pt-5 border-t border-line/70">
                    {[
                      { n: "On your WiFi", l: "accessible to your whole local team" },
                      { n: "Two options", l: "everyone on network, or selected people only" },
                      { n: "Instant", l: "posts appear live the moment they're sent" },
                    ].map((s) => (
                      <div key={s.l}>
                        <p className="font-serif text-xl font-light tracking-tight text-foreground">
                          {s.n}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted">{s.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
              className="hidden lg:block"
            >
              <ProductPreview />
            </motion.div>
          </motion.section>

          {/* ── WHY IT MATTERS ───────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-0"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="Why it matters"
                title="Your team is in the same room. But scattered messages mean no one has the full picture."
                description="When updates go into group chats, private messages, and verbal handoffs, things fall through the cracks. Nearboards gives everyone on the same WiFi one place to post, read, and act — instantly."
              />
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-3">
              {VALUE_PILLARS.map((p) => (
                <motion.div
                  key={p.title}
                  variants={fadeUp}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="h-full rounded-2xl border-line/85 bg-card-strong p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent-border hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
                    <div className="space-y-3">
                      <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg", p.color)}>
                        {p.emoji}
                      </span>
                      <h3 className="text-sm font-medium leading-snug text-foreground">
                        {p.title}
                      </h3>
                      <p className="text-sm font-light leading-6 text-muted">
                        {p.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── CORE FEATURES ────────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-0"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="Core features"
                title={
                  <>
                    Six things that change how your team operates —{" "}
                    <em style={{ color: "var(--accent, #1a56f5)", fontStyle: "italic" }}>
                      explained simply.
                    </em>
                  </>
                }
                description="No jargon. No fluff. Just what each feature does, why it matters, and what it means for your day."
              />
            </motion.div>

            {/* Bordered grid — like a table */}
            <div className="overflow-hidden rounded-2xl border border-line/85">
              <div className="grid sm:grid-cols-2">
                {CORE_FEATURES.map((f, i) => (
                  <motion.div
                    key={f.number}
                    variants={fadeUp}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "group p-6 transition-colors duration-150 hover:bg-card-muted/40",
                      "border-b border-line/70",
                      i % 2 === 0 ? "sm:border-r sm:border-line/70" : "",
                      i >= CORE_FEATURES.length - 2 ? "border-b-0" : "",
                      // last item on odd grid — remove bottom border
                      CORE_FEATURES.length % 2 !== 0 && i === CORE_FEATURES.length - 1
                        ? "sm:col-span-2"
                        : ""
                    )}
                  >
                    <div className="space-y-3">
                      <p className="text-[10px] font-medium tracking-widest text-muted uppercase">
                        {f.number}
                      </p>
                      <h3 className="text-base font-medium text-foreground leading-snug">
                        {f.title}
                      </h3>
                      <p className="text-sm font-light leading-6 text-muted">
                        {f.benefit}
                      </p>
                      <p className="flex items-start gap-1.5 text-xs font-medium text-accent-foreground" style={{ color: "var(--accent, #1a56f5)" }}>
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        {f.outcome}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── HOW IT WORKS ─────────────────────── */}
          <motion.section
            id="how-it-works"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-0"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="How it works"
                title={
                  <>
                    Three steps to a calmer,{" "}
                    <em style={{ color: "var(--accent, #1a56f5)", fontStyle: "italic" }}>
                      clearer
                    </em>{" "}
                    team.
                  </>
                }
                description="There's no learning curve. If you've ever sent a message or shared a file, you already know how to use Nearboards."
              />
            </motion.div>

            <div className="overflow-hidden rounded-2xl border border-line/85">
              <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line/70">
                {WORKFLOW_STEPS.map((step) => (
                  <motion.div
                    key={step.number}
                    variants={fadeUp}
                    transition={{ duration: 0.3 }}
                    className="p-6 bg-card-strong"
                  >
                    <p
                      className="font-serif text-5xl font-light leading-none tracking-[-0.05em] mb-4"
                      style={{ color: "rgba(var(--foreground-rgb, 13,14,18), 0.1)" }}
                    >
                      {step.number}
                    </p>
                    <h3 className="text-base font-medium text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm font-light leading-6 text-muted">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── WHO IT'S FOR ─────────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
            className="space-y-0"
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="Who it's for"
                title={
                  <>
                    Built for every team that depends on{" "}
                    <em style={{ color: "var(--accent, #1a56f5)", fontStyle: "italic" }}>
                      clear communication.
                    </em>
                  </>
                }
                description="If your team shares a physical space and a WiFi connection, this is for you. No technical knowledge needed."
              />
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-3">
              {WHO_IS_IT_FOR.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full rounded-2xl border-line/85 bg-card-strong p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
                    <div className="space-y-3">
                      <span
                        className={cn(
                          "inline-block text-[10px] font-medium px-2.5 py-1 rounded-full border",
                          item.tagColor
                        )}
                      >
                        {item.tag}
                      </span>
                      <h3 className="text-base font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm font-light leading-6 text-muted">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── COMPARISON ───────────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="Why Nearboards"
                title="The old way costs you more than you realise."
                description="Every message sent in the wrong place — a group chat, a private message, a verbal update — is a moment of clarity your team never gets back."
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.35 }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {/* Before column */}
              <div className="overflow-hidden rounded-2xl border border-line/85">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-card-muted/60 border-b border-line/70">
                  <span className="text-base">😩</span>
                  <span className="text-sm font-medium text-muted">Without Nearboards</span>
                </div>
                {COMPARISON_ROWS.map((r) => (
                  <div
                    key={r.before}
                    className="px-5 py-3.5 border-b border-line/60 last:border-b-0 text-sm font-light text-muted leading-6"
                  >
                    {r.before}
                  </div>
                ))}
              </div>

              {/* After column */}
              <div className="overflow-hidden rounded-2xl border border-line/85 bg-foreground">
                <div className="flex items-center gap-2 px-5 py-3.5 bg-white/[0.06] border-b border-white/10">
                  <span className="text-base">✦</span>
                  <span className="text-sm font-medium text-white/80">With Nearboards</span>
                </div>
                {COMPARISON_ROWS.map((r) => (
                  <div
                    key={r.after}
                    className="px-5 py-3.5 border-b border-white/[0.08] last:border-b-0 text-sm font-light text-white/80 leading-6"
                  >
                    {r.after}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          {/* ── TRUST ────────────────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="Trust & reliability"
                title={
                  <>
                    Collaborate with confidence, not{" "}
                    <em style={{ color: "var(--accent, #1a56f5)", fontStyle: "italic" }}>
                      caution.
                    </em>
                  </>
                }
                description="Everything stays on your local network. Only people on your WiFi can see the board — and every post gives you full control over exactly who that means."
              />
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              {TRUST_POINTS.map((t) => (
                <motion.div
                  key={t.title}
                  variants={fadeUp}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-3 items-start rounded-2xl border border-line/80 bg-card-strong p-5 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                    <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-accent-soft text-base">
                      {t.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">
                        {t.title}
                      </h4>
                      <p className="text-sm font-light leading-6 text-muted">
                        {t.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── FAQ ──────────────────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
          >
            <motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
              <SectionHeader
                label="FAQ"
                title={
                  <>
                    Quick answers for anyone evaluating{" "}
                    <em style={{ color: "var(--accent, #1a56f5)", fontStyle: "italic" }}>
                      Nearboards.
                    </em>
                  </>
                }
                description="Common questions from first-time visitors and decision-makers — answered clearly."
              />
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              {FAQ_ITEMS.map((item) => (
                <motion.div
                  key={item.question}
                  variants={fadeUp}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full rounded-2xl border-line/85 bg-card-strong p-5">
                    <h3 className="text-sm font-medium text-foreground mb-2 leading-snug">
                      {item.question}
                    </h3>
                    <p className="text-sm font-light leading-6 text-muted">
                      {item.answer}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ── CTA ──────────────────────────────── */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            <Card className="relative overflow-hidden rounded-[30px] border-line/90 bg-foreground p-8 sm:p-12 text-center">
              {/* Decorative orbs */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-30"
                style={{ background: "var(--accent, #1a56f5)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full blur-3xl opacity-20"
                style={{ background: "var(--accent, #1a56f5)" }}
              />

              <div className="relative mx-auto max-w-2xl space-y-5">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
                  <Sparkles className="h-3 w-3 text-white/50" />
                  <span className="text-[11px] font-medium text-white/60">
                    Works on your local WiFi · No technical setup
                  </span>
                </div>

                {/* Headline */}
                <h2 className="font-serif text-[2rem] sm:text-[2.6rem] font-light leading-[1.08] tracking-[-0.06em] text-white">
                  Give your team the clarity they&apos;ve been{" "}
                  <em className="italic opacity-60">missing.</em>
                </h2>

                <p className="text-sm sm:text-base font-light leading-7 text-white/50">
                  Connect to your WiFi, open the board, and your whole team is aligned from the
                  first post. Setup takes under three minutes.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button
                    asChild
                    className="h-11 px-6 text-sm font-medium bg-white text-foreground hover:bg-white/90 shadow-none border-0"
                  >
                    <Link href="/register">
                      Create your board — it&apos;s free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-11 px-6 text-sm text-white/70 border border-white/20 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Link href="/login">Sign in instead</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.section>

        </main>
      </div>
    </div>
  );
}


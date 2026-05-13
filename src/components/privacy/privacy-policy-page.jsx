"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Ban,
  Bell,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
  FileClock,
  FileText,
  Info,
  Lock,
  ShieldCheck,
  Trash2,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { EnterpriseNavbar } from "@/components/navigation/enterprise-navbar";
import { Badge } from "@/components/ui/badge";
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

const GLANCE_FACTS = [
  {
    icon: WifiOff,
    text: "Your data never leaves your local WiFi network. We have no access to it.",
  },
  {
    icon: Ban,
    text: "We never sell, share, or advertise using your data. Ever.",
  },
  {
    icon: ShieldCheck,
    text: "You control exactly who sees every post — everyone or selected people only.",
  },
  {
    icon: Trash2,
    text: "You can delete your account and all your data at any time.",
  },
];

const TOC_ITEMS = [
  { num: "01", label: "What information we collect" },
  { num: "02", label: "How your information is used" },
  { num: "03", label: "Local network and data storage" },
  { num: "04", label: "Visibility and sharing controls" },
  { num: "05", label: "File sharing" },
  { num: "06", label: "Account security" },
  { num: "07", label: "Google sign-in" },
  { num: "08", label: "How long we keep your data — and how to delete it" },
  { num: "09", label: "Children and age" },
  { num: "10", label: "When this policy changes" },
];

const NO_COLLECT_ITEMS = [
  "No location tracking",
  "No behavioural analytics",
  "No advertising data",
  "No third-party data sharing",
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
    </span>
  );
}

function SectionDivider() {
  return <div className="h-px w-full bg-line/60" />;
}

/* Callout block — green / blue / amber */
function Callout({ variant = "green", icon: Icon, children }) {
  const styles = {
    green: {
      wrap: "bg-emerald-50 border-emerald-200",
      icon: "text-emerald-700",
      text: "text-emerald-800",
    },
    blue: {
      wrap: "bg-blue-50 border-blue-200",
      icon: "text-blue-700",
      text: "text-blue-800",
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
      <Icon className={cn("mt-0.5 h-4 w-4 flex-shrink-0", s.icon)} />
      <p className={cn("text-[13px] font-light leading-relaxed", s.text)}>
        {children}
      </p>
    </div>
  );
}

/* Section wrapper */
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
        <span className="mt-0.5 min-w-[22px] text-[11px] font-medium text-muted">
          {num}
        </span>
        <h2 className="text-[18px] font-medium leading-snug tracking-[-0.02em] text-foreground">
          {title}
        </h2>
      </div>
      <div className="space-y-3 pl-[34px]">{children}</div>
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

export function PrivacyPolicyPage() {
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

        <main className="space-y-5 pb-16 pt-4">

          {/* ── HERO ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Card className="rounded-[28px] border-line/90 bg-card-strong p-7 sm:p-9">
              {/* Trust badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                <LiveDot />
                <span className="text-[11px] font-medium text-emerald-700">
                  Privacy promise
                </span>
              </div>

              {/* Headline */}
              <h1
                className="mb-3 text-[2rem] font-light leading-[1.1] tracking-[-0.05em] text-foreground sm:text-[2.5rem]"
                style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
              >
                Your privacy,{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--accent, #1a56f5)",
                  }}
                >
                  clearly explained.
                </em>
              </h1>

              <p className="mb-6 max-w-xl text-[14px] font-light leading-7 text-muted">
                This page tells you exactly what Sharing Board does with your
                information — in plain English, with no surprises. We believe
                privacy should feel like a feature, not fine print.
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 border-t border-line/60 pt-5">
                {[
                  { icon: CalendarDays, text: "Last updated: January 2025" },
                  {
                    icon: Wifi,
                    text: "Local WiFi product — nothing leaves your network",
                  },
                  { icon: FileText, text: "10 sections · plain English" },
                ].map((m) => (
                  <div
                    key={m.text}
                    className="flex items-center gap-1.5 text-[12px] text-muted"
                  >
                    <m.icon className="h-3.5 w-3.5 flex-shrink-0" />
                    {m.text}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* ── KEY FACTS AT A GLANCE ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={stagger}
          >
            <Card className="rounded-[20px] border-line/80 bg-card-muted/50 p-5">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[1.3px] text-muted">
                Key privacy facts at a glance
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {GLANCE_FACTS.map((f) => (
                  <motion.div
                    key={f.text}
                    variants={fadeUp}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 rounded-xl border border-line/70 bg-card-strong p-3.5"
                  >
                    <f.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <p className="text-[12.5px] font-light leading-[1.55] text-foreground">
                      {f.text}
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
                    className="flex items-center gap-2.5 rounded-lg px-2 py-2 transition-colors duration-100 hover:bg-card-muted/50 cursor-pointer"
                  >
                    <span className="min-w-[22px] text-[11px] font-medium text-muted">
                      {item.num}
                    </span>
                    <ArrowRight
                      className="h-3 w-3 flex-shrink-0"
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

          {/* ── SECTION 01 ── */}
          <Section num="01" title="What information we collect">
            <BodyText>
              When you create an account, we collect your{" "}
              <strong className="font-medium text-foreground">
                name and email address
              </strong>
              . When you use the board, we store the{" "}
              <strong className="font-medium text-foreground">
                posts you write and any files you attach
              </strong>
              . That is the complete list — nothing more is collected.
            </BodyText>
            <Callout variant="green" icon={CheckCircle2}>
              We do not collect your location, browsing habits, device
              fingerprint, IP address history, or any behavioural tracking data.
              None of it.
            </Callout>
            <div className="flex flex-col gap-1.5">
              {NO_COLLECT_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2.5 rounded-lg bg-card-muted/50 px-3 py-2.5"
                >
                  <X className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                  <span className="text-[13px] font-light text-muted">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── SECTION 02 ── */}
          <Section num="02" title="How your information is used">
            <BodyText>
              Your name and email are used to create and identify your account
              on the board. Your posts and files are used to display your
              updates to the people you choose to share them with.
            </BodyText>
            <BodyText>
              That is it. Your information is used for one purpose only: making
              the board work for you and your team. We do not use it for
              marketing, analytics, profiling, or anything else.
            </BodyText>
            <Callout variant="blue" icon={Info}>
              We will never use your data to show you ads, build a profile about
              you, or share insights about your team with anyone outside your
              network.
            </Callout>
          </Section>

          {/* ── SECTION 03 ── */}
          <Section num="03" title="Local network and data storage">
            <BodyText>
              Sharing Board runs entirely on your local WiFi network. When you
              post an update or attach a file, that data travels only between
              devices connected to the same network — it does not pass through
              the internet or any external server we operate.
            </BodyText>
            <BodyText>
              This means we genuinely cannot access your posts or files. They
              exist on your network, not ours. If someone is not connected to
              your WiFi, they cannot reach the board at all.
            </BodyText>
            <Callout variant="green" icon={Wifi}>
              Everything stays on your WiFi. Your posts, your files, your
              conversations — all of it lives within the four walls of your
              location.
            </Callout>
          </Section>

          {/* ── SECTION 04 ── */}
          <Section num="04" title="Visibility and sharing controls">
            <BodyText>
              Every post you create has a visibility setting that you choose
              before publishing. There are exactly two options — nothing more
              complex than this.
            </BodyText>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                {
                  label: "Everyone on the network",
                  val: "All people connected to the same WiFi can see this post.",
                },
                {
                  label: "Selected people only",
                  val: "Only the specific teammates you choose can see this post.",
                },
              ].map((opt) => (
                <div
                  key={opt.label}
                  className="rounded-xl border border-line/75 bg-card-muted/50 p-3.5"
                >
                  <p className="mb-1.5 text-[11px] font-medium text-muted">
                    {opt.label}
                  </p>
                  <p className="text-[13px] font-light leading-relaxed text-foreground">
                    {opt.val}
                  </p>
                </div>
              ))}
            </div>
            <BodyText>
              Nobody outside your WiFi network can see any post, regardless of
              which visibility option you choose. The network boundary is always
              the outer limit.
            </BodyText>
          </Section>

          {/* ── SECTION 05 ── */}
          <Section num="05" title="File sharing">
            <BodyText>
              When you attach a file to a post, it is stored locally and shared
              only with the people who can see that post — based on the
              visibility setting you chose. Files follow the same rules as
              posts.
            </BodyText>
            <BodyText>
              Files do not leave your network. They are not uploaded to cloud
              storage, scanned by external services, or accessible to anyone
              outside your WiFi. When a post is deleted, the attached files are
              deleted with it.
            </BodyText>
            <Callout variant="green" icon={FileCheck2}>
              Your files stay on your network. They are never sent to external
              servers or stored in the cloud.
            </Callout>
          </Section>

          {/* ── SECTION 06 ── */}
          <Section num="06" title="Account security">
            <BodyText>
              Your account is protected with verified sign-in and secured
              sessions. Passwords are stored using industry-standard hashing —
              we never store your password in plain text and we cannot read it.
            </BodyText>
            <BodyText>
              Each session is protected with a token that expires automatically.
              If you sign out, your session is immediately revoked. We recommend
              signing out on shared devices when you are done.
            </BodyText>
            <Callout variant="blue" icon={Lock}>
              Your sign-in credentials are encrypted and protected. We follow
              standard security practices to keep your account safe.
            </Callout>
          </Section>

          {/* ── SECTION 07 ── */}
          <Section num="07" title="Google sign-in">
            <BodyText>
              If you choose to sign in with Google, we receive only your{" "}
              <strong className="font-medium text-foreground">
                name and email address
              </strong>{" "}
              from Google. We do not receive access to your Google Drive, Gmail,
              contacts, calendar, or any other Google data.
            </BodyText>
            <BodyText>
              The name and email from Google are used in exactly the same way as
              if you had typed them manually — to create and identify your
              account. Nothing more.
            </BodyText>
            <Callout variant="amber" icon={Info}>
              Google sign-in shares only your name and email with us. We request
              no other Google permissions and access no other Google data.
            </Callout>
          </Section>

          {/* ── SECTION 08 ── */}
          <Section
            num="08"
            title="How long we keep your data — and how to delete it"
          >
            <BodyText>
              Your account and the posts you create are kept for as long as your
              account is active. If you stop using the product, your data
              remains stored until you choose to delete it.
            </BodyText>
            <BodyText>
              You can delete your account at any time from your profile
              settings. When you delete your account, all of your posts,
              attached files, and personal information are permanently removed.
              This cannot be undone.
            </BodyText>
            <Callout variant="green" icon={Trash2}>
              You are always in control. Delete your account any time and
              everything associated with it is gone permanently — no waiting
              period, no retained backups.
            </Callout>
          </Section>

          {/* ── SECTION 09 ── */}
          <Section num="09" title="Children and age">
            <BodyText>
              Sharing Board is designed for workplace use by adults. It is not
              intended for use by anyone under the age of 16. We do not
              knowingly collect information from children.
            </BodyText>
            <BodyText>
              If you believe a child has created an account, please contact your
              network administrator to have it removed.
            </BodyText>
          </Section>

          {/* ── SECTION 10 ── */}
          <Section num="10" title="When this policy changes">
            <BodyText>
              If we ever update this privacy policy, we will post the new
              version here with an updated date at the top of the page. For any
              significant changes that affect how your data is handled, we will
              notify you directly — either on the board or by email.
            </BodyText>
            <BodyText>
              We will never change this policy in a way that reduces your
              privacy rights without giving you clear notice first.
            </BodyText>
            <Callout variant="blue" icon={Bell}>
              You will always know when this policy changes and what has
              changed. No silent updates, ever.
            </Callout>
          </Section>

          {/* ── CLOSING ── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            transition={{ duration: 0.4 }}
          >
            <Card className="mt-4 rounded-[24px] border-line/90 bg-card-strong p-7 text-center sm:p-10">
              <h2
                className="mb-3 text-[1.6rem] font-light leading-[1.15] tracking-[-0.04em] text-foreground sm:text-[1.9rem]"
                style={{ fontFamily: "var(--font-serif, Georgia, serif)" }}
              >
                Privacy is a{" "}
                <em
                  style={{
                    fontStyle: "italic",
                    color: "var(--accent, #1a56f5)",
                  }}
                >
                  promise,
                </em>{" "}
                not a policy.
              </h2>
              <p className="mx-auto max-w-lg text-[13.5px] font-light leading-7 text-muted">
                This page reflects how Sharing Board actually works — not just
                what we are legally required to say. Your data stays on your
                network, under your control, always. That is the only way we
                have ever built this product and the only way we intend to keep
                building it.
              </p>
            </Card>
          </motion.div>

        </main>
      </div>
    </div>
  );
}

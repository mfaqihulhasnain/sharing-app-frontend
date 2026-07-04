import { FeaturesPageClient } from "@/components/features/features-page-client";

/* ─────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────── */

export const metadata = {
  title: "Features | Nearboards — Secure Team Collaboration & File Sharing",
  description:
    "Discover how Nearboards lets teams on the same WiFi share updates, files, and decisions in one live board — with per-post visibility control. Choose to share with everyone on the network or only selected people. No technical setup required.",
  keywords: [
    "team collaboration software",
    "secure file sharing for teams",
    "real-time team updates",
    "shared workspace tool",
    "business communication platform",
    "team handoff software",
    "file sharing with visibility control",
    "operations team collaboration",
    "cross-functional team tool",
    "internal communication platform",
  ],
  alternates: {
    canonical: "/features",
  },
  openGraph: {
    title: "Nearboards Features — One Place for Every Team Update",
    description:
      "Replace scattered emails and chat threads with a single calm workspace. Real-time updates, simple visibility control, and file sharing built for every team — not just developers.",
    type: "website",
    url: "/features",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nearboards Features",
    description:
      "How Nearboards helps teams share updates and files with speed, clarity, and trust — in one organised workspace.",
  },
};

/* ─────────────────────────────────────────────
   STRUCTURED DATA
───────────────────────────────────────────── */

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nearboards",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Nearboards helps teams share updates and files in one clear workspace with real-time activity and per-post visibility control. Designed for every role — ops, finance, design, legal, and leadership.",
  url: "/features",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do we need a technical team to set up Nearboards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. Nearboards is designed for everyday business users. If your team can send an email, they can use this — from day one, with no training or IT support required.",
      },
    },
    {
      "@type": "Question",
      name: "Can we control who sees each update on Nearboards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every post has a visibility setting — share with everyone, or only specific people. It's one click, per post. No complex permissions setup needed.",
      },
    },
    {
      "@type": "Question",
      name: "How is Nearboards different from Slack or email?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Group chats show everything to everyone. Nearboards lets you decide per post who sees it — the whole network or just selected people. Plus, files stay attached to the post they belong to, so nothing loses context.",
      },
    },
    {
      "@type": "Question",
      name: "Can different departments use Nearboards together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The board is only accessible to people connected to the same WiFi network. Anyone outside your local network — whether that's another building, a remote worker, or anyone on mobile data — cannot access it.",
      },
    },
  ],
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function FeaturesPage() {
  return (
    <>
      <FeaturesPageClient />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

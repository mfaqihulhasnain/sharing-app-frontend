import { FeaturesPageClient } from "@/components/features/features-page-client";

/* ─────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────── */

export const metadata = {
  title: "Features | Sharing Board — Secure Team Collaboration & File Sharing",
  description:
    "Discover how Sharing Board helps your team share updates, files, and decisions in one organised workspace — with real-time visibility and simple audience controls. No tech skills required.",
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
    title: "Sharing Board Features — One Place for Every Team Update",
    description:
      "Replace scattered emails and chat threads with a single calm workspace. Real-time updates, simple visibility control, and file sharing built for every team — not just developers.",
    type: "website",
    url: "/features",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sharing Board Features",
    description:
      "How Sharing Board helps teams share updates and files with speed, clarity, and trust — in one organised workspace.",
  },
};

/* ─────────────────────────────────────────────
   STRUCTURED DATA
───────────────────────────────────────────── */

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sharing Board",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Sharing Board helps teams share updates and files in one clear workspace with real-time activity and per-post visibility control. Designed for every role — ops, finance, design, legal, and leadership.",
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
      name: "Do we need a technical team to set up Sharing Board?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. Sharing Board is designed for everyday business users. If your team can send an email, they can use this — from day one, with no training or IT support required.",
      },
    },
    {
      "@type": "Question",
      name: "Can we control who sees each update on Sharing Board?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every post has a visibility setting — share with everyone, or only specific people. It's one click, per post. No complex permissions setup needed.",
      },
    },
    {
      "@type": "Question",
      name: "How is Sharing Board different from Slack or email?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Chat tools are great for conversation. Sharing Board is built for structured handoffs — where files, context, and updates stay together, and visibility is always intentional.",
      },
    },
    {
      "@type": "Question",
      name: "Can different departments use Sharing Board together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — this is where it shines. Ops, finance, legal, design, and leadership can all work from one shared board, each seeing what's relevant to them.",
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
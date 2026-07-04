import { TermsOfServicePage } from "@/components/terms/termscomponent";

/* ─────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────── */

export const metadata = {
  title: "Terms of Service | Nearboards",
  description:
    "Nearboards' Terms of Service — written in plain English. Understand what you agree to, what you own, and how this relationship works. Fair, clear, and straightforward.",
  keywords: [
    "Nearboards terms of service",
    "Nearboards terms and conditions",
    "local WiFi app terms",
    "team board terms of service",
    "Nearboards user agreement",
  ],
  alternates: {
    canonical: "/terms",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | Nearboards",
    description:
      "Plain-English Terms of Service for Nearboards — a local WiFi team board. Fair, clear, and written to be actually read.",
    type: "website",
    url: "/terms",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Nearboards",
    description:
      "Fair, plain-English Terms of Service for Nearboards. You own your content. Your data stays on your WiFi. Leave any time.",
  },
};

/* ─────────────────────────────────────────────
   STRUCTURED DATA
───────────────────────────────────────────── */

const termsSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service — Nearboards",
  description:
    "Nearboards' Terms of Service. Nearboards is a local WiFi team board. This page explains what users agree to, what they own, visibility and sharing rules, account management, and governing law — written in plain English.",
  url: "/terms",
  inLanguage: "en",
  dateModified: "2025-01-01",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Terms of Service",
        item: "/terms",
      },
    ],
  },
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function TermsPage() {
  return (
    <>
      <TermsOfServicePage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
      />
    </>
  );
}


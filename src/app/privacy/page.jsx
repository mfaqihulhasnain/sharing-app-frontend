import { PrivacyPolicyPage } from "@/components/privacy/privacy-policy-page";

/* ─────────────────────────────────────────────
   SEO METADATA
───────────────────────────────────────────── */

export const metadata = {
  title: "Privacy Policy | Sharing Board",
  description:
    "Sharing Board's privacy policy — written in plain English. Learn exactly what data we collect, how it is used, and why your information never leaves your local WiFi network.",
  keywords: [
    "Sharing Board privacy policy",
    "local WiFi app privacy",
    "team board data privacy",
    "local network app data policy",
    "Sharing Board data protection",
  ],
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Sharing Board",
    description:
      "Your data never leaves your local WiFi. Read our plain-English privacy policy to understand exactly how Sharing Board handles your information.",
    type: "website",
    url: "/privacy",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Sharing Board",
    description:
      "Plain-English privacy policy for Sharing Board — a local WiFi team board. Your data stays on your network, always.",
  },
};

/* ─────────────────────────────────────────────
   STRUCTURED DATA
───────────────────────────────────────────── */

const privacySchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy — Sharing Board",
  description:
    "Sharing Board's privacy policy. Sharing Board is a local WiFi team board — all data stays on the local network and never leaves. This policy explains what information is collected, how it is used, and how users can delete their data.",
  url: "/privacy",
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
        name: "Privacy Policy",
        item: "/privacy",
      },
    ],
  },
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function PrivacyPage() {
  return (
    <>
      <PrivacyPolicyPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
    </>
  );
}
import Link from "next/link";

export const metadata = {
  title: "Terms | Sharing Board",
  description: "Terms of use for Sharing Board.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-line/90 bg-card-strong p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Terms of Use</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Sharing Board is provided for secure, local collaboration. By using the
          service, you agree to use it responsibly, respect access boundaries, and
          avoid sharing unlawful or harmful content.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">
          This page is a baseline legal placeholder and should be replaced with your
          final legal terms before production release.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to register
        </Link>
      </div>
    </main>
  );
}

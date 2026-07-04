import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset Password | Nearboards",
  description: "Set a new password for your Nearboards account.",
};

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const tokenValue = params?.token;
  const token = Array.isArray(tokenValue)
    ? tokenValue[0] || ""
    : typeof tokenValue === "string"
      ? tokenValue
      : "";

  return (
    <AuthRouteGuard>
      <AuthShell
        title="Create a new password"
        description="Choose a strong password to secure your account."
        footer={
          <>
            Back to <Link href="/login">Login</Link>
          </>
        }
      >
        <ResetPasswordForm initialToken={token} />
      </AuthShell>
    </AuthRouteGuard>
  );
}


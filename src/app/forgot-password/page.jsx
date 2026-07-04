import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Forgot Password | Nearboards",
  description: "Request a password reset link for your Nearboards account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthRouteGuard>
      <AuthShell
        title="Reset your password"
        description="Enter your email and we will send you a secure reset link."
        footer={
          <>
            Remembered your password? <Link href="/login">Back to login</Link>
          </>
        }
      >
        <ForgotPasswordForm />
      </AuthShell>
    </AuthRouteGuard>
  );
}


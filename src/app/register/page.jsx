import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register | Sharing Board",
  description: "Create your Sharing Board account.",
};

export default function RegisterPage() {
  return (
    <AuthRouteGuard>
      <AuthShell
        showSidebar={false}
        title="Create your account"
        description="Create your account to start sharing with your team."
        footer={
          <>
            Already have an account? <Link href="/login">Sign in</Link>
          </>
        }
      >
        <RegisterForm />
      </AuthShell>
    </AuthRouteGuard>
  );
}


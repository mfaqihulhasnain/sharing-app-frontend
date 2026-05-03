import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthRouteGuard } from "@/components/auth/auth-route-guard";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | Sharing Board",
  description: "Sign in to your Sharing Board workspace.",
};

export default function LoginPage() {
  return (
    <AuthRouteGuard>
      <AuthShell
        showSidebar={false}
        showBrand={false}
        showBackHome={true}
        title="Welcome back"
        description="Sign in to continue with your workspace."
        footer={
          <>
            Don&apos;t have an account? <Link href="/register">Create one</Link>
          </>
        }
      >
        <LoginForm />
      </AuthShell>
    </AuthRouteGuard>
  );
}


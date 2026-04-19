import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Register | Sharing Board",
  description: "Create your Sharing Board account.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Set up your profile to start sharing securely on the local board."
      footer={
        <>
          Already have an account? <Link href="/login">Sign in</Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}


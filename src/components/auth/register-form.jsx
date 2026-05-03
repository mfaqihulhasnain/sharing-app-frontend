"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/auth/labeled-input";
import { PasswordInput } from "@/components/auth/password-input";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import {
  getPasswordChecks,
  getPasswordStrength,
  hasRequiredPasswordComplexity,
  isValidEmail,
} from "@/components/auth/form-utils";
import { cn } from "@/lib/utils";
import {
  getGoogleAuthStartUrl,
  getAuthErrorMessage,
  registerWithPassword,
} from "@/lib/auth-client";

function validateRegister(values) {
  const nextErrors = {};

  if (!values.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!isValidEmail(values.email.trim().toLowerCase())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    nextErrors.password = "Password is required.";
  } else if (values.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
  } else if (values.password.length > 72) {
    nextErrors.password = "Password must be 72 characters or fewer.";
  } else if (!hasRequiredPasswordComplexity(values.password)) {
    nextErrors.password =
      "Password must include uppercase, lowercase, one number, and one special character.";
  }

  if (!values.confirmPassword) {
    nextErrors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    nextErrors.confirmPassword = "Passwords do not match.";
  }

  if (!values.acceptTerms) {
    nextErrors.acceptTerms = "You must agree before creating an account.";
  }

  return nextErrors;
}

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const googleAuthStartUrl = getGoogleAuthStartUrl();

  const errors = useMemo(() => validateRegister(values), [values]);
  const passwordChecks = useMemo(
    () => getPasswordChecks(values.password),
    [values.password],
  );
  const passwordStrength = getPasswordStrength(passwordChecks);
  const passedChecksCount = passwordChecks.filter((item) => item.passed).length;
  const strengthProgress = (passedChecksCount / passwordChecks.length) * 100;

  const displayError = (fieldName) => {
    if (!submitted && !touched[fieldName]) {
      return "";
    }
    return errors[fieldName] || "";
  };

  const handleBlur = (fieldName) => {
    setTouched((current) => ({ ...current, [fieldName]: true }));
  };

  const handleChange = (fieldName, value) => {
    setValues((current) => ({ ...current, [fieldName]: value }));
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      const authData = await registerWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      const verificationEmailSent = authData?.verificationEmailSent !== false;

      if (verificationEmailSent) {
        toast.success("Account created. Check your email for the verification link.");
      } else {
        toast.success(
          "Account created, but verification email could not be sent. Use resend on login."
        );
      }

      router.push(`/login?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
      router.refresh();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setServerError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-4 [@media(max-height:860px)]:space-y-3 [@media(max-height:760px)]:space-y-2.5"
    >
      <LabeledInput
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        icon={Mail}
        value={values.email}
        onChange={(event) => handleChange("email", event.target.value)}
        onBlur={() => handleBlur("email")}
        disabled={isSubmitting}
        error={displayError("email")}
        className="h-10 text-[13px]"
      />

      <PasswordInput
        label="Password"
        name="password"
        autoComplete="new-password"
        placeholder="Create password"
        icon={LockKeyhole}
        value={values.password}
        onChange={(event) => handleChange("password", event.target.value)}
        onBlur={() => handleBlur("password")}
        disabled={isSubmitting}
        error={displayError("password")}
        className="h-10 text-[13px]"
      />

      {values.password ? (
        <div className="rounded-xl border border-line/80 bg-card-muted/45 px-3.5 py-3 [@media(max-height:760px)]:px-3 [@media(max-height:760px)]:py-2">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs">
            <p className="font-medium text-muted">Password strength</p>
            <p className={cn("font-semibold", passwordStrength.textClassName)}>
              {passwordStrength.label}
            </p>
          </div>
          <div className="h-1.5 rounded-full bg-line/90">
            <div
              className={cn("h-full rounded-full transition-all", passwordStrength.barClassName)}
              style={{ width: `${strengthProgress}%` }}
              role="presentation"
            />
          </div>
          <ul className="mt-3 grid gap-1 sm:grid-cols-2 [@media(max-height:760px)]:mt-2">
            {passwordChecks.map((item) => (
              <li key={item.key} className="inline-flex items-center gap-1.5 text-xs text-muted">
                {item.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted" />
                )}
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <PasswordInput
        label="Confirm password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Re-enter password"
        icon={LockKeyhole}
        value={values.confirmPassword}
        onChange={(event) => handleChange("confirmPassword", event.target.value)}
        onBlur={() => handleBlur("confirmPassword")}
        disabled={isSubmitting}
        error={displayError("confirmPassword")}
        className="h-10 text-[13px]"
      />

      <div className="space-y-1.5 [@media(max-height:760px)]:space-y-1">
        <label className="inline-flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-muted [@media(max-height:760px)]:text-xs [@media(max-height:760px)]:leading-5">
          <input
            type="checkbox"
            checked={values.acceptTerms}
            onChange={(event) => handleChange("acceptTerms", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-line accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            disabled={isSubmitting}
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-medium text-foreground underline-offset-4 transition hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-medium text-foreground underline-offset-4 transition hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {displayError("acceptTerms") ? (
          <p className="text-xs text-destructive">{displayError("acceptTerms")}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="h-10 w-full rounded-xl text-sm font-semibold shadow-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <div className="relative py-0.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line/80" />
        </div>
        <p className="relative mx-auto w-fit bg-card-strong px-2 text-[11px] font-medium tracking-wide text-muted uppercase">
          Or continue with
        </p>
      </div>

      <GoogleAuthButton href={googleAuthStartUrl} action="sign_up" />

      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs leading-5 text-destructive [@media(max-height:760px)]:leading-4">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}

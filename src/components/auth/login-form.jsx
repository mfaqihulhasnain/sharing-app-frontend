"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/auth/labeled-input";
import { PasswordInput } from "@/components/auth/password-input";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import {
  hasRequiredPasswordComplexity,
  isValidEmail,
} from "@/components/auth/form-utils";
import {
  getGoogleAuthStartUrl,
  getAuthErrorMessage,
  hasAuthErrorCode,
  loginWithPassword,
  persistAccessToken,
  resendVerificationEmail,
} from "@/lib/auth-client";

function validateLogin(values) {
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

  return nextErrors;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [formHint, setFormHint] = useState("");
  const [serverError, setServerError] = useState("");
  const [showResendVerificationAction, setShowResendVerificationAction] = useState(false);
  const googleAuthStartUrl = getGoogleAuthStartUrl();
  const hasInlineError = Boolean(serverError);
  const inlineMessage = serverError || formHint;

  const errors = useMemo(() => validateLogin(values), [values]);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (!emailFromQuery) {
      return;
    }

    setValues((current) => {
      if (current.email) {
        return current;
      }

      return {
        ...current,
        email: emailFromQuery,
      };
    });
  }, [searchParams]);

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
    if (formHint) {
      setFormHint("");
    }
    if (serverError) {
      setServerError("");
    }
    if (showResendVerificationAction) {
      setShowResendVerificationAction(false);
    }
  };

  const handleResendVerification = async () => {
    const normalizedEmail = values.email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      const message = "Enter a valid email before requesting a new verification link.";
      setServerError(message);
      toast.error(message);
      return;
    }

    setIsResendingVerification(true);
    setServerError("");

    try {
      await resendVerificationEmail({ email: normalizedEmail });
      const message = "Verification email sent. Please check your inbox.";
      setFormHint(message);
      toast.success(message);
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setServerError(message);
      toast.error(message);
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormHint("");
    setServerError("");

    try {
      const authData = await loginWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (authData?.accessToken) {
        persistAccessToken(authData.accessToken, {
          remember: values.rememberMe,
        });
      }

      toast.success("Signed in successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      const message = getAuthErrorMessage(error);
      const isUnverifiedError = hasAuthErrorCode(error, "EMAIL_NOT_VERIFIED");

      if (isUnverifiedError) {
        setShowResendVerificationAction(true);
        setFormHint("Your account is not verified yet. Request a new verification email.");
      }

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
        autoComplete="current-password"
        placeholder="Enter password"
        icon={LockKeyhole}
        value={values.password}
        onChange={(event) => handleChange("password", event.target.value)}
        onBlur={() => handleBlur("password")}
        disabled={isSubmitting}
        error={displayError("password")}
        className="h-10 text-[13px]"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 [@media(max-height:760px)]:pt-0">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted [@media(max-height:760px)]:text-xs">
          <input
            type="checkbox"
            checked={values.rememberMe}
            onChange={(event) => handleChange("rememberMe", event.target.checked)}
            className="h-4 w-4 rounded border-line accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            disabled={isSubmitting}
          />
          Remember me
        </label>

        <Link
          href="/forgot-password"
          className="text-sm font-medium text-foreground underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 [@media(max-height:760px)]:text-xs"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-10 w-full rounded-xl text-sm font-semibold shadow-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {inlineMessage ? (
        <p
          className={
            hasInlineError
              ? "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs leading-5 text-destructive [@media(max-height:760px)]:leading-4"
              : "rounded-lg border border-accent-border bg-accent-soft/65 px-3 py-1.5 text-xs leading-5 text-muted [@media(max-height:760px)]:leading-4"
          }
        >
          {inlineMessage}
        </p>
      ) : null}

      {showResendVerificationAction ? (
        <Button
          type="button"
          variant="outline"
          className="h-9 w-full rounded-xl text-sm"
          onClick={handleResendVerification}
          disabled={isResendingVerification || isSubmitting}
        >
          {isResendingVerification ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending verification email...
            </>
          ) : (
            "Resend verification email"
          )}
        </Button>
      ) : null}

      <div className="relative py-0.5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line/80" />
        </div>
        <p className="relative mx-auto w-fit bg-card-strong px-2 text-[11px] font-medium tracking-wide text-muted uppercase">
          Or continue with
        </p>
      </div>

      <GoogleAuthButton href={googleAuthStartUrl} action="sign_in" />
    </form>
  );
}

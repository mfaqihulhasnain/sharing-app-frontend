"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/password-input";
import {
  getPasswordChecks,
  getPasswordStrength,
  hasRequiredPasswordComplexity,
} from "@/components/auth/form-utils";
import { cn } from "@/lib/utils";
import { getAuthErrorMessage, resetPasswordWithToken } from "@/lib/auth-client";

function validateResetPassword(values) {
  const nextErrors = {};

  if (!values.token.trim()) {
    nextErrors.token = "Reset token is missing. Please use the email reset link again.";
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

  return nextErrors;
}

export function ResetPasswordForm({ initialToken = "" }) {
  const router = useRouter();
  const [values, setValues] = useState({
    token: initialToken,
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => validateResetPassword(values), [values]);
  const passwordChecks = useMemo(
    () => getPasswordChecks(values.password),
    [values.password]
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
      await resetPasswordWithToken({
        token: values.token.trim(),
        password: values.password,
      });

      toast.success("Password reset successful. Please sign in.");
      router.push("/login");
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <PasswordInput
        label="New password"
        name="password"
        autoComplete="new-password"
        placeholder="Create a new password"
        icon={LockKeyhole}
        value={values.password}
        onChange={(event) => handleChange("password", event.target.value)}
        onBlur={() => handleBlur("password")}
        disabled={isSubmitting}
        error={displayError("password")}
      />

      <div className="rounded-xl border border-line/80 bg-card-muted/45 px-3.5 py-3">
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
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
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

      <PasswordInput
        label="Confirm new password"
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="Re-enter new password"
        icon={LockKeyhole}
        value={values.confirmPassword}
        onChange={(event) => handleChange("confirmPassword", event.target.value)}
        onBlur={() => handleBlur("confirmPassword")}
        disabled={isSubmitting}
        error={displayError("confirmPassword")}
      />

      {displayError("token") ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
          {displayError("token")}
        </p>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Resetting password...
          </>
        ) : (
          "Reset password"
        )}
      </Button>

      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}

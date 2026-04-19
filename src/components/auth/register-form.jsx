"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/auth/labeled-input";
import { PasswordInput } from "@/components/auth/password-input";
import {
  getPasswordChecks,
  getPasswordStrength,
  isValidEmail,
} from "@/components/auth/form-utils";
import { cn } from "@/lib/utils";

function validateRegister(values) {
  const nextErrors = {};

  if (!values.fullName.trim()) {
    nextErrors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 2) {
    nextErrors.fullName = "Full name must be at least 2 characters.";
  }

  if (!values.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!isValidEmail(values.email.trim().toLowerCase())) {
    nextErrors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    nextErrors.password = "Password is required.";
  } else if (values.password.length < 8) {
    nextErrors.password = "Password must be at least 8 characters.";
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
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formHint, setFormHint] = useState("");

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
    if (formHint) {
      setFormHint("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setFormHint("");

    window.setTimeout(() => {
      setIsSubmitting(false);
      setFormHint(
        "Account form is ready. Backend registration request will be connected in the next step.",
      );
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <LabeledInput
        label="Full name"
        name="fullName"
        autoComplete="name"
        placeholder="John Smith"
        icon={UserRound}
        value={values.fullName}
        onChange={(event) => handleChange("fullName", event.target.value)}
        onBlur={() => handleBlur("fullName")}
        disabled={isSubmitting}
        error={displayError("fullName")}
      />

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
      />

      <div className="space-y-1.5">
        <label className="inline-flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-muted">
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
              href="#"
              className="font-medium text-foreground underline-offset-4 transition hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="#"
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
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-none"
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

      {formHint ? (
        <p className="rounded-lg border border-accent-border bg-accent-soft/65 px-3 py-2 text-xs leading-5 text-muted">
          {formHint}
        </p>
      ) : null}
    </form>
  );
}

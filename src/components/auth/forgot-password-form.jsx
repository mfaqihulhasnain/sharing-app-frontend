"use client";

import { useMemo, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { LabeledInput } from "@/components/auth/labeled-input";
import { Button } from "@/components/ui/button";
import { getAuthErrorMessage, requestPasswordReset } from "@/lib/auth-client";
import { isValidEmail } from "@/components/auth/form-utils";

function validateForgotPassword(values) {
  const nextErrors = {};

  if (!values.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!isValidEmail(values.email.trim().toLowerCase())) {
    nextErrors.email = "Enter a valid email address.";
  }

  return nextErrors;
}

export function ForgotPasswordForm({ initialEmail = "" }) {
  const [values, setValues] = useState({
    email: initialEmail,
  });
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const errors = useMemo(() => validateForgotPassword(values), [values]);

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
    if (successMessage) {
      setSuccessMessage("");
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
    setSuccessMessage("");

    try {
      await requestPasswordReset({
        email: values.email.trim().toLowerCase(),
      });

      const message = "If your account exists, a password reset link has been sent.";
      setSuccessMessage(message);
      toast.success(message);
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

      <Button
        type="submit"
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-none"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      {successMessage ? (
        <p className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-xs leading-5 text-emerald-600">
          {successMessage}
        </p>
      ) : null}

      {serverError ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs leading-5 text-destructive">
          {serverError}
        </p>
      ) : null}
    </form>
  );
}

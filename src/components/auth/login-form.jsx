"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LabeledInput } from "@/components/auth/labeled-input";
import { PasswordInput } from "@/components/auth/password-input";
import { isValidEmail } from "@/components/auth/form-utils";
import {
  getAuthErrorMessage,
  loginWithPassword,
  persistAccessToken,
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
  }

  return nextErrors;
}

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formHint, setFormHint] = useState("");
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => validateLogin(values), [values]);

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
        identifier: values.email.trim().toLowerCase(),
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
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={values.rememberMe}
            onChange={(event) => handleChange("rememberMe", event.target.checked)}
            className="h-4 w-4 rounded border-line accent-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
            disabled={isSubmitting}
          />
          Remember me
        </label>

        <button
          type="button"
          onClick={() =>
            setFormHint("Forgot password flow UI is ready and will be wired next.")
          }
          className="text-sm font-medium text-foreground underline-offset-4 transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="h-11 w-full rounded-xl text-sm font-semibold shadow-none"
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

      {formHint ? (
        <p className="rounded-lg border border-accent-border bg-accent-soft/65 px-3 py-2 text-xs leading-5 text-muted">
          {formHint}
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

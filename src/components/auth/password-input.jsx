"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function PasswordInput({
  label,
  value,
  onChange,
  error,
  icon: Icon,
  placeholder = "Enter password",
  autoComplete,
  id,
  name,
  disabled = false,
  onBlur,
  className,
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Input
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "pr-11",
            Icon ? "pl-10" : "",
            error &&
              "border-destructive/45 focus-visible:border-destructive/55 focus-visible:ring-destructive/15",
            className,
          )}
        />
        {Icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex w-10 items-center justify-center text-muted">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => setShowPassword((visible) => !visible)}
          className="absolute inset-y-0 right-1 my-1 inline-flex w-9 items-center justify-center rounded-lg text-muted transition hover:bg-card-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25 disabled:pointer-events-none disabled:opacity-50"
          aria-label={showPassword ? "Hide password" : "Show password"}
          disabled={disabled}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

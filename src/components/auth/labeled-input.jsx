"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LabeledInput({
  label,
  error,
  icon: Icon,
  className,
  id,
  name,
  ...props
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 inline-flex w-10 items-center justify-center text-muted">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <Input
          id={fieldId}
          name={name}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            Icon ? "pl-10" : "",
            error &&
              "border-destructive/45 focus-visible:border-destructive/55 focus-visible:ring-destructive/15",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}


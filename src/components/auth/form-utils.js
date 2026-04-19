export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function getPasswordChecks(password) {
  return [
    {
      key: "length",
      label: "At least 8 characters",
      passed: password.length >= 8,
    },
    {
      key: "uppercase",
      label: "One uppercase letter",
      passed: /[A-Z]/.test(password),
    },
    {
      key: "lowercase",
      label: "One lowercase letter",
      passed: /[a-z]/.test(password),
    },
    {
      key: "number",
      label: "One number",
      passed: /\d/.test(password),
    },
  ];
}

export function getPasswordStrength(checks) {
  const passedCount = checks.filter((item) => item.passed).length;

  if (passedCount <= 1) {
    return {
      label: "Weak",
      barClassName: "bg-rose-400",
      textClassName: "text-rose-600",
    };
  }

  if (passedCount <= 3) {
    return {
      label: "Medium",
      barClassName: "bg-amber-400",
      textClassName: "text-amber-600",
    };
  }

  return {
    label: "Strong",
    barClassName: "bg-emerald-500",
    textClassName: "text-emerald-600",
  };
}


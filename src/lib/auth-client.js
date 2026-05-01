const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const ACCESS_TOKEN_KEY = "sharing-board.access-token";

class AuthRequestError extends Error {
  constructor(message, statusCode, details, code) {
    super(message);
    this.name = "AuthRequestError";
    this.statusCode = statusCode;
    this.details = details;
    this.code = code;
  }
}

function getRequestUrl(path) {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function parseResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const response = await fetch(getRequestUrl(path), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
    cache: "no-store",
    ...options,
  });

  const payload = await parseResponse(response);

  if (!response.ok || payload?.success === false) {
    const message =
      payload?.message ||
      (response.status >= 500
        ? "Something went wrong on the server."
        : "Request failed. Please try again.");

    throw new AuthRequestError(message, response.status, payload?.details, payload?.code);
  }

  return payload?.data;
}

function getTokenStoragePreference() {
  if (typeof window === "undefined") {
    return "local";
  }

  if (window.sessionStorage.getItem(ACCESS_TOKEN_KEY)) {
    return "session";
  }

  return "local";
}

async function refreshAccessToken() {
  const previousPreference = getTokenStoragePreference();
  const data = await request("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({}),
  });

  const nextAccessToken = data?.accessToken || "";
  if (nextAccessToken) {
    persistAccessToken(nextAccessToken, {
      remember: previousPreference !== "session",
    });
  }

  return nextAccessToken;
}

async function requestWithAccessTokenRetry(path, { accessToken, method = "GET", body } = {}) {
  const buildOptions = (token) => ({
    method,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
    ...(body !== undefined ? { body } : {}),
  });

  try {
    return await request(path, buildOptions(accessToken));
  } catch (error) {
    if (!(error instanceof AuthRequestError) || error.statusCode !== 401) {
      throw error;
    }

    const refreshedAccessToken = await refreshAccessToken();
    if (!refreshedAccessToken) {
      throw error;
    }

    return request(path, buildOptions(refreshedAccessToken));
  }
}

export async function getCurrentUser({ accessToken }) {
  return requestWithAccessTokenRetry("/auth/me", {
    accessToken,
  });
}

export async function logoutSession({ accessToken } = {}) {
  return request("/auth/logout", {
    method: "POST",
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : {},
    body: JSON.stringify({}),
  });
}

export async function loginWithPassword({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function registerWithPassword({ email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function verifyEmailToken({ token }) {
  return request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });
}

export async function resendVerificationEmail({ email }) {
  return request("/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

export async function requestPasswordReset({ email }) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
}

export async function resetPasswordWithToken({ token, password }) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token,
      password,
    }),
  });
}

export function getGoogleAuthStartUrl() {
  return getRequestUrl("/auth/google/start");
}

export async function bootstrapSessionFromRefresh() {
  const refreshedAccessToken = await refreshAccessToken();
  if (!refreshedAccessToken) {
    throw new AuthRequestError("Unable to start authenticated session.", 401);
  }

  return refreshedAccessToken;
}

export async function getUsersMe({ accessToken }) {
  return requestWithAccessTokenRetry("/users/me", {
    accessToken,
  });
}

export async function getUsersDirectory({
  accessToken,
  q = "",
  page = 1,
  limit = 20,
  includeMe = false,
} = {}) {
  const query = new URLSearchParams({
    q: String(q || ""),
    page: String(page),
    limit: String(limit),
    includeMe: String(includeMe),
  });

  return requestWithAccessTokenRetry(`/users?${query.toString()}`, {
    accessToken,
  });
}

export function persistAccessToken(token, { remember = true } = {}) {
  if (typeof window === "undefined") return;
  if (!token) return;

  if (remember) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") return "";
  return (
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY) ||
    ""
  );
}

export function clearStoredAccessToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getAuthErrorMessage(error) {
  if (error instanceof AuthRequestError) {
    return error.message;
  }

  if (error instanceof TypeError) {
    return "Unable to reach the server. Check connection and try again.";
  }

  return "Unexpected error. Please try again.";
}

export function hasAuthErrorCode(error, code) {
  return error instanceof AuthRequestError && error.code === code;
}

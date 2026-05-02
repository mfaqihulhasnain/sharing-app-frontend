const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const ACCESS_TOKEN_KEY = "sharing-board.access-token";
const ACCESS_TOKEN_REFRESH_BUFFER_SECONDS = 45;
const AUTH_TOKEN_CHANGED_EVENT_NAME = "sharing-board:auth-token-changed";

let refreshInFlightPromise = null;

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
  const { headers: optionHeaders, method: optionMethod, ...restOptions } = options;
  const response = await fetch(getRequestUrl(path), {
    ...restOptions,
    method: optionMethod || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(optionHeaders || {}),
    },
    credentials: "include",
    cache: "no-store",
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
  if (refreshInFlightPromise) {
    return refreshInFlightPromise;
  }

  const previousPreference = getTokenStoragePreference();
  refreshInFlightPromise = (async () => {
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
  })().finally(() => {
    refreshInFlightPromise = null;
  });

  return refreshInFlightPromise;
}

function emitAuthTokenChanged(token) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(AUTH_TOKEN_CHANGED_EVENT_NAME, {
      detail: {
        hasToken: Boolean(token),
      },
    }),
  );
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  if (typeof atob !== "function") {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddingLength = (4 - (base64.length % 4)) % 4;
    const paddedBase64 = `${base64}${"=".repeat(paddingLength)}`;
    const payload = atob(paddedBase64);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function shouldRefreshAccessToken(token) {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const secondsUntilExpiry = payload.exp - nowInSeconds;
  return secondsUntilExpiry <= ACCESS_TOKEN_REFRESH_BUFFER_SECONDS;
}

async function requestWithAccessTokenRetry(path, { accessToken, method = "GET", body } = {}) {
  let requestAccessToken = accessToken;

  if (requestAccessToken && shouldRefreshAccessToken(requestAccessToken)) {
    try {
      const proactivelyRefreshedAccessToken = await refreshAccessToken();
      if (proactivelyRefreshedAccessToken) {
        requestAccessToken = proactivelyRefreshedAccessToken;
      }
    } catch {
      // Continue with current token; request retry path still handles 401.
    }
  }

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
    return await request(path, buildOptions(requestAccessToken));
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

export async function updateUsersMe({ accessToken, name }) {
  return requestWithAccessTokenRetry("/users/me", {
    accessToken,
    method: "PATCH",
    body: JSON.stringify({
      name,
    }),
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

export async function getPresenceBootstrap({ accessToken } = {}) {
  return requestWithAccessTokenRetry("/presence/bootstrap", {
    accessToken,
  });
}

export async function getShares({
  accessToken,
  limit = 50,
  before,
} = {}) {
  const query = new URLSearchParams({
    limit: String(limit),
  });
  if (typeof before === "string" && before.trim()) {
    query.set("before", before.trim());
  }

  return requestWithAccessTokenRetry(`/shares?${query.toString()}`, {
    accessToken,
  });
}

export async function createShare({
  accessToken,
  text,
  audienceActorIds = [],
}) {
  return requestWithAccessTokenRetry("/shares", {
    accessToken,
    method: "POST",
    body: JSON.stringify({
      text,
      audienceActorIds,
    }),
  });
}

export function persistAccessToken(token, { remember = true } = {}) {
  if (typeof window === "undefined") return;
  if (!token) return;

  if (remember) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    emitAuthTokenChanged(token);
    return;
  }

  window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  emitAuthTokenChanged(token);
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
  emitAuthTokenChanged("");
}

export function subscribeToAuthTokenChanges(listener) {
  if (typeof window === "undefined" || typeof listener !== "function") {
    return () => {};
  }

  const handler = (event) => {
    listener(event?.detail || { hasToken: Boolean(getStoredAccessToken()) });
  };

  window.addEventListener(AUTH_TOKEN_CHANGED_EVENT_NAME, handler);
  return () => {
    window.removeEventListener(AUTH_TOKEN_CHANGED_EVENT_NAME, handler);
  };
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

export function isUnauthorizedAuthError(error) {
  return error instanceof AuthRequestError && error.statusCode === 401;
}

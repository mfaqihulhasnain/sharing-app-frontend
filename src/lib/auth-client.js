const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const ACCESS_TOKEN_KEY = "sharing-board.access-token";

class AuthRequestError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = "AuthRequestError";
    this.statusCode = statusCode;
    this.details = details;
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

    throw new AuthRequestError(message, response.status, payload?.details);
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

export async function getCurrentUser({ accessToken }) {
  try {
    return await request("/auth/me", {
      method: "GET",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    });
  } catch (error) {
    if (!(error instanceof AuthRequestError) || error.statusCode !== 401) {
      throw error;
    }

    const refreshedAccessToken = await refreshAccessToken();
    if (!refreshedAccessToken) {
      throw error;
    }

    return request("/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshedAccessToken}`,
      },
    });
  }
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

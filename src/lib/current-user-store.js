import {
  clearStoredAccessToken,
  getCurrentUser,
  getStoredAccessToken,
  isUnauthorizedAuthError,
} from "@/lib/auth-client";

const initialState = {
  user: null,
  isLoading: false,
  hasResolved: false,
  error: null,
};

let state = { ...initialState };
let inFlightRequest = null;
const listeners = new Set();

function emitChange() {
  listeners.forEach((listener) => {
    listener(state);
  });
}

function setState(nextState) {
  state = {
    ...state,
    ...nextState,
  };
  emitChange();
}

export function readCurrentUserState() {
  return state;
}

export function subscribeCurrentUser(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setCurrentUserState(user) {
  setState({
    user: user || null,
    isLoading: false,
    hasResolved: true,
    error: null,
  });
}

export function clearCurrentUserState() {
  setCurrentUserState(null);
}

export async function loadCurrentUser({ force = false } = {}) {
  const accessToken = getStoredAccessToken();
  if (!accessToken) {
    clearCurrentUserState();
    return null;
  }

  if (!force && inFlightRequest) {
    return inFlightRequest;
  }

  if (!force && state.hasResolved && state.user) {
    return state.user;
  }

  setState({
    isLoading: true,
    error: null,
  });

  inFlightRequest = (async () => {
    try {
      const data = await getCurrentUser({ accessToken });
      const resolvedUser = data?.user || null;

      if (!resolvedUser) {
        clearStoredAccessToken();
        clearCurrentUserState();
        return null;
      }

      setCurrentUserState(resolvedUser);
      return resolvedUser;
    } catch (error) {
      if (isUnauthorizedAuthError(error)) {
        clearStoredAccessToken();
        clearCurrentUserState();
        return null;
      }

      setState({
        isLoading: false,
        hasResolved: true,
        error,
      });

      throw error;
    } finally {
      inFlightRequest = null;
    }
  })();

  return inFlightRequest;
}

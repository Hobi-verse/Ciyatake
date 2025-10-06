const AUTH_TOKEN_STORAGE_KEY = "ciyatake.auth.token";
const AUTH_USER_STORAGE_KEY = "ciyatake.auth.user";

const isBrowser = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeParse = (value) => {
  if (typeof value !== "string" || !value.length) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn("Failed to parse stored auth user", error);
    return null;
  }
};

export const storeAuthSession = ({ token, user } = {}) => {
  if (!isBrowser) {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  }

  if (user) {
    try {
      window.localStorage.setItem(
        AUTH_USER_STORAGE_KEY,
        typeof user === "string" ? user : JSON.stringify(user)
      );
    } catch (error) {
      console.warn("Unable to persist auth user", error);
    }
  }
};

export const clearAuthSession = () => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
};

export const getAuthToken = () => {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null;
};

export const getStoredAuthUser = () => {
  if (!isBrowser) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  return safeParse(raw);
};

export const getStoredAuthSession = () => ({
  token: getAuthToken(),
  user: getStoredAuthUser(),
});

export const AUTH_STORAGE_KEYS = {
  token: AUTH_TOKEN_STORAGE_KEY,
  user: AUTH_USER_STORAGE_KEY,
};

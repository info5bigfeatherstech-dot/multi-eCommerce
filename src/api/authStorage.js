/**
 * Admin Authentication Storage Helper
 * Provides safe getters, setters, and event hooks for admin access & refresh tokens.
 */

const ACCESS_TOKEN_KEY = "apexmart_admin_access_token";
const REFRESH_TOKEN_KEY = "apexmart_admin_refresh_token";
const AUTH_LEGACY_KEY = "apexmart_admin_auth";

/**
 * Retrieve the current admin access token.
 * Checks dedicated keys first, common token keys, legacy admin auth object, and cookies.
 * @returns {string|null}
 */
export function getAdminAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const candidateKeys = [
      ACCESS_TOKEN_KEY,
      "apexmart_admin_token",
      "admin_access_token",
      "admin_token",
      "access_token",
      "token",
      "adminToken",
      "accessToken",
      "jwt",
      "auth_token",
    ];

    for (const key of candidateKeys) {
      const val = localStorage.getItem(key);
      if (val && typeof val === "string" && val.length > 10 && !val.startsWith("{")) {
        return val;
      }
    }

    // Check JSON objects in storage
    const jsonKeys = [AUTH_LEGACY_KEY, "apexmart_user", "user", "admin", "auth"];
    for (const key of jsonKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const token =
            parsed?.token ||
            parsed?.accessToken ||
            parsed?.access_token ||
            parsed?.adminUser?.token ||
            parsed?.adminUser?.accessToken;
          if (token) return token;
        } catch {}
      }
    }

    // Fallback: check document.cookie
    if (typeof document !== "undefined" && document.cookie) {
      const match = document.cookie.match(/(?:^|;\s*)(?:token|accessToken|admin_token|access_token)=([^;]+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    }
  } catch (e) {
    console.error("Error reading admin access token:", e);
  }
  return null;
}

/**
 * Persist the admin access token.
 * @param {string} token
 */
export function setAdminAccessToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (e) {
    console.error("Error setting admin access token:", e);
  }
}

/**
 * Retrieve fallback admin refresh token.
 * @returns {string|null}
 */
export function getAdminRefreshToken() {
  if (typeof window === "undefined") return null;
  try {
    const directRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (directRefreshToken) return directRefreshToken;

    const legacy = localStorage.getItem(AUTH_LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.refreshToken) return parsed.refreshToken;
      if (parsed?.adminUser?.refreshToken) return parsed.adminUser.refreshToken;
    }
  } catch (e) {
    console.error("Error reading admin refresh token:", e);
  }
  return null;
}

/**
 * Persist the admin refresh token.
 * @param {string} token
 */
export function setAdminRefreshToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  } catch (e) {
    console.error("Error setting admin refresh token:", e);
  }
}

/**
 * Set both tokens at once.
 * @param {{ accessToken?: string, refreshToken?: string }} tokens
 */
export function setAdminTokens({ accessToken, refreshToken } = {}) {
  if (accessToken !== undefined) setAdminAccessToken(accessToken);
  if (refreshToken !== undefined) setAdminRefreshToken(refreshToken);
}

/**
 * Clear all admin authentication tokens.
 */
export function clearAdminTokens() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (e) {
    console.error("Error clearing admin tokens:", e);
  }
}

export const ECOMM_ACCESS_TOKEN_KEY = "apexmart_ecomm_access_token";
export const ECOMM_REFRESH_TOKEN_KEY = "apexmart_ecomm_refresh_token";

/**
 * Retrieve the current ecomm customer access token.
 * Checks dedicated key, standard accessToken/token keys, and stored customer user object.
 * @returns {string|null}
 */
export function getEcommAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const directKeys = [ECOMM_ACCESS_TOKEN_KEY, "accessToken", "token"];
    for (const key of directKeys) {
      const val = localStorage.getItem(key);
      if (val && typeof val === "string" && val.length > 10 && !val.startsWith("{")) {
        return val;
      }
    }

    const userRaw = localStorage.getItem("apexmart_user");
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      const token = parsed?.accessToken || parsed?.token || parsed?.data?.accessToken;
      if (token && typeof token === "string") return token;
    }
  } catch (e) {
    console.error("Error reading ecomm access token:", e);
  }
  return null;
}

/**
 * Persist the ecomm customer access token.
 * @param {string} token
 */
export function setEcommAccessToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(ECOMM_ACCESS_TOKEN_KEY, token);
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem(ECOMM_ACCESS_TOKEN_KEY);
      localStorage.removeItem("accessToken");
    }
  } catch (e) {
    console.error("Error setting ecomm access token:", e);
  }
}

/**
 * Retrieve the current ecomm customer refresh token.
 * @returns {string|null}
 */
export function getEcommRefreshToken() {
  if (typeof window === "undefined") return null;
  try {
    const directKeys = [ECOMM_REFRESH_TOKEN_KEY, "refreshToken"];
    for (const key of directKeys) {
      const val = localStorage.getItem(key);
      if (val && typeof val === "string" && val.length > 10 && !val.startsWith("{")) {
        return val;
      }
    }

    const userRaw = localStorage.getItem("apexmart_user");
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      const token = parsed?.refreshToken || parsed?.data?.refreshToken;
      if (token && typeof token === "string") return token;
    }
  } catch (e) {
    console.error("Error reading ecomm refresh token:", e);
  }
  return null;
}

/**
 * Persist the ecomm customer refresh token.
 * @param {string} token
 */
export function setEcommRefreshToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem(ECOMM_REFRESH_TOKEN_KEY, token);
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem(ECOMM_REFRESH_TOKEN_KEY);
      localStorage.removeItem("refreshToken");
    }
  } catch (e) {
    console.error("Error setting ecomm refresh token:", e);
  }
}

/**
 * Clear ecomm customer authentication token.
 */
export function clearEcommAccessToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ECOMM_ACCESS_TOKEN_KEY);
    localStorage.removeItem("accessToken");
  } catch (e) {
    console.error("Error clearing ecomm access token:", e);
  }
}

/**
 * Clear ecomm customer refresh token.
 */
export function clearEcommRefreshToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ECOMM_REFRESH_TOKEN_KEY);
    localStorage.removeItem("refreshToken");
  } catch (e) {
    console.error("Error clearing ecomm refresh token:", e);
  }
}

/**
 * Clear all customer authentication tokens.
 */
export function clearAllEcommTokens() {
  clearEcommAccessToken();
  clearEcommRefreshToken();
}

export default {
  getAdminAccessToken,
  setAdminAccessToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  setAdminTokens,
  clearAdminTokens,
  getEcommAccessToken,
  setEcommAccessToken,
  clearEcommAccessToken,
  getEcommRefreshToken,
  setEcommRefreshToken,
  clearEcommRefreshToken,
  clearAllEcommTokens,
};


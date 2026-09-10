/**
 * Admin Authentication Storage Helper
 * Provides safe getters, setters, and event hooks for admin access & refresh tokens.
 */

const ACCESS_TOKEN_KEY = "apexmart_admin_access_token";
const REFRESH_TOKEN_KEY = "apexmart_admin_refresh_token";
const AUTH_LEGACY_KEY = "apexmart_admin_auth";

/**
 * Retrieve the current admin access token.
 * Checks dedicated key first, then falls back to legacy admin auth object.
 * @returns {string|null}
 */
export function getAdminAccessToken() {
  if (typeof window === "undefined") return null;
  try {
    const directToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (directToken) return directToken;

    // Fallback: check legacy JSON storage if present
    const legacy = localStorage.getItem(AUTH_LEGACY_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (parsed?.token) return parsed.token;
      if (parsed?.accessToken) return parsed.accessToken;
      if (parsed?.adminUser?.token) return parsed.adminUser.token;
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

export default {
  getAdminAccessToken,
  setAdminAccessToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  setAdminTokens,
  clearAdminTokens,
};

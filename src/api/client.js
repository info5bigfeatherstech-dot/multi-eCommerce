import axios from "axios";
import {
  getAdminAccessToken,
  setAdminAccessToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  clearAdminTokens,
  getEcommAccessToken,
  setEcommAccessToken,
  clearEcommAccessToken,
  getEcommRefreshToken,
  setEcommRefreshToken,
  clearEcommRefreshToken,
} from "./authStorage.js";

// Resolve Base URL: default to /api if not specified in environment
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";

/**
 * Core Axios Client configured for Admin & Storefront API requests.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Enables HttpOnly refresh/auth cookies
  headers: {
    Accept: "application/json",
    "x-storefront": "ecomm",
  },
  timeout: 30000,
});

// Refresh token concurrency queue state
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Request Interceptor
 * Injects the Bearer access token (ecomm customer or admin) and default headers.
 */
apiClient.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    let token = null;
    if (url.startsWith("/admin/") || url.includes("admin-ecomm")) {
      token = getAdminAccessToken();
    } else {
      token = getEcommAccessToken() || getAdminAccessToken();
    }

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Default storefront identifier
    if (!config.headers["x-storefront"]) {
      config.headers["x-storefront"] = "ecomm";
    }

    // Ensure Accept header is present
    if (!config.headers.Accept) {
      config.headers.Accept = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Handles 401 Unauthorized errors with atomic token refresh and queue replay.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh attempt if no response, not 401, already retried, or request is the refresh endpoint itself
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    const url = originalRequest?.url || "";
    const isCustomerRequest = !url.startsWith("/admin/") && !url.includes("admin-ecomm");
    const portal = isCustomerRequest ? "ecomm" : "admin-ecomm";

    if (isRefreshing) {
      // Queue subsequent 401 requests while a refresh is in-flight
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const fallbackRefreshToken = isCustomerRequest
      ? getEcommRefreshToken()
      : getAdminRefreshToken();

    try {
      const refreshPayload = {
        portal,
        ...(fallbackRefreshToken ? { refreshToken: fallbackRefreshToken } : {}),
      };

      const refreshHeaders = {
        Accept: "application/json",
        "x-storefront": "ecomm",
        ...(fallbackRefreshToken ? { "x-refresh-token": fallbackRefreshToken } : {}),
      };

      // Call raw axios to prevent infinite recursive interceptor loop
      const response = await axios.post(`${BASE_URL}/auth/refresh`, refreshPayload, {
        headers: refreshHeaders,
        withCredentials: true,
      });

      const responseData = response.data || {};
      const newAccessToken =
        responseData.accessToken ||
        responseData.token ||
        responseData.data?.accessToken ||
        responseData.data?.token;

      const newRefreshToken =
        responseData.refreshToken ||
        responseData.data?.refreshToken;

      if (newAccessToken) {
        if (isCustomerRequest) {
          setEcommAccessToken(newAccessToken);
        } else {
          setAdminAccessToken(newAccessToken);
        }
      }

      if (newRefreshToken) {
        if (isCustomerRequest) {
          setEcommRefreshToken(newRefreshToken);
        } else {
          setAdminRefreshToken(newRefreshToken);
        }
      }

      processQueue(null, newAccessToken);

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      const errCode = refreshError.response?.data?.code;
      const isPermanentlyExpired =
        refreshError.response?.status === 401 &&
        (errCode === "SESSION_EXPIRED" || errCode === "REFRESH_TOKEN_MISSING");

      // Only force customer logout if the backend definitely rejected the session
      if (isCustomerRequest && isPermanentlyExpired) {
        clearEcommAccessToken();
        clearEcommRefreshToken();
        try {
          localStorage.removeItem("apexmart_user");
          localStorage.removeItem("user");
        } catch {}

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("ecomm:auth_expired"));
        }
      } else if (!isCustomerRequest && isPermanentlyExpired) {
        clearAdminTokens();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;


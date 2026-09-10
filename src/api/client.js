import axios from "axios";
import {
  getAdminAccessToken,
  setAdminAccessToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  clearAdminTokens,
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
 * Injects the Bearer admin access token and default headers.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAdminAccessToken();
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

    // Skip refresh attempt if no response, already retried, or request is the refresh endpoint itself
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue subsequent 401 requests while a refresh is in-flight
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const fallbackRefreshToken = getAdminRefreshToken();

    try {
      // Refresh request as specified:
      // Endpoint: POST /auth/refresh
      // Body: { "portal": "admin-ecomm", "refreshToken": "<optional_fallback_token>" }
      // Headers: { "x-refresh-token": "<fallback_token>" }
      // Credentials: withCredentials: true
      const refreshPayload = {
        portal: "admin-ecomm",
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
        setAdminAccessToken(newAccessToken);
      }
      if (newRefreshToken) {
        setAdminRefreshToken(newRefreshToken);
      }

      processQueue(null, newAccessToken);

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAdminTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;

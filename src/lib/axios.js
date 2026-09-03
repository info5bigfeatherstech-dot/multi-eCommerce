import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || "https://api.example.com/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor Stub (for future JWT auth token, headers, etc.)
api.interceptors.request.use(
  (config) => {
    // const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor Stub
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling stub (e.g. 401 redirect to sign in)
    return Promise.reject(error);
  }
);

export default api;

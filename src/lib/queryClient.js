import { QueryClient } from "@tanstack/react-query";

/**
 * Standard QueryClient configuration for caching, staleTime, and optimistic mutations.
 * Enforces staleTime: 30s - 60s as specified in requirements.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds caching
      gcTime: 10 * 60 * 1000, // 10 minutes cache retention
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;

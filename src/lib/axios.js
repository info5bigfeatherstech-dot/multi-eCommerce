import { apiClient } from "@/api/client";

// Export apiClient as `api` for backwards compatibility with existing slices
export const api = apiClient;
export default apiClient;

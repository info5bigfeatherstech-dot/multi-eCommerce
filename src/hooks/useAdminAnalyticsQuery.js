import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  getAdminUserDetail,
  exportAdminUsersExcel,
  sendBulkCartReminderEmail,
  sendBulkCartReminderPush,
  getPushSettings,
  updatePushSettings,
  getAdminCarts,
  getAdminCartDetail,
  getAbandonedCarts,
  getHighValueCarts,
  getAdminWishlists,
  getStaleWishlists,
  getPopularWishlistProducts,
} from "@/api/adminCustomerAnalytics";
import { toast } from "sonner";

export const ADMIN_USERS_KEY = ["admin", "users"];
export const ADMIN_CARTS_KEY = ["admin", "carts"];
export const ADMIN_WISHLISTS_KEY = ["admin", "wishlists"];
export const ADMIN_PUSH_SETTINGS_KEY = ["admin", "pushSettings"];

/**
 * 1. Admin Customers List Hook
 */
export function useAdminUsersQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, params],
    queryFn: () => getAdminUsers(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Admin Single Customer Detail Hook
 */
export function useAdminUserDetailQuery(userId) {
  return useQuery({
    queryKey: [...ADMIN_USERS_KEY, "detail", userId],
    queryFn: () => getAdminUserDetail(userId),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

/**
 * 3. Admin Carts Hook
 */
export function useAdminCartsQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_CARTS_KEY, params],
    queryFn: () => getAdminCarts(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 4. Admin Single Cart Detail Hook
 */
export function useAdminCartDetailQuery(cartId) {
  return useQuery({
    queryKey: [...ADMIN_CARTS_KEY, "detail", cartId],
    queryFn: () => getAdminCartDetail(cartId),
    enabled: Boolean(cartId),
    staleTime: 30 * 1000,
  });
}

/**
 * 5. Admin Abandoned Carts Hook
 */
export function useAdminAbandonedCartsQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_CARTS_KEY, "abandoned", params],
    queryFn: () => getAbandonedCarts(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 6. Admin High Value Carts Hook
 */
export function useAdminHighValueCartsQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_CARTS_KEY, "high-value", params],
    queryFn: () => getHighValueCarts(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 7. Admin Wishlists Hook
 */
export function useAdminWishlistsQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_WISHLISTS_KEY, params],
    queryFn: () => getAdminWishlists(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 8. Admin Stale Wishlists Hook
 */
export function useAdminStaleWishlistsQuery(params = {}) {
  return useQuery({
    queryKey: [...ADMIN_WISHLISTS_KEY, "stale", params],
    queryFn: () => getStaleWishlists(params),
    staleTime: 30 * 1000,
  });
}

/**
 * 9. Admin Popular Wishlist Products Hook
 */
export function useAdminPopularProductsQuery() {
  return useQuery({
    queryKey: [...ADMIN_WISHLISTS_KEY, "popular"],
    queryFn: () => getPopularWishlistProducts(),
    staleTime: 45 * 1000,
  });
}

/**
 * 10. Admin Push Settings Hook
 */
export function useAdminPushSettingsQuery() {
  return useQuery({
    queryKey: ADMIN_PUSH_SETTINGS_KEY,
    queryFn: () => getPushSettings(),
    staleTime: 60 * 1000,
  });
}

/**
 * 11. Update Push Settings Mutation Hook
 */
export function useUpdatePushSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSettings) => updatePushSettings(newSettings),
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_PUSH_SETTINGS_KEY, data);
      queryClient.invalidateQueries({ queryKey: ADMIN_PUSH_SETTINGS_KEY });
      toast.success("Automated Lead Recovery settings updated.");
    },
    onError: () => {
      toast.error("Failed to update push settings.");
    },
  });
}

/**
 * 12. Bulk Cart Reminder Email Mutation Hook
 */
export function useBulkCartReminderEmailMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, subject, message, isTest }) =>
      sendBulkCartReminderEmail({ userIds, subject, message, isTest }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CARTS_KEY });
      toast.success(data.message || "Cart reminder emails dispatched successfully!");
    },
    onError: () => {
      toast.error("Failed to dispatch reminder emails.");
    },
  });
}

/**
 * 13. Bulk Cart Reminder Push Notification Mutation Hook
 */
export function useBulkCartReminderPushMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userIds, title, body, directLink }) =>
      sendBulkCartReminderPush({ userIds, title, body, directLink }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CARTS_KEY });
      toast.success(data.message || "Web Push cart notifications triggered!");
    },
    onError: () => {
      toast.error("Failed to send Web Push notifications.");
    },
  });
}

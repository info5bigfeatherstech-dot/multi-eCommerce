import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserOrders,
  getOrderDetails,
  trackOrder,
  verifyRazorpayPayment,
  initiatePendingOrderPayment,
  payOrderBalance,
  abandonOnlineCheckout,
  createOrder,
} from "@/api/storefrontOrders";
import { toast } from "sonner";

export const USER_ORDERS_QUERY_KEY = ["user-orders"];
export const ORDER_DETAILS_QUERY_KEY = ["order-details"];
export const ORDER_TRACKING_QUERY_KEY = ["order-tracking"];

/**
 * 1. Hook to fetch current user's orders
 */
export function useUserOrdersQuery({ storefront = "ecomm", enabled = true } = {}) {
  return useQuery({
    queryKey: [...USER_ORDERS_QUERY_KEY, storefront],
    queryFn: async () => {
      return await getUserOrders({ storefront });
    },
    enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * 2. Hook to fetch a single order's details
 */
export function useOrderDetailsQuery(orderId, { storefront = "ecomm", enabled = true } = {}) {
  return useQuery({
    queryKey: [...ORDER_DETAILS_QUERY_KEY, orderId, storefront],
    queryFn: async () => {
      if (!orderId) return null;
      return await getOrderDetails(orderId, { storefront });
    },
    enabled: Boolean(orderId) && enabled,
    staleTime: 30 * 1000,
  });
}

/**
 * 3. Hook to fetch live shipment tracking
 */
export function useOrderTrackingQuery(orderId, { storefront = "ecomm", enabled = true } = {}) {
  return useQuery({
    queryKey: [...ORDER_TRACKING_QUERY_KEY, orderId, storefront],
    queryFn: async () => {
      if (!orderId) return null;
      return await trackOrder(orderId, { storefront });
    },
    enabled: Boolean(orderId) && enabled,
    staleTime: 60 * 1000,
  });
}

/**
 * 4. Hook to create an order
 */
export function useCreateStorefrontOrderMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, idempotencyKey }) => {
      return await createOrder(payload, { idempotencyKey, storefront });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create order.");
    },
  });
}

/**
 * 5. Hook to verify Razorpay payment
 */
export function useVerifyRazorpayPaymentMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      return await verifyRazorpayPayment(payload, { storefront });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_DETAILS_QUERY_KEY });
      toast.success(data?.message || "Payment verified successfully! ✓");
    },
    onError: (err) => {
      toast.error(err.message || "Payment verification failed.");
    },
  });
}

/**
 * 6. Hook to initiate/retry pending payment
 */
export function useInitiatePendingPaymentMutation({ storefront = "ecomm" } = {}) {
  return useMutation({
    mutationFn: async (orderId) => {
      return await initiatePendingOrderPayment(orderId, { storefront });
    },
    onError: (err) => {
      toast.error(err.message || "Could not initialize payment for this order.");
    },
  });
}

/**
 * 7. Hook to pay order remaining balance online
 */
export function usePayOrderBalanceMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      return await payOrderBalance(orderId, { storefront });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ORDER_DETAILS_QUERY_KEY });
    },
    onError: (err) => {
      if (err.code === "BALANCE_COD_AT_DELIVERY") {
        toast.info(err.message);
      } else {
        toast.error(err.message || "Could not initialize balance payment.");
      }
    },
  });
}

/**
 * 8. Hook to abandon checkout when user dismisses payment
 */
export function useAbandonCheckoutMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      return await abandonOnlineCheckout(orderId, { storefront });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_ORDERS_QUERY_KEY });
    },
  });
}

export default {
  useUserOrdersQuery,
  useOrderDetailsQuery,
  useOrderTrackingQuery,
  useCreateStorefrontOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useInitiatePendingPaymentMutation,
  usePayOrderBalanceMutation,
  useAbandonCheckoutMutation,
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCheckoutSettings,
  checkDelivery,
  getAvailableCoupons,
  validateCoupon,
  createCheckoutQuote,
  confirmCheckoutQuote,
  createOrder,
} from "@/api/checkout";
import { toast } from "sonner";

export const CHECKOUT_SETTINGS_QUERY_KEY = ["checkout-settings"];
export const AVAILABLE_COUPONS_QUERY_KEY = ["available-coupons"];

/**
 * 1. Hook to fetch store checkout settings (COD & partial payment policies)
 */
export function useCheckoutSettingsQuery({ storefront = "ecomm" } = {}) {
  return useQuery({
    queryKey: [...CHECKOUT_SETTINGS_QUERY_KEY, storefront],
    queryFn: async () => {
      try {
        return await getCheckoutSettings({ storefront });
      } catch (e) {
        // Fallback policy if offline or unauthenticated
        return {
          storefront,
          codEnabled: true,
          partialPaymentEnabled: true,
          partialPaymentPercent: 25,
        };
      }
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 2. Hook to check delivery availability by pincode
 */
export function useCheckDeliveryMutation({ storefront = "ecomm" } = {}) {
  return useMutation({
    mutationFn: async ({ pincode, cartId }) => {
      return await checkDelivery({ pincode, cartId }, { storefront });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to verify pincode delivery.");
    },
  });
}

/**
 * 3. Hook to fetch available coupons
 */
export function useAvailableCouponsQuery({ storefront = "ecomm" } = {}) {
  return useQuery({
    queryKey: [...AVAILABLE_COUPONS_QUERY_KEY, storefront],
    queryFn: async () => {
      try {
        return await getAvailableCoupons({ storefront });
      } catch (e) {
        return [];
      }
    },
    staleTime: 60 * 1000,
  });
}

/**
 * 4. Hook to validate a coupon
 */
export function useValidateCouponMutation({ storefront = "ecomm" } = {}) {
  return useMutation({
    mutationFn: async ({ couponCode, useServercart = true, subtotal }) => {
      return await validateCoupon({ couponCode, useServercart, subtotal }, { storefront });
    },
    onSuccess: (data) => {
      if (data?.valid) {
        toast.success(data.message || `Coupon "${data.couponCode || "applied"}" is valid!`);
      }
    },
    onError: (err) => {
      toast.error(err.message || "Invalid coupon code.");
    },
  });
}

/**
 * 5. Hook to create a checkout quote
 */
export function useCreateQuoteMutation({ storefront = "ecomm" } = {}) {
  return useMutation({
    mutationFn: async ({ addressId, couponCode }) => {
      return await createCheckoutQuote({ addressId, couponCode }, { storefront });
    },
    onError: (err) => {
      toast.error(err.message || "Could not generate checkout quote.");
    },
  });
}

/**
 * 6. Hook to confirm quote & lock payment method
 */
export function useConfirmQuoteMutation({ storefront = "ecomm" } = {}) {
  return useMutation({
    mutationFn: async ({ quoteId, paymentMethod, paymentPlan, balanceCollection }) => {
      return await confirmCheckoutQuote(
        { quoteId, paymentMethod, paymentPlan, balanceCollection },
        { storefront }
      );
    },
    onError: (err) => {
      toast.error(err.message || "Could not confirm checkout quote.");
    },
  });
}

/**
 * 7. Hook to create order from confirmed quote payload
 */
export function useCreateOrderMutation({ storefront = "ecomm" } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, endpoint = "/orders/items" }) => {
      return await createOrder(payload, endpoint, { storefront });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to place order.");
    },
  });
}

export default {
  useCheckoutSettingsQuery,
  useCheckDeliveryMutation,
  useAvailableCouponsQuery,
  useValidateCouponMutation,
  useCreateQuoteMutation,
  useConfirmQuoteMutation,
  useCreateOrderMutation,
};

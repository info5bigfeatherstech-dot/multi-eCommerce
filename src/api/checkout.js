import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Checkout & Delivery API Service (Storefront: ecomm / wholesale)
 */

/**
 * 1. Checkout settings (payment options UI)
 * GET /api/checkout/settings
 * Returns store policy: { codEnabled, partialPaymentEnabled, partialPaymentPercent }
 */
export async function getCheckoutSettings({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.CHECKOUT.SETTINGS, {
      headers: { "x-storefront": storefront },
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Delivery check
 * POST /api/delivery/check-delivery
 * @param {Object} payload { pincode: string, cartId?: string }
 */
export async function checkDelivery({ pincode, cartId }, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.DELIVERY.CHECK,
      {
        pincode: String(pincode).trim(),
        ...(cartId ? { cartId } : {}),
      },
      {
        headers: { "x-storefront": storefront },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. Delivery charges lookup (public)
 * GET /api/delivery/delivery-charges/:pincode?weight=1
 */
export async function getDeliveryCharges(pincode, { weight = 1 } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.DELIVERY.CHARGES(pincode), {
      params: { weight },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. Get available coupons for account/cart
 * GET /api/coupons/available
 */
export async function getAvailableCoupons({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.COUPONS.AVAILABLE, {
      headers: { "x-storefront": storefront },
    });
    return response.data?.coupons || response.data?.data || response.data || [];
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Validate coupon
 * POST /api/coupons/validate
 * @param {Object} payload { couponCode: string, useServercart?: boolean, subtotal?: number }
 */
export async function validateCoupon(
  { couponCode, useServercart = true, subtotal },
  { storefront = "ecomm" } = {}
) {
  try {
    const body = {
      couponCode: couponCode?.trim(),
      useServercart: Boolean(useServercart),
      ...(subtotal !== undefined ? { subtotal } : {}),
    };
    const response = await apiClient.post(ENDPOINTS.COUPONS.VALIDATE, body, {
      headers: { "x-storefront": storefront },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Create checkout quote
 * POST /api/checkout/quote
 * Required: { addressId: string, couponCode?: string }
 */
export async function createCheckoutQuote(
  { addressId, couponCode },
  { storefront = "ecomm" } = {}
) {
  try {
    const body = {
      addressId,
      ...(couponCode ? { couponCode: couponCode.trim() } : {}),
    };
    const response = await apiClient.post(ENDPOINTS.CHECKOUT.QUOTE, body, {
      headers: { "x-storefront": storefront },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Confirm quote (lock payment choice)
 * POST /api/checkout/confirm
 * @param {Object} payload { quoteId, paymentMethod, paymentPlan, balanceCollection }
 */
export async function confirmCheckoutQuote(
  { quoteId, paymentMethod = "online", paymentPlan = "full", balanceCollection = "online" },
  { storefront = "ecomm" } = {}
) {
  try {
    const body = {
      quoteId,
      paymentMethod,
      paymentPlan,
      balanceCollection,
    };
    const response = await apiClient.post(ENDPOINTS.CHECKOUT.CONFIRM, body, {
      headers: { "x-storefront": storefront },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8. Create order using next.createOrderEndpoint and next.payload
 * e.g. POST /api/orders/items
 */
export async function createOrder(
  payload,
  endpoint = "/orders/items",
  { storefront = "ecomm" } = {}
) {
  try {
    const cleanEndpoint = endpoint.startsWith("/api")
      ? endpoint.replace(/^\/api/, "")
      : endpoint;
    const response = await apiClient.post(cleanEndpoint, payload, {
      headers: { "x-storefront": storefront },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  getCheckoutSettings,
  checkDelivery,
  getDeliveryCharges,
  getAvailableCoupons,
  validateCoupon,
  createCheckoutQuote,
  confirmCheckoutQuote,
  createOrder,
};

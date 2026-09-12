import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Generate a unique UUID v4 for Idempotency-Key header.
 */
function generateIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * 5. Create Order
 * POST /api/orders/items
 * Uses confirm's next.payload (plus headers: Idempotency-Key, x-storefront, Authorization)
 *
 * @param {Object} payload
 * @param {string} payload.addressId
 * @param {string} payload.paymentMethod - "online" | "cod"
 * @param {string} [payload.onlinePaymentMode="full"] - "full" | "advance"
 * @param {number} [payload.paymentAdvancePercent] - e.g. 25
 * @param {string} [payload.balanceCollection] - "cod" | "online"
 * @param {string} payload.quoteId - Confirmed quote ID
 * @param {string} [payload.couponCode]
 * @param {Object} [options]
 * @param {string} [options.idempotencyKey]
 * @param {string} [options.storefront="ecomm"]
 */
export async function createOrder(
  payload,
  { idempotencyKey, storefront = "ecomm" } = {}
) {
  try {
    const key = idempotencyKey || generateIdempotencyKey();
    const headers = {
      "x-storefront": storefront,
      "Idempotency-Key": key,
    };

    const response = await apiClient.post(ENDPOINTS.ORDERS.ITEMS, payload, { headers });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Verify Razorpay Payment
 * POST /api/orders/items/verify-payment
 * Called after Razorpay checkout success callback
 *
 * @param {Object} payload
 * @param {string} payload.orderId
 * @param {string} payload.razorpay_order_id
 * @param {string} payload.razorpay_payment_id
 * @param {string} payload.razorpay_signature
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function verifyRazorpayPayment(
  payload,
  { storefront = "ecomm" } = {}
) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.ORDERS.VERIFY_PAYMENT,
      {
        orderId: payload.orderId,
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
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
 * 7a. Initiate / Retry Pending Order Payment
 * POST /api/orders/items/:orderId/initiate-payment
 * Used for payment recovery on pending online orders
 *
 * @param {string} orderId
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function initiatePendingOrderPayment(
  orderId,
  { storefront = "ecomm" } = {}
) {
  try {
    const endpoint = ENDPOINTS.ORDERS.INITIATE_PAYMENT(orderId);
    const response = await apiClient.post(
      endpoint,
      {},
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
 * 7b. Pay Order Remaining Balance Online
 * POST /api/orders/items/:orderId/pay-balance
 *
 * @param {string} orderId
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function payOrderBalance(
  orderId,
  { storefront = "ecomm" } = {}
) {
  try {
    const endpoint = ENDPOINTS.ORDERS.PAY_BALANCE(orderId);
    const response = await apiClient.post(
      endpoint,
      {},
      {
        headers: { "x-storefront": storefront },
      }
    );
    return response.data;
  } catch (error) {
    const errData = error.response?.data;
    if (errData?.code === "BALANCE_COD_AT_DELIVERY") {
      const customErr = new Error(
        errData.message ||
          "The remaining balance is collected on delivery. Online balance payment is not available."
      );
      customErr.code = "BALANCE_COD_AT_DELIVERY";
      throw customErr;
    }
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7c. Abandon Online Checkout
 * POST /api/orders/items/:orderId/abandon-online-checkout
 *
 * @param {string} orderId
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function abandonOnlineCheckout(
  orderId,
  { storefront = "ecomm" } = {}
) {
  try {
    const endpoint = ENDPOINTS.ORDERS.ABANDON_CHECKOUT(orderId);
    const response = await apiClient.post(
      endpoint,
      {},
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
 * 8a. Get User Orders
 * GET /api/orders/items
 *
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function getUserOrders({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.ORDERS.GET_USER_ORDERS, {
      headers: { "x-storefront": storefront },
    });
    return response.data?.orders || response.data || [];
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8b. Get Single Order Details
 * GET /api/orders/items/:orderId
 *
 * @param {string} orderId
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function getOrderDetails(orderId, { storefront = "ecomm" } = {}) {
  try {
    const endpoint = ENDPOINTS.ORDERS.GET_ORDER(orderId);
    const response = await apiClient.get(endpoint, {
      headers: { "x-storefront": storefront },
    });
    return response.data?.order || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8c. Track Order (Shiprocket Tracking)
 * GET /api/orders/items/:orderId/track
 *
 * @param {string} orderId
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function trackOrder(orderId, { storefront = "ecomm" } = {}) {
  try {
    const endpoint = ENDPOINTS.ORDERS.TRACK(orderId);
    const response = await apiClient.get(endpoint, {
      headers: { "x-storefront": storefront },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8d. Get Order Invoice Download URL
 *
 * @param {string} orderId
 * @returns {string}
 */
export function getOrderInvoiceUrl(orderId) {
  return `/api${ENDPOINTS.ORDERS.INVOICE(orderId)}`;
}

/**
 * 8e. Download Order Invoice PDF (handles authenticated blob download)
 *
 * @param {string} orderId
 * @param {Object} [options]
 * @param {string} [options.storefront="ecomm"]
 */
export async function downloadOrderInvoice(orderId, { storefront = "ecomm" } = {}) {
  try {
    const endpoint = ENDPOINTS.ORDERS.INVOICE(orderId);
    const response = await apiClient.get(endpoint, {
      headers: { "x-storefront": storefront },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    try {
      window.open(`/api${ENDPOINTS.ORDERS.INVOICE(orderId)}`, "_blank");
    } catch (_) {}
    throw new Error(normalizeApiError(error) || "Failed to download invoice.");
  }
}

export default {
  createOrder,
  verifyRazorpayPayment,
  initiatePendingOrderPayment,
  payOrderBalance,
  abandonOnlineCheckout,
  getUserOrders,
  getOrderDetails,
  trackOrder,
  getOrderInvoiceUrl,
  downloadOrderInvoice,
};


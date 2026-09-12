import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Normalizes backend cart response to ensure consistent shape across all endpoints
 * Backend returns { success: true, cart: { items, totalAmount, ... }, userType, storefront }
 */
function normalizeCartResponse(data) {
  if (!data) return { items: [], totalAmount: 0, totalCount: 0, totalDiscount: 0 };
  const cartObj = data.cart || data.data || data;
  const items = Array.isArray(cartObj.items) ? cartObj.items : [];
  const totalCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  return {
    _id: cartObj._id,
    userId: cartObj.userId,
    items,
    totalCount,
    totalAmount: typeof cartObj.totalAmount === "number" ? cartObj.totalAmount : 0,
    totalOriginalAmount: cartObj.totalOriginalAmount ?? cartObj.totalAmount ?? 0,
    totalDiscount: cartObj.totalDiscount ?? 0,
    totalDiscountPercentage: cartObj.totalDiscountPercentage ?? 0,
    createdAt: cartObj.createdAt,
    updatedAt: cartObj.updatedAt,
    storefront: data.storefront || cartObj.storefront || "ecomm",
    userType: data.userType || cartObj.userType || "user",
    raw: data,
  };
}

/**
 * 1. Fetch current cart
 * GET /api/cart
 * @param {{ storefront?: string }} [options]
 */
export async function getCart({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.CART.GET, {
      headers: { "x-storefront": storefront },
    });
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Add an item to cart
 * POST /api/cart
 * Prefer productSlug + variantId on add; keep both IDs for update/remove.
 * @param {Object} payload { productSlug, variantId, quantity }
 * @param {{ storefront?: string }} [options]
 */
export async function addToCart({ productSlug, variantId, quantity = 1, productId }, { storefront = "ecomm" } = {}) {
  try {
    const body = {
      ...(productSlug ? { productSlug } : {}),
      ...(productId ? { productId } : {}),
      variantId,
      quantity,
    };
    const response = await apiClient.post(ENDPOINTS.CART.ADD, body, {
      headers: { "x-storefront": storefront },
    });
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. Update quantity of item in cart
 * PUT /api/cart/item
 * Quantity > 0 sets absolute quantity. Quantity <= 0 removes line.
 * @param {Object} payload { productId, variantId, quantity }
 * @param {{ storefront?: string }} [options]
 */
export async function updateCartItem({ productId, variantId, quantity }, { storefront = "ecomm" } = {}) {
  if (!productId || !variantId) {
    console.warn("updateCartItem skipped: both productId and variantId are required by backend.", { productId, variantId, quantity });
    return null;
  }

  try {
    const response = await apiClient.put(
      ENDPOINTS.CART.UPDATE_ITEM,
      { productId, variantId, quantity },
      { headers: { "x-storefront": storefront } }
    );
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. Remove single item from cart
 * DELETE /api/cart/item
 * Note: body required on DELETE.
 * @param {Object} payload { productId, variantId }
 * @param {{ storefront?: string }} [options]
 */
export async function removeCartItem({ productId, variantId }, { storefront = "ecomm" } = {}) {
  if (!productId || !variantId) {
    console.warn("removeCartItem skipped: both productId and variantId are required by backend.", { productId, variantId });
    return null;
  }

  try {
    const response = await apiClient.delete(ENDPOINTS.CART.REMOVE_ITEM, {
      data: { productId, variantId },
      headers: { "x-storefront": storefront },
    });
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Bulk remove selected items
 * POST /api/cart/bulk-remove
 * @param {Object} payload { items: [{ productId, variantId }] }
 * @param {{ storefront?: string }} [options]
 */
export async function bulkRemoveCartItems({ items = [] }, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.CART.BULK_REMOVE,
      { items },
      { headers: { "x-storefront": storefront } }
    );
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Clear entire cart
 * DELETE /api/cart/clear
 * @param {{ storefront?: string }} [options]
 */
export async function clearCart({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.delete(ENDPOINTS.CART.CLEAR, {
      headers: { "x-storefront": storefront },
    });
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Merge guest localStorage cart items into the cloud cart upon login
 * POST /api/cart/merge
 * @param {Object} payload { items: [{ productId, productSlug, variantId, quantity }] }
 * @param {{ storefront?: string }} [options]
 */
export async function mergeCart({ items = [] } = {}, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.CART.MERGE,
      { items },
      { headers: { "x-storefront": storefront } }
    );
    return normalizeCartResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  bulkRemoveCartItems,
  clearCart,
  mergeCart,
};

import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * 1. Fetch current cart
 * GET /cart
 */
export async function getCart() {
  try {
    const response = await apiClient.get(ENDPOINTS.CART.GET);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Add an item to cart
 * POST /cart
 * @param {Object} payload { productSlug, variantId, quantity }
 */
export async function addToCart({ productSlug, variantId, quantity = 1 }) {
  try {
    const response = await apiClient.post(ENDPOINTS.CART.ADD, {
      productSlug,
      variantId,
      quantity,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. Update quantity of item in cart
 * PUT /cart/item
 * @param {Object} payload { productId, variantId, quantity }
 */
export async function updateCartItem({ productId, variantId, quantity }) {
  try {
    const response = await apiClient.put(ENDPOINTS.CART.UPDATE_ITEM, {
      productId,
      variantId,
      quantity,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. Remove item from cart
 * DELETE /cart/item
 * @param {Object} payload { productId, variantId }
 */
export async function removeCartItem({ productId, variantId }) {
  try {
    const response = await apiClient.delete(ENDPOINTS.CART.REMOVE_ITEM, {
      data: { productId, variantId },
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Bulk remove selected items
 * POST /cart/bulk-remove
 * @param {Object} payload { items: [{ productId, variantId }] }
 */
export async function bulkRemoveCartItems({ items = [] }) {
  try {
    const response = await apiClient.post(ENDPOINTS.CART.BULK_REMOVE, { items });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Clear entire cart
 * DELETE /cart/clear
 */
export async function clearCart() {
  try {
    const response = await apiClient.delete(ENDPOINTS.CART.CLEAR);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Merge guest localStorage cart items into the cloud cart upon login
 * POST /cart/merge
 * @param {Object} payload { items: [...] }
 */
export async function mergeCart({ items = [] } = {}) {
  try {
    const response = await apiClient.post(ENDPOINTS.CART.MERGE, { items });
    return response.data?.data || response.data;
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

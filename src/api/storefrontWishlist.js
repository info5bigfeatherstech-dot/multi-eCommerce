import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * 1. Fetch user's wishlist items
 * GET /wishlist
 */
export async function getWishlist() {
  try {
    const response = await apiClient.get(ENDPOINTS.WISHLIST.GET);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Add item to wishlist
 * POST /wishlist/add
 * @param {Object} payload { productSlug, variantId }
 */
export async function addToWishlist({ productSlug, variantId }) {
  try {
    const response = await apiClient.post(ENDPOINTS.WISHLIST.ADD, {
      productSlug,
      variantId,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. Remove single item by slug
 * DELETE /wishlist/remove/:slug
 * @param {string} slug
 */
export async function removeWishlistItem(slug) {
  try {
    const response = await apiClient.delete(ENDPOINTS.WISHLIST.REMOVE_BY_SLUG(slug));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. Bulk delete by slugs
 * DELETE /wishlist/remove-bulk
 * @param {Object} payload { slugs: string[] }
 */
export async function bulkRemoveWishlistItems({ slugs = [] }) {
  try {
    const response = await apiClient.delete(ENDPOINTS.WISHLIST.REMOVE_BULK, {
      data: { slugs },
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Clear all wishlist items
 * DELETE /wishlist/clear
 */
export async function clearWishlist() {
  try {
    const response = await apiClient.delete(ENDPOINTS.WISHLIST.CLEAR);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Merge local guest wishlist on sign-in
 * POST /wishlist/merge
 * @param {Object} payload { items: [...], slugs: [...] }
 */
export async function mergeWishlist({ items = [], slugs = [] } = {}) {
  try {
    const response = await apiClient.post(ENDPOINTS.WISHLIST.MERGE, {
      items,
      slugs,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Move wishlist items directly into the cart
 * POST /wishlist/move-to-cart
 * @param {Object} payload { moveAll: boolean, productIds?: string[] }
 */
export async function moveWishlistToCart({ moveAll = false, productIds = [] } = {}) {
  try {
    const response = await apiClient.post(ENDPOINTS.WISHLIST.MOVE_TO_CART, {
      moveAll,
      productIds,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  bulkRemoveWishlistItems,
  clearWishlist,
  mergeWishlist,
  moveWishlistToCart,
};

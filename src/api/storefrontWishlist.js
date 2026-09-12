import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Normalizes backend Wishlist response into a consistent shape
 * Backend returns:
 * { success: true, wishlist: { _id, userId, products: [{ _id, addedAt, product }] }, userType, storefront }
 */
export function normalizeWishlistResponse(data) {
  if (!data) return { items: [], totalCount: 0, raw: null };
  const wishlistObj = data.wishlist || data.data || data;
  const rawProducts = Array.isArray(wishlistObj.products) ? wishlistObj.products : [];

  const items = rawProducts
    .map((entry) => {
      const prod = entry.product || {};
      const firstVariant = prod.variants?.[0] || {};
      const unitPrice =
        firstVariant.finalPrice ??
        firstVariant.price?.current ??
        firstVariant.price?.sale ??
        firstVariant.price?.base ??
        prod.price ??
        0;
      const originalPrice = firstVariant.price?.base || prod.originalPrice || unitPrice;
      const discountPercentage = firstVariant.price?.discountPercentage || 0;

      return {
        wishlistEntryId: entry._id,
        id: prod._id || prod.id,
        _id: prod._id || prod.id,
        name: prod.name || prod.title || "Product",
        slug: prod.slug,
        price: unitPrice,
        originalPrice,
        discountPercentage,
        inStock: firstVariant.inventory?.quantity > 0 || prod.inStock !== false,
        imageUrl: firstVariant.images?.[0] || prod.images?.[0] || prod.imageUrl || "",
        addedAt: entry.addedAt,
        variantId: firstVariant._id,
        variants: prod.variants || [],
        sku: firstVariant.sku || "",
        product: prod,
      };
    })
    .filter((item) => Boolean(item.slug || item.id));

  return {
    _id: wishlistObj._id,
    userId: wishlistObj.userId,
    items,
    totalCount: items.length,
    raw: data,
    storefront: data.storefront || "ecomm",
    userType: data.userType || "user",
  };
}

/**
 * 1. Fetch user's wishlist
 * GET /api/wishlist
 */
export async function getWishlist({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.get(ENDPOINTS.WISHLIST.GET, {
      headers: { "x-storefront": storefront },
    });
    return normalizeWishlistResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. Add product to wishlist
 * POST /api/wishlist/add
 * @param {Object} payload { productSlug, variantId }
 */
export async function addToWishlist({ productSlug, variantId }, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.WISHLIST.ADD,
      {
        productSlug,
        ...(variantId ? { variantId } : {}),
      },
      {
        headers: { "x-storefront": storefront },
      }
    );
    return normalizeWishlistResponse(response.data);
  } catch (error) {
    const msg = normalizeApiError(error);
    throw new Error(msg);
  }
}

/**
 * 3. Remove single product by slug (removes all variants of that slug)
 * DELETE /api/wishlist/remove/:slug
 */
export async function removeWishlistItem(slug, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.delete(ENDPOINTS.WISHLIST.REMOVE_BY_SLUG(slug), {
      headers: { "x-storefront": storefront },
    });
    return normalizeWishlistResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. Bulk remove by slugs
 * DELETE /api/wishlist/remove-bulk
 * @param {Object} payload { slugs: string[] }
 */
export async function bulkRemoveWishlistItems({ slugs = [] }, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.delete(ENDPOINTS.WISHLIST.REMOVE_BULK, {
      data: { slugs },
      headers: { "x-storefront": storefront },
    });
    return normalizeWishlistResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. Clear entire wishlist
 * DELETE /api/wishlist/clear
 */
export async function clearWishlist({ storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.delete(ENDPOINTS.WISHLIST.CLEAR, {
      headers: { "x-storefront": storefront },
    });
    return normalizeWishlistResponse(response.data);
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. Merge local guest wishlist after sign-in
 * POST /api/wishlist/merge
 * @param {Object} payload { items: [{ slug, variantId }], slugs?: string[] }
 */
export async function mergeWishlist({ items = [], slugs = [] } = {}, { storefront = "ecomm" } = {}) {
  try {
    const body = items.length > 0 ? { items } : { slugs };
    const response = await apiClient.post(ENDPOINTS.WISHLIST.MERGE, body, {
      headers: { "x-storefront": storefront },
    });
    return response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. Move wishlist items directly into the storefront cart
 * POST /api/wishlist/move-to-cart
 * @param {Object} payload { moveAll: boolean, productIds?: string[] }
 */
export async function moveWishlistToCart({ moveAll = false, productIds = [] } = {}, { storefront = "ecomm" } = {}) {
  try {
    const response = await apiClient.post(
      ENDPOINTS.WISHLIST.MOVE_TO_CART,
      {
        moveAll,
        productIds: moveAll ? undefined : productIds,
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

export default {
  normalizeWishlistResponse,
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  bulkRemoveWishlistItems,
  clearWishlist,
  mergeWishlist,
  moveWishlistToCart,
};

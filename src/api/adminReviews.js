import { apiClient } from "./client.js";
import { normalizeApiError, buildFormData } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * -------------------------------------------------------------
 * A. Admin Reviews & Customer Submissions
 * -------------------------------------------------------------
 */

/**
 * 1. GET /api/admin/product-reviews
 * List all reviews (customer submissions + generated)
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {string} [params.source="admin"] - 'all' | 'customer' | 'admin' | 'generated'
 * @param {string} [params.search=""]
 * @param {number|string} [params.rating]
 * @returns {Promise<Object>}
 */
export async function getAdminProductReviews({
  page = 1,
  limit = 20,
  source = "admin",
  search = "",
  rating,
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (source && source !== "all") params.set("source", source);
    if (search) params.set("search", search);
    if (rating && rating !== "all") params.set("rating", String(rating));

    const response = await apiClient.get(`${ENDPOINTS.REVIEWS.ADMIN_LIST}?${params.toString()}`);
    const resData = response.data;
    const reviewsList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.reviews || [];
    const total = resData?.pagination?.total ?? resData?.total ?? reviewsList.length;

    return {
      reviews: reviewsList,
      total,
      pagination: resData?.pagination || { page, limit, total },
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. PATCH /api/admin/product-reviews/:id/status
 * Approve or hide a review (toggle visibility)
 * @param {string} id
 * @param {Object} payload
 * @param {boolean} payload.isActive
 * @returns {Promise<Object>}
 */
export async function updateReviewStatus(id, { isActive }) {
  try {
    const response = await apiClient.patch(ENDPOINTS.REVIEWS.ADMIN_STATUS(id), {
      isActive: Boolean(isActive),
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. GET /api/admin/products/variant/:code
 * Lookup product details by SKU / variant code for linking reviews
 * @param {string} code
 * @returns {Promise<Object>}
 */
export async function lookupProductVariant(code) {
  try {
    const response = await apiClient.get(ENDPOINTS.REVIEWS.VARIANT_LOOKUP(code));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * -------------------------------------------------------------
 * B. Generated / Seeded Reviews (Admin)
 * -------------------------------------------------------------
 */

/**
 * 4. GET /api/admin/product-reviews/generated
 * List AI / Admin generated reviews
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @returns {Promise<Object>}
 */
export async function getGeneratedReviews({ page = 1, limit = 20 } = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));

    const response = await apiClient.get(
      `${ENDPOINTS.REVIEWS.GENERATED_LIST}?${params.toString()}`
    );
    const resData = response.data;
    const reviewsList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.reviews || [];
    const total = resData?.pagination?.total ?? resData?.total ?? reviewsList.length;

    return {
      reviews: reviewsList,
      total,
      pagination: resData?.pagination || { page, limit, total },
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. GET /api/admin/product-reviews/generated/:id
 * Get single generated review details
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getGeneratedReviewById(id) {
  try {
    const response = await apiClient.get(ENDPOINTS.REVIEWS.GENERATED_DETAIL(id));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. POST /api/admin/product-reviews/generated
 * Create a verified / seeded product review
 * @param {Object} payload
 * @param {string} payload.productId
 * @param {string} [payload.variantCode]
 * @param {string} payload.reviewerName
 * @param {number} payload.rating
 * @param {string} payload.title
 * @param {string} payload.comment
 * @param {boolean} [payload.verifiedPurchase=true]
 * @param {string} [payload.date]
 * @returns {Promise<Object>}
 */
export async function createGeneratedReview({
  productId,
  variantCode,
  reviewerName,
  rating,
  title,
  comment,
  verifiedPurchase = true,
  date,
}) {
  try {
    const response = await apiClient.post(ENDPOINTS.REVIEWS.GENERATED_CREATE, {
      productId,
      variantCode,
      reviewerName,
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: Boolean(verifiedPurchase),
      date: date || new Date().toISOString(),
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. PUT /api/admin/product-reviews/generated/:id
 * Update an existing generated review
 * @param {string} id
 * @param {Object} payload
 * @param {string} [payload.reviewerName]
 * @param {number} [payload.rating]
 * @param {string} [payload.title]
 * @param {string} [payload.comment]
 * @param {boolean} [payload.verifiedPurchase]
 * @param {string} [payload.date]
 * @returns {Promise<Object>}
 */
export async function updateGeneratedReview(id, {
  reviewerName,
  rating,
  title,
  comment,
  verifiedPurchase,
  date,
}) {
  try {
    const payload = {};
    if (reviewerName !== undefined) payload.reviewerName = reviewerName;
    if (rating !== undefined) payload.rating = Number(rating);
    if (title !== undefined) payload.title = title;
    if (comment !== undefined) payload.comment = comment;
    if (verifiedPurchase !== undefined) payload.verifiedPurchase = Boolean(verifiedPurchase);
    if (date !== undefined) payload.date = date;

    const response = await apiClient.put(
      ENDPOINTS.REVIEWS.GENERATED_UPDATE(id),
      payload
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8. DELETE /api/admin/product-reviews/generated/:id
 * Delete a generated review
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function deleteGeneratedReview(id) {
  try {
    const response = await apiClient.delete(ENDPOINTS.REVIEWS.GENERATED_DELETE(id));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * -------------------------------------------------------------
 * C. Public & Storefront Review Endpoints
 * -------------------------------------------------------------
 */

/**
 * 9. GET /api/product-reviews/public/:productId
 * Paginated public reviews for a product
 * @param {string} productId
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.sort="newest"]
 * @returns {Promise<Object>}
 */
export async function getPublicProductReviews(productId, {
  page = 1,
  limit = 10,
  sort = "newest",
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (sort) params.set("sort", sort);

    const response = await apiClient.get(
      `${ENDPOINTS.REVIEWS.PUBLIC_LIST(productId)}?${params.toString()}`
    );
    const resData = response.data;
    const reviews = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.reviews || [];
    const total = resData?.pagination?.total ?? resData?.total ?? reviews.length;

    return {
      reviews,
      total,
      pagination: resData?.pagination || { page, limit, total },
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 10. GET /api/product-reviews/public/:productId/summary
 * Average star rating & star count distribution
 * @param {string} productId
 * @returns {Promise<Object>}
 */
export async function getPublicProductReviewSummary(productId) {
  try {
    const response = await apiClient.get(ENDPOINTS.REVIEWS.PUBLIC_SUMMARY(productId));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 11. GET /api/product-reviews/mine/:productId
 * Fetch current user's submitted review for a product (Requires customer auth)
 * @param {string} productId
 * @returns {Promise<Object>}
 */
export async function getMyProductReview(productId) {
  try {
    const response = await apiClient.get(ENDPOINTS.REVIEWS.MINE(productId));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 12. GET /api/product-reviews/eligibility/:productId
 * Check if logged-in customer is eligible to review (Verified purchaser validation)
 * @param {string} productId
 * @returns {Promise<Object>}
 */
export async function checkReviewEligibility(productId) {
  try {
    const response = await apiClient.get(ENDPOINTS.REVIEWS.ELIGIBILITY(productId));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 13. POST /api/product-reviews
 * Submit a new customer product review (multipart/form-data: { productId, rating, title, comment, images })
 * @param {Object} payload
 * @param {string} payload.productId
 * @param {number} payload.rating
 * @param {string} payload.title
 * @param {string} payload.comment
 * @param {File[]|string[]} [payload.images]
 * @returns {Promise<Object>}
 */
export async function submitProductReview({
  productId,
  rating,
  title,
  comment,
  images = [],
}) {
  try {
    const hasFileAttachment =
      Array.isArray(images) &&
      images.some((img) => typeof window !== "undefined" && (img instanceof File || img instanceof Blob));

    let requestBody;
    let requestHeaders = {};

    if (hasFileAttachment) {
      requestBody = buildFormData({
        productId,
        rating,
        title,
        comment,
        images,
      });
      requestHeaders["Content-Type"] = "multipart/form-data";
    } else {
      requestBody = {
        productId,
        rating: Number(rating),
        title,
        comment,
        images,
      };
    }

    const response = await apiClient.post(
      ENDPOINTS.REVIEWS.SUBMIT,
      requestBody,
      { headers: requestHeaders }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

import { apiClient } from "./client.js";
import { normalizeApiError } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * Valid Out of Stock Inquiry Statuses
 */
export const OOS_INQUIRY_STATUSES = [
  "pending",
  "contacted",
  "resolved",
  "cancelled",
];

/**
 * 1. GET /api/admin/oos-inquiries
 * List all customer out-of-stock inquiries
 * @param {Object} [params]
 * @param {number} [params.page=1]
 * @param {number} [params.limit=20]
 * @param {number} [params.days=30]
 * @param {string} [params.search=""]
 * @param {string} [params.status="all"] - 'all' | 'pending' | 'contacted' | 'resolved' | 'cancelled'
 * @returns {Promise<Object>}
 */
export async function getOosInquiries({
  page = 1,
  limit = 20,
  days = 30,
  search = "",
  status = "all",
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (days) params.set("days", String(days));
    if (search) params.set("search", search);
    if (status && status !== "all" && status !== "All") params.set("status", status.toLowerCase());

    const response = await apiClient.get(`${ENDPOINTS.OOS_INQUIRIES.ADMIN_LIST}?${params.toString()}`);
    const resData = response.data;
    const inquiries = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.inquiries || [];
    const total = resData?.pagination?.total ?? resData?.total ?? inquiries.length;

    return {
      inquiries,
      total,
      pagination: resData?.pagination || { page, limit, total },
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. PATCH /api/admin/oos-inquiries/:id/status
 * Update resolution status of an inquiry
 * @param {string} id
 * @param {Object} payload
 * @param {string} payload.status - 'pending' | 'contacted' | 'resolved' | 'cancelled'
 * @param {string} [payload.adminNote]
 * @returns {Promise<Object>}
 */
export async function updateOosInquiryStatus(id, { status, adminNote = "" }) {
  try {
    const response = await apiClient.patch(
      ENDPOINTS.OOS_INQUIRIES.ADMIN_STATUS(id),
      {
        status: status.toLowerCase(),
        adminNote,
      }
    );
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. POST /api/oos-inquiries
 * Create customer out-of-stock alert (Storefront)
 * @param {Object} payload
 * @param {string} payload.productId
 * @param {string} [payload.variantId]
 * @param {string} [payload.productCode]
 * @param {string} payload.email
 * @param {string} [payload.phone]
 * @param {number} [payload.requestedQty=1]
 * @returns {Promise<Object>}
 */
export async function createStorefrontOosInquiry({
  productId,
  variantId,
  productCode,
  email,
  phone,
  requestedQty = 1,
}) {
  try {
    const response = await apiClient.post(ENDPOINTS.OOS_INQUIRIES.STOREFRONT_CREATE, {
      productId,
      variantId,
      productCode,
      email,
      phone,
      requestedQty,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

import { apiClient } from "./client.js";
import { normalizeApiError, downloadBlob } from "./helpers.js";
import { ENDPOINTS } from "./endpoints.js";

/**
 * 1. GET /admin/analytics/users
 * Paginated customer list with search & role filters
 */
export async function getAdminUsers({
  page = 1,
  limit = 20,
  search = "",
  role = "",
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (role && role !== "All") params.set("role", role);

    const response = await apiClient.get(`${ENDPOINTS.ADMIN_ANALYTICS.USERS}?${params.toString()}`);
    const resData = response.data;
    const usersList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.users || [];
    const total = resData?.pagination?.total ?? resData?.total ?? usersList.length;

    return {
      users: usersList,
      total,
      pagination: resData?.pagination,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 2. GET /admin/analytics/users/:userId
 * Detailed customer overview (order history, active carts, wishlists, registration dates)
 */
export async function getAdminUserDetail(userId) {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.USER_DETAIL(userId));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 3. GET /admin/analytics/users/export
 * Download customers as an Excel spreadsheet (.xlsx)
 */
export async function exportAdminUsersExcel() {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.USERS_EXPORT, {
      responseType: "blob",
    });
    downloadBlob(
      response.data,
      `apexmart_customers_${new Date().toISOString().substring(0, 10)}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    return true;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 4. POST /admin/analytics/users/bulk-cart-reminder-email
 * Send recovery reminder emails to selected users
 */
export async function sendBulkCartReminderEmail({ userIds = [], subject, message, isTest = false }) {
  try {
    const response = await apiClient.post(ENDPOINTS.ADMIN_ANALYTICS.BULK_CART_EMAIL, {
      userIds,
      subject,
      message,
      isTest,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 5. POST /admin/analytics/users/bulk-cart-reminder-push
 * Send bulk Web Push cart notifications
 */
export async function sendBulkCartReminderPush({ userIds = [], title, body, directLink }) {
  try {
    const response = await apiClient.post(ENDPOINTS.ADMIN_ANALYTICS.BULK_CART_PUSH, {
      userIds,
      title,
      body,
      directLink,
    });
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 6. GET /admin/analytics/push-settings
 * Retrieve automated lead recovery push notification settings
 */
export async function getPushSettings() {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.PUSH_SETTINGS);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 7. PUT /admin/analytics/push-settings
 * Update lead recovery push schedule and active state
 */
export async function updatePushSettings(newSettings) {
  try {
    const response = await apiClient.put(ENDPOINTS.ADMIN_ANALYTICS.PUSH_SETTINGS, newSettings);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 8. GET /admin/analytics/carts
 * All customer carts (?page=1&limit=20&sortBy=updatedAt&order=desc)
 */
export async function getAdminCarts({
  page = 1,
  limit = 20,
  sortBy = "updatedAt",
  order = "desc",
  search = "",
} = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (sortBy) params.set("sortBy", sortBy);
    if (order) params.set("order", order);
    if (search) params.set("search", search);

    const response = await apiClient.get(`${ENDPOINTS.ADMIN_ANALYTICS.CARTS}?${params.toString()}`);
    const resData = response.data;
    const cartsList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.carts || [];
    const total = resData?.pagination?.total ?? resData?.total ?? cartsList.length;

    return {
      carts: cartsList,
      total,
      pagination: resData?.pagination,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 9. GET /admin/analytics/carts/:cartId
 * Individual cart details modal snapshot
 */
export async function getAdminCartDetail(cartId) {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.CART_DETAIL(cartId));
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 10. GET /admin/analytics/carts/abandoned
 * Abandoned carts older than X hours (?hours=24)
 */
export async function getAbandonedCarts({ hours = 24 } = {}) {
  try {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN_ANALYTICS.CARTS_ABANDONED}?hours=${hours}`);
    const resData = response.data;
    const cartsList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.carts || [];
    return {
      carts: cartsList,
      count: resData?.count ?? cartsList.length,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 11. GET /admin/analytics/carts/high-value
 * High-value carts above threshold (?minAmount=5000)
 */
export async function getHighValueCarts({ minAmount = 5000 } = {}) {
  try {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN_ANALYTICS.CARTS_HIGH_VALUE}?minAmount=${minAmount}`);
    const resData = response.data;
    const cartsList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.carts || [];
    return {
      carts: cartsList,
      count: resData?.count ?? cartsList.length,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 12. GET /admin/analytics/wishlists
 * All user wishlists (?page=1&limit=20)
 */
export async function getAdminWishlists({ page = 1, limit = 20, search = "" } = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.set("page", String(page));
    if (limit) params.set("limit", String(limit));
    if (search) params.set("search", search);

    const response = await apiClient.get(`${ENDPOINTS.ADMIN_ANALYTICS.WISHLISTS}?${params.toString()}`);
    const resData = response.data;
    const wishlistsList = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.wishlists || [];
    const total = resData?.pagination?.total ?? resData?.total ?? wishlistsList.length;

    return {
      wishlists: wishlistsList,
      total,
      pagination: resData?.pagination,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 13. GET /admin/analytics/wishlists/stale
 * Wishlists untouched for X days (?days=7)
 */
export async function getStaleWishlists({ days = 7 } = {}) {
  try {
    const response = await apiClient.get(`${ENDPOINTS.ADMIN_ANALYTICS.WISHLISTS_STALE}?days=${days}`);
    const resData = response.data;
    const list = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.wishlists || [];
    return {
      wishlists: list,
      count: resData?.count ?? list.length,
    };
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 14. GET /admin/analytics/wishlists/popular-products
 * Top saved wishlist products across the platform
 */
export async function getPopularWishlistProducts() {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.WISHLISTS_POPULAR);
    const resData = response.data;
    return Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : resData?.products || [];
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 15. GET /admin/analytics/dashboard/summary
 * Top-level KPIs: revenue, orders, active products, users, abandoned carts
 */
export async function getDashboardSummary() {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.DASHBOARD_SUMMARY);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

/**
 * 16. GET /admin/seo-analytics/overview
 * Search traffic, crawler status, and SEO visibility score
 */
export async function getSeoAnalyticsOverview() {
  try {
    const response = await apiClient.get(ENDPOINTS.ADMIN_ANALYTICS.SEO_OVERVIEW);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(normalizeApiError(error));
  }
}

export default {
  getDashboardSummary,
  getSeoAnalyticsOverview,
  getAdminUsers,
  getAdminUserDetail,
  exportAdminUsersExcel,
  sendBulkCartReminderEmail,
  sendBulkCartReminderPush,
  getPushSettings,
  updatePushSettings,
  getAdminCarts,
  getAdminCartDetail,
  getAbandonedCarts,
  getHighValueCarts,
  getAdminWishlists,
  getStaleWishlists,
  getPopularWishlistProducts,
};

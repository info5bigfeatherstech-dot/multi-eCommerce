/**
 * Centralized API Endpoint Definitions
 * Single source of truth for all Storefront Cart, Wishlist, and Admin Customer Management routes.
 */

export const ENDPOINTS = {
  // Ecomm Customer Auth APIs
  AUTH: {
    SECURITY_QUESTIONS: "/auth/security-questions",
    REGISTER: "/auth/register",
    VERIFY_OTP_LOGIN: "/auth/otp-verify-login",
    LOGIN: "/auth/login",
    FORGOT_FIND_USER: "/auth/forgot-password/find-user",
    FORGOT_VERIFY_ANSWERS: "/auth/forgot-password/verify-answers",
    FORGOT_VERIFY_OTP_FALLBACK: "/auth/forgot-password/verify-otp-fallback",
    FORGOT_RESET_DIRECT: "/auth/forgot-password/reset-direct",
  },

  // Storefront Cart APIs
  CART: {
    GET: "/cart",
    ADD: "/cart",
    UPDATE_ITEM: "/cart/item",
    REMOVE_ITEM: "/cart/item",
    BULK_REMOVE: "/cart/bulk-remove",
    CLEAR: "/cart/clear",
    MERGE: "/cart/merge",
  },

  // Storefront Wishlist APIs
  WISHLIST: {
    GET: "/wishlist",
    ADD: "/wishlist/add",
    REMOVE_BY_SLUG: (slug) => `/wishlist/remove/${encodeURIComponent(slug)}`,
    REMOVE_BULK: "/wishlist/remove-bulk",
    CLEAR: "/wishlist/clear",
    MERGE: "/wishlist/merge",
    MOVE_TO_CART: "/wishlist/move-to-cart",
  },

  // Storefront Address CRUD APIs (Scoped per storefront: ecomm / wholesale)
  ADDRESSES: {
    BASE: "/addresses",
    LIST: "/addresses",
    CREATE: "/addresses",
    DETAIL: (id) => `/addresses/${encodeURIComponent(id)}`,
    UPDATE: (id) => `/addresses/${encodeURIComponent(id)}`,
    DELETE: (id) => `/addresses/${encodeURIComponent(id)}`,
  },

  // Admin Analytics & Customer Management APIs
  ADMIN_ANALYTICS: {
    DASHBOARD_SUMMARY: "/admin/analytics/dashboard/summary",
    SEO_OVERVIEW: "/admin/seo-analytics/overview",
    USERS: "/admin/analytics/users",
    USER_DETAIL: (userId) => `/admin/analytics/users/${encodeURIComponent(userId)}`,
    USERS_EXPORT: "/admin/analytics/users/export",
    BULK_CART_EMAIL: "/admin/analytics/users/bulk-cart-reminder-email",
    BULK_CART_PUSH: "/admin/analytics/users/bulk-cart-reminder-push",
    PUSH_SETTINGS: "/admin/analytics/push-settings",
    CARTS: "/admin/analytics/carts",
    CART_DETAIL: (cartId) => `/admin/analytics/carts/${encodeURIComponent(cartId)}`,
    CARTS_ABANDONED: "/admin/analytics/carts/abandoned",
    CARTS_HIGH_VALUE: "/admin/analytics/carts/high-value",
    WISHLISTS: "/admin/analytics/wishlists",
    WISHLISTS_STALE: "/admin/analytics/wishlists/stale",
    WISHLISTS_POPULAR: "/admin/analytics/wishlists/popular-products",
  },

  // Staff Management APIs
  STAFF: {
    LIST: "/admin/staff",
    DETAIL: (id) => `/admin/staff/${encodeURIComponent(id)}`,
    CREATE: "/admin/staff",
    UPDATE: (id) => `/admin/staff/${encodeURIComponent(id)}`,
    DELETE: (id) => `/admin/staff/${encodeURIComponent(id)}`,
    INITIATE_RESET: (id) => `/admin/staff/${encodeURIComponent(id)}/initiate-reset`,
    VERIFY_RESET: (id) => `/admin/staff/${encodeURIComponent(id)}/verify-reset`,
    PROFILE_ME: "/admin/staff/profile/me",
    PROFILE_INITIATE_PASSWORD_RESET: "/admin/staff/profile/me/initiate-password-reset",
    PROFILE_VERIFY_PASSWORD_RESET: "/admin/staff/profile/me/verify-password-reset",
  },

  // Out of Stock (OOS) Query APIs
  OOS_INQUIRIES: {
    ADMIN_LIST: "/admin/oos-inquiries",
    ADMIN_STATUS: (id) => `/admin/oos-inquiries/${encodeURIComponent(id)}/status`,
    STOREFRONT_CREATE: "/oos-inquiries",
  },

  // Product Reviews & Moderation APIs
  REVIEWS: {
    ADMIN_LIST: "/admin/product-reviews",
    ADMIN_STATUS: (id) => `/admin/product-reviews/${encodeURIComponent(id)}/status`,
    VARIANT_LOOKUP: (code) => `/admin/products/variant/${encodeURIComponent(code)}`,
    GENERATED_LIST: "/admin/product-reviews/generated",
    GENERATED_DETAIL: (id) => `/admin/product-reviews/generated/${encodeURIComponent(id)}`,
    GENERATED_CREATE: "/admin/product-reviews/generated",
    GENERATED_UPDATE: (id) => `/admin/product-reviews/generated/${encodeURIComponent(id)}`,
    GENERATED_DELETE: (id) => `/admin/product-reviews/generated/${encodeURIComponent(id)}`,
    PUBLIC_LIST: (productId) => `/product-reviews/public/${encodeURIComponent(productId)}`,
    PUBLIC_SUMMARY: (productId) => `/product-reviews/public/${encodeURIComponent(productId)}/summary`,
    MINE: (productId) => `/product-reviews/mine/${encodeURIComponent(productId)}`,
    ELIGIBILITY: (productId) => `/product-reviews/eligibility/${encodeURIComponent(productId)}`,
    SUBMIT: "/product-reviews",
  },

  // Admin Products & Archiving APIs
  ADMIN_PRODUCTS: {
    ALL: "/admin/products/all",
    GET_BY_SLUG: (slug) => `/admin/products/${encodeURIComponent(slug)}`,
    ARCHIVE: (slug) => `/admin/products/${encodeURIComponent(slug)}`, // DELETE (Soft delete)
    ARCHIVED_LIST: "/admin/products/archived", // GET
    RESTORE: (slug) => `/admin/products/restore/${encodeURIComponent(slug)}`, // PATCH
    HARD_DELETE: (slug) => `/admin/products/hard/${encodeURIComponent(slug)}`, // DELETE (Permanent)
    BULK_STATUS: "/admin/products/bulk-status", // PATCH
    UPDATE_FLAGS: "/admin/products/updateFlags",
  },

  ADMIN_PRODUCT_LABELS: {
    LIST: "/admin/product-labels",
    DETAIL: (idOrSlug) => `/admin/product-labels/${encodeURIComponent(idOrSlug)}`,
    CREATE: "/admin/product-labels",
    UPDATE: (idOrSlug) => `/admin/product-labels/${encodeURIComponent(idOrSlug)}`,
    DELETE: (idOrSlug) => `/admin/product-labels/${encodeURIComponent(idOrSlug)}`,
  },

  // Public Storefront Product Labels & Products APIs
  PRODUCT_LABELS: {
    PUBLIC_LIST: "/product-labels",
    PUBLIC_DETAIL: (slug) => `/product-labels/${encodeURIComponent(slug)}`,
  },

  STOREFRONT_PRODUCTS: {
    ALL: "/products/all",
    SEARCH: "/products/search",
    BY_CATEGORY: (slug) => `/products/category/${encodeURIComponent(slug)}`,
  },
};

export default ENDPOINTS;

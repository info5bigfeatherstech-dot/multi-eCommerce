/**
 * Centralized API Endpoint Definitions
 * Single source of truth for all Storefront Cart, Wishlist, and Admin Customer Management routes.
 */

export const ENDPOINTS = {
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

  // Admin Analytics & Customer Management APIs
  ADMIN_ANALYTICS: {
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
};

export default ENDPOINTS;

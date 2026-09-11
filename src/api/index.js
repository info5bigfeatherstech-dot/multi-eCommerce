/**
 * Admin API Module Entry Point
 * Exports unified services, client, and helpers.
 */

export { apiClient } from "./client.js";
export * as authStorage from "./authStorage.js";
export {
  getAdminAccessToken,
  setAdminAccessToken,
  getAdminRefreshToken,
  setAdminRefreshToken,
  setAdminTokens,
  clearAdminTokens,
} from "./authStorage.js";

export {
  normalizeApiError,
  buildFormData,
  downloadBlob,
} from "./helpers.js";

// Category Management API
export * as adminCategories from "./adminCategories.js";
export {
  getAllCategories,
  createCategory,
  updateCategory,
  hardDeleteCategory,
  reorderCategories,
  toggleCategoryVisibility,
  toggleCategoryMovingFast,
} from "./adminCategories.js";

// Product, Variant & Archived Product Management API
export * as adminProducts from "./adminProducts.js";
export {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  bulkUpdateProductStatus,
  bulkUpdateProductFlags,
  getArchivedProducts,
  archiveProduct,
  restoreProduct,
  hardDeleteProduct,
  downloadBulkUploadTemplate,
  previewBulkUpload,
  importProductsFromCSV,
  bulkUploadNewProductsWithImages,
  exportProductsCSV,
} from "./adminProducts.js";

// Enterprise Order Management System (OMS) & Fulfillment API
export * as adminOrders from "./adminOrders.js";
export {
  isCarrierPaymentReady,
  canEditPendingOrder,
  BUCKET_STATUS_MAP,
  getOrderSummary,
  getOrders,
  autoSyncStatuses,
  getOrderItem,
  trackOrder,
  getOrderInvoiceHtml,
  getOrderAddressIntelligence,
  previewEditPendingAddress,
  editPendingAddress,
  previewEditPendingItems,
  editPendingItems,
  ensureShipment,
  assignShipment,
  getPickupCalendar,
  schedulePickup,
  syncShiprocket,
  generateManifest,
  generateShippingLabel,
  downloadShippingLabelFile,
  downloadManifestFile,
  cancelShipment,
  retryPickup,
  bulkConfirmOrders,
  bulkCancelOrders,
  bulkShipNow,
  bulkSchedulePickup,
  bulkSyncShiprocket,
  bulkDownloadTaxInvoices,
  bulkDownloadShippingLabels,
  bulkDownloadManifests,
  getReturnRequests,
  getReturnRequest,
  decideReturnRequest,
  refundReturnRequest,
  getReturnChat,
  sendReturnChat,
} from "./adminOrders.js";

// Centralized Endpoints Map
export { ENDPOINTS } from "./endpoints.js";

// Storefront Cart API
export * as storefrontCart from "./storefrontCart.js";
export {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  bulkRemoveCartItems,
  clearCart,
  mergeCart,
} from "./storefrontCart.js";

// Storefront Wishlist API
export * as storefrontWishlist from "./storefrontWishlist.js";
export {
  getWishlist,
  addToWishlist,
  removeWishlistItem,
  bulkRemoveWishlistItems,
  clearWishlist,
  mergeWishlist,
  moveWishlistToCart,
} from "./storefrontWishlist.js";

// Admin Analytics & Customer Management API
export * as adminCustomerAnalytics from "./adminCustomerAnalytics.js";
export {
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
} from "./adminCustomerAnalytics.js";

export default {
  client: () => import("./client.js").then((m) => m.apiClient),
};

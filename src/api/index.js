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
  getEcommAccessToken,
  setEcommAccessToken,
  clearEcommAccessToken,
} from "./authStorage.js";

// Ecomm Customer Auth API
export * as ecommAuth from "./ecommAuth.js";
export {
  DEFAULT_SECURITY_QUESTIONS,
  getSecurityQuestions,
  register,
  verifyRegistrationOtp,
  login,
  forgotPasswordFindUser,
  forgotPasswordVerifyAnswers,
  forgotPasswordVerifyOtpFallback,
  forgotPasswordResetDirect,
  logoutCustomer,
} from "./ecommAuth.js";

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

// Product marketing labels (Admin & Storefront)
export * as adminProductLabels from "./adminProductLabels.js";
export {
  getAdminProductLabels,
  getAdminProductLabel,
  createAdminProductLabel,
  updateAdminProductLabel,
  deleteAdminProductLabel,
  assignProductsToLabel,
} from "./adminProductLabels.js";

export * as storefrontLabels from "./storefrontLabels.js";
export {
  getStorefrontLabels,
  getStorefrontLabelBySlug,
  getStorefrontProductsByTag,
  normalizeStorefrontProduct,
} from "./storefrontLabels.js";

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

// Storefront Address CRUD API
export * as addressesApi from "./addresses.js";
export {
  calculateCourierLengths,
  validateAddress,
  getAddresses,
  createAddress,
  updateAddress,
  setAddressAsDefault,
  deleteAddress,
} from "./addresses.js";

// Admin Analytics & Customer Management API
export * as adminCustomerAnalytics from "./adminCustomerAnalytics.js";
export {
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
} from "./adminCustomerAnalytics.js";

// Staff Management & RBAC API
export * as adminStaff from "./adminStaff.js";
export {
  VALID_STAFF_ROLES,
  getStaffMembers,
  getStaffMemberById,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
  initiateStaffReset,
  verifyStaffReset,
  getStaffProfileMe,
  initiateOwnPasswordReset,
  verifyOwnPasswordReset,
} from "./adminStaff.js";

// Out of Stock (OOS) Queries API
export * as adminOos from "./adminOos.js";
export {
  OOS_INQUIRY_STATUSES,
  getOosInquiries,
  updateOosInquiryStatus,
  createStorefrontOosInquiry,
} from "./adminOos.js";

// Product Reviews & Moderation API
export * as adminReviews from "./adminReviews.js";
export {
  getAdminProductReviews,
  updateReviewStatus,
  lookupProductVariant,
  getGeneratedReviews,
  getGeneratedReviewById,
  createGeneratedReview,
  updateGeneratedReview,
  deleteGeneratedReview,
  getPublicProductReviews,
  getPublicProductReviewSummary,
  getMyProductReview,
  checkReviewEligibility,
  submitProductReview,
} from "./adminReviews.js";

export default {
  client: () => import("./client.js").then((m) => m.apiClient),
};

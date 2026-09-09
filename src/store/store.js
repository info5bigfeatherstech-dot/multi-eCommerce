import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import bannerReducer from "./slices/bannerSlice";
import offerReducer from "./slices/offerSlice";
import trustBadgeReducer from "./slices/trustBadgeSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import uiReducer from "./slices/uiSlice";
import adminAuthReducer from "./slices/adminAuthSlice";
import adminOrdersReducer from "./slices/adminOrdersSlice";
import adminReturnsReducer from "./slices/adminReturnsSlice";
import adminRtoReducer from "./slices/adminRtoSlice";
import adminProductsReducer from "./slices/adminProductsSlice";
import adminAnalyticsReducer from "./slices/adminAnalyticsSlice";
import adminArchivedReducer from "./slices/adminArchivedSlice";
import adminStockQueriesReducer from "./slices/adminStockQueriesSlice";
import adminLeadsReducer from "./slices/adminLeadsSlice";
import adminUtilitiesReducer from "./slices/adminUtilitiesSlice";
import adminWebsiteReducer from "./slices/adminWebsiteSlice";
import adminEcommerceReducer from "./slices/adminEcommerceSlice";
import adminMarketingReducer from "./slices/adminMarketingSlice";
import adminReviewsReducer from "./slices/adminReviewsSlice";
import adminStaffReducer from "./slices/adminStaffSlice";
import adminSupportReducer from "./slices/adminSupportSlice";

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    banners: bannerReducer,
    offers: offerReducer,
    trustBadges: trustBadgeReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
    adminAuth: adminAuthReducer,
    adminOrders: adminOrdersReducer,
    adminReturns: adminReturnsReducer,
    adminRto: adminRtoReducer,
    adminProducts: adminProductsReducer,
    adminAnalytics: adminAnalyticsReducer,
    adminArchived: adminArchivedReducer,
    adminStockQueries: adminStockQueriesReducer,
    adminLeads: adminLeadsReducer,
    adminUtilities: adminUtilitiesReducer,
    adminWebsite: adminWebsiteReducer,
    adminEcommerce: adminEcommerceReducer,
    adminMarketing: adminMarketingReducer,
    adminReviews: adminReviewsReducer,
    adminStaff: adminStaffReducer,
    adminSupport: adminSupportReducer,
  },
  devTools: typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production",
});

export default store;

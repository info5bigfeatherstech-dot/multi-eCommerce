import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./slices/categorySlice";
import bannerReducer from "./slices/bannerSlice";
import offerReducer from "./slices/offerSlice";
import trustBadgeReducer from "./slices/trustBadgeSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import uiReducer from "./slices/uiSlice";

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
  },
  devTools: typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production",
});

export default store;

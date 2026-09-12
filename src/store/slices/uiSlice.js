import { createSlice } from "@reduxjs/toolkit";

const savedUser = (() => {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("apexmart_user") : null;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCategorySidebarOpen: true,
    activeFlyoutCategoryId: "cat-home-living",
    activeCategoryNavId: null,
    searchQuery: "",
    isMobileDrawerOpen: false,
    isCartDrawerOpen: false,
    isAuthModalOpen: false,
    authModalTab: "login", // "login" | "register"
    authRedirectAfter: null, // target path upon successful auth (e.g. "/checkout")
    currentView: "home", // "home" | "product" | "wishlist" | "contact" | "inquiry"
    user: savedUser,
    isAuthenticated: Boolean(savedUser),
  },
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    toggleCategorySidebar: (state) => {
      state.isCategorySidebarOpen = !state.isCategorySidebarOpen;
    },
    setCategorySidebarOpen: (state, action) => {
      state.isCategorySidebarOpen = action.payload;
    },
    setActiveFlyoutCategoryId: (state, action) => {
      state.activeFlyoutCategoryId = action.payload;
    },
    setActiveCategoryNavId: (state, action) => {
      state.activeCategoryNavId = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    toggleMobileDrawer: (state) => {
      state.isMobileDrawerOpen = !state.isMobileDrawerOpen;
    },
    setMobileDrawerOpen: (state, action) => {
      state.isMobileDrawerOpen = action.payload;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    setCartDrawerOpen: (state, action) => {
      state.isCartDrawerOpen = action.payload;
    },
    openAuthModal: (state, action) => {
      state.isAuthModalOpen = true;
      if (typeof action.payload === "string") {
        state.authModalTab = action.payload;
        state.authRedirectAfter = null;
      } else if (action.payload && typeof action.payload === "object") {
        state.authModalTab = action.payload.tab || "login";
        state.authRedirectAfter = action.payload.redirectAfter || null;
      } else {
        state.authModalTab = "login";
        state.authRedirectAfter = null;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.authRedirectAfter = null;
    },
    setAuthModalTab: (state, action) => {
      state.authModalTab = action.payload;
    },
    loginSuccess: (state, action) => {
      const userData = action.payload?.user || action.payload;
      state.user = userData;
      state.isAuthenticated = true;
      try {
        localStorage.setItem("apexmart_user", JSON.stringify(userData));
        if (action.payload?.accessToken) {
          localStorage.setItem("apexmart_ecomm_access_token", action.payload.accessToken);
          localStorage.setItem("accessToken", action.payload.accessToken);
        }
        if (action.payload?.refreshToken) {
          localStorage.setItem("apexmart_ecomm_refresh_token", action.payload.refreshToken);
          localStorage.setItem("refreshToken", action.payload.refreshToken);
        }
      } catch {}
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem("apexmart_user");
        localStorage.removeItem("apexmart_ecomm_access_token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("apexmart_ecomm_refresh_token");
        localStorage.removeItem("refreshToken");
      } catch {}
    },
  },
});

export const {
  setCurrentView,
  toggleCategorySidebar,
  setCategorySidebarOpen,
  setActiveFlyoutCategoryId,
  setActiveCategoryNavId,
  setSearchQuery,
  toggleMobileDrawer,
  setMobileDrawerOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
  openAuthModal,
  closeAuthModal,
  setAuthModalTab,
  loginSuccess,
  logout,
} = uiSlice.actions;

export default uiSlice.reducer;

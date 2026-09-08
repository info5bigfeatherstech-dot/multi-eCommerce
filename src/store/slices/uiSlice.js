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
      state.authModalTab = action.payload ?? "login";
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalTab: (state, action) => {
      state.authModalTab = action.payload;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      try {
        localStorage.setItem("apexmart_user", JSON.stringify(action.payload));
      } catch {}
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem("apexmart_user");
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

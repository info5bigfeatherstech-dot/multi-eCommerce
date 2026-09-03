import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCategorySidebarOpen: true,
    activeFlyoutCategoryId: "cat-home-living",
    activeCategoryNavId: "just-arrived",
    searchQuery: "",
    isMobileDrawerOpen: false,
    isCartDrawerOpen: false,
  },
  reducers: {
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
  },
});

export const {
  toggleCategorySidebar,
  setCategorySidebarOpen,
  setActiveFlyoutCategoryId,
  setActiveCategoryNavId,
  setSearchQuery,
  toggleMobileDrawer,
  setMobileDrawerOpen,
  toggleCartDrawer,
  setCartDrawerOpen,
} = uiSlice.actions;

export default uiSlice.reducer;

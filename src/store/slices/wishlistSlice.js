import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    totalCount: 0,
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.some(
        (item) =>
          (item.slug && action.payload.slug && item.slug === action.payload.slug) ||
          (item.id && action.payload.id && item.id === action.payload.id)
      );
      if (!exists) {
        state.items.push(action.payload);
        state.totalCount = state.items.length;
      }
    },
    removeFromWishlist: (state, action) => {
      const target = action.payload;
      state.items = state.items.filter(
        (item) => item.id !== target && item.slug !== target
      );
      state.totalCount = state.items.length;
    },
    toggleWishlist: (state, action) => {
      const exists = state.items.some(
        (item) =>
          (item.slug && action.payload.slug && item.slug === action.payload.slug) ||
          (item.id && action.payload.id && item.id === action.payload.id)
      );
      if (exists) {
        state.items = state.items.filter(
          (item) =>
            !(
              (item.slug && action.payload.slug && item.slug === action.payload.slug) ||
              (item.id && action.payload.id && item.id === action.payload.id)
            )
        );
      } else {
        state.items.push(action.payload);
      }
      state.totalCount = state.items.length;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.totalCount = 0;
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

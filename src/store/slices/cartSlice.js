import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [
      {
        id: "p1",
        name: "Industrial Power Drill Kit",
        price: 999,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80",
      },
      {
        id: "p2",
        name: "Wireless Ergonomic Earbuds",
        price: 500,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
      },
    ],
    totalCount: 2,
    totalAmount: 1499,
  },
  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.totalCount += 1;
      state.totalAmount += action.payload.price;
    },
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          state.totalCount -= 1;
          state.totalAmount -= item.price;
        } else {
          const index = state.items.findIndex((i) => i.id === action.payload);
          state.totalCount -= 1;
          state.totalAmount -= item.price;
          state.items.splice(index, 1);
        }
      }
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex((i) => i.id === action.payload);
      if (index !== -1) {
        const item = state.items[index];
        state.totalCount -= item.quantity;
        state.totalAmount -= item.price * item.quantity;
        state.items.splice(index, 1);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addItem, decrementItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

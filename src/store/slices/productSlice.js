import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import productsData from "@/data/products.json";

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== "false";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    if (USE_MOCK) {
      return Promise.resolve(productsData);
    }
    const { data } = await api.get("/products");
    return data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: productsData, // Pre-populate for 0ms instant initial render
    status: "succeeded",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productSlice.reducer;

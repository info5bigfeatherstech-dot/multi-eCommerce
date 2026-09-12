import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/client";
import productsData from "@/data/products.json";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await apiClient.get("/products/all");
      const list = response.data?.products || response.data?.data || response.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((p) => {
          const firstVar = p.variants?.[0] || {};
          const price = p.minPrice || firstVar.price?.current || firstVar.price?.sale || firstVar.price?.base || p.price || 0;
          const origPrice = p.maxPrice || firstVar.price?.base || p.originalPrice || price;
          return {
            id: p._id,
            _id: p._id,
            productId: p._id,
            variantId: firstVar._id || firstVar.id,
            slug: p.slug,
            name: p.name || p.title || "Product",
            price,
            originalPrice: origPrice,
            discount: p.maxDiscountPercentage ? `${p.maxDiscountPercentage}% OFF` : (p.discount || ""),
            rating: p.rating?.value || p.rating || 4.8,
            reviewCount: p.rating?.count || p.reviewCount || 10,
            inStock: p.inStock !== false,
            imageUrl: firstVar.images?.[0] || p.images?.[0] || p.imageUrl || "",
            variants: p.variants || [],
            category: p.category?.name || p.category || "General",
          };
        });
      }
    } catch (e) {
      console.warn("Could not fetch live products from backend, using fallback:", e.message);
    }
    return productsData;
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

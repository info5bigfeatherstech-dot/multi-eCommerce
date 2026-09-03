import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import categoriesData from "@/data/categories.json";

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== "false";

// Async Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    if (USE_MOCK) {
      return Promise.resolve(categoriesData);
    }
    const { data } = await api.get("/categories");
    return data;
  }
);

// Admin Thunk Stubs
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryPayload) => {
    const { data } = await api.post("/categories", categoryPayload);
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, ...categoryPayload }) => {
    const { data } = await api.put(`/categories/${id}`, categoryPayload);
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    await api.delete(`/categories/${id}`);
    return id;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: categoriesData, // Pre-populate with categories for 0ms instant initial render
    status: "succeeded",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch categories";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default categorySlice.reducer;

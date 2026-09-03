import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import bannersData from "@/data/banners.json";

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== "false";

export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async () => {
    if (USE_MOCK) {
      return Promise.resolve(bannersData);
    }
    const { data } = await api.get("/banners");
    return data;
  }
);

// Admin Thunk Stubs
export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (bannerPayload) => {
    const { data } = await api.post("/banners", bannerPayload);
    return data;
  }
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async ({ id, ...bannerPayload }) => {
    const { data } = await api.put(`/banners/${id}`, bannerPayload);
    return data;
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id) => {
    await api.delete(`/banners/${id}`);
    return id;
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState: {
    items: bannersData, // Pre-populate for 0ms instant initial render
    status: "succeeded",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch hero banners";
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default bannerSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import trustBadgesData from "@/data/trustBadges.json";

const USE_MOCK = import.meta.env?.VITE_USE_MOCK !== "false";

export const fetchTrustBadges = createAsyncThunk(
  "trustBadges/fetchTrustBadges",
  async () => {
    if (USE_MOCK) {
      return Promise.resolve(trustBadgesData);
    }
    const { data } = await api.get("/trust-badges");
    return data;
  }
);

const trustBadgeSlice = createSlice({
  name: "trustBadges",
  initialState: {
    items: trustBadgesData, // Pre-populate for instant initial render
    status: "succeeded",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrustBadges.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTrustBadges.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTrustBadges.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch trust badges";
      });
  },
});

export default trustBadgeSlice.reducer;

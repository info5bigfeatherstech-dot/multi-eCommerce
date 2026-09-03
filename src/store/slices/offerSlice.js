import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import offersData from "@/data/offers.json";

const USE_MOCK = typeof process === "undefined" || !process.env || process.env.NEXT_PUBLIC_USE_MOCK !== "false";

export const fetchOffers = createAsyncThunk(
  "offers/fetchOffers",
  async () => {
    if (USE_MOCK) {
      return Promise.resolve(offersData);
    }
    const { data } = await api.get("/offers");
    return data;
  }
);

const offerSlice = createSlice({
  name: "offers",
  initialState: {
    items: offersData, // Pre-populate for instant initial render
    status: "succeeded",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch offers";
      });
  },
});

export default offerSlice.reducer;

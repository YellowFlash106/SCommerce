import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  stats: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "/admin/dashboard/stats",
  async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/dashboard/stats`,
      { withCredentials: true }
    );
    return res.data;
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload?.data || null;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.isLoading = false;
        state.stats = null;
      });
  },
});

export default adminDashboardSlice.reducer;

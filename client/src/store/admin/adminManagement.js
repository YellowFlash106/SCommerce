import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/admin/management`;
const opts = { withCredentials: true };

const initialState = {
  isLoading: false,
  users: [],
  sellers: [],
  pendingProducts: [],
  allOrders: [],
  sellerProducts: [],
  userOrders: [],
};

// ── Users ────────────────────────────────────────────────────────────────────
export const fetchAllUsers = createAsyncThunk(
  "/admin/management/fetchUsers",
  async () => {
    const res = await axios.get(`${API}/users`, opts);
    return res.data;
  }
);

export const deleteUserOrSeller = createAsyncThunk(
  "/admin/management/deleteUser",
  async (id) => {
    const res = await axios.delete(`${API}/users/${id}`, opts);
    return { ...res.data, id };
  }
);

// ── Sellers ──────────────────────────────────────────────────────────────────
export const fetchAllSellers = createAsyncThunk(
  "/admin/management/fetchSellers",
  async () => {
    const res = await axios.get(`${API}/sellers`, opts);
    return res.data;
  }
);

export const updateSellerStatus = createAsyncThunk(
  "/admin/management/updateSellerStatus",
  async ({ id, status }) => {
    const res = await axios.put(`${API}/sellers/${id}/status`, { status }, opts);
    return res.data;
  }
);

export const fetchProductsBySeller = createAsyncThunk(
  "/admin/management/sellerProducts",
  async (sellerId) => {
    const res = await axios.get(`${API}/sellers/${sellerId}/products`, opts);
    return res.data;
  }
);

// ── Product Approvals ─────────────────────────────────────────────────────────
export const fetchPendingProducts = createAsyncThunk(
  "/admin/management/pendingProducts",
  async () => {
    const res = await axios.get(`${API}/products/pending`, opts);
    return res.data;
  }
);

export const updateProductApproval = createAsyncThunk(
  "/admin/management/approveProduct",
  async ({ id, approvalStatus, adminNote }) => {
    const res = await axios.put(`${API}/products/${id}/approval`, { approvalStatus, adminNote }, opts);
    return res.data;
  }
);

export const adminDeleteProduct = createAsyncThunk(
  "/admin/management/deleteProduct",
  async (id) => {
    const res = await axios.delete(`${API}/products/${id}`, opts);
    return { ...res.data, id };
  }
);

// ── Orders ────────────────────────────────────────────────────────────────────
export const fetchAllOrdersWithUserInfo = createAsyncThunk(
  "/admin/management/allOrders",
  async () => {
    const res = await axios.get(`${API}/orders`, opts);
    return res.data;
  }
);

export const fetchOrdersByUser = createAsyncThunk(
  "/admin/management/ordersByUser",
  async (userId) => {
    const res = await axios.get(`${API}/orders/user/${userId}`, opts);
    return res.data;
  }
);

const adminManagementSlice = createSlice({
  name: "adminManagement",
  initialState,
  reducers: {
    clearSellerProducts: (state) => { state.sellerProducts = []; },
    clearUserOrders: (state) => { state.userOrders = []; },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchAllUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload?.data || [];
      })
      .addCase(fetchAllUsers.rejected, (state) => { state.isLoading = false; })

      .addCase(deleteUserOrSeller.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload.id);
        state.sellers = state.sellers.filter((s) => s._id !== action.payload.id);
      })

      // Sellers
      .addCase(fetchAllSellers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllSellers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellers = action.payload?.data || [];
      })
      .addCase(fetchAllSellers.rejected, (state) => { state.isLoading = false; })

      .addCase(updateSellerStatus.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          state.sellers = state.sellers.map((s) =>
            s._id === updated.id ? { ...s, ...updated } : s
          );
        }
      })

      .addCase(fetchProductsBySeller.fulfilled, (state, action) => {
        state.sellerProducts = action.payload?.data?.products || [];
      })

      // Products
      .addCase(fetchPendingProducts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchPendingProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingProducts = action.payload?.data || [];
      })
      .addCase(fetchPendingProducts.rejected, (state) => { state.isLoading = false; })

      .addCase(updateProductApproval.fulfilled, (state, action) => {
        const updated = action.payload?.data;
        if (updated) {
          state.pendingProducts = state.pendingProducts.filter((p) => p._id !== updated._id);
        }
      })

      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.pendingProducts = state.pendingProducts.filter((p) => p._id !== action.payload.id);
        state.sellerProducts = state.sellerProducts.filter((p) => p._id !== action.payload.id);
      })

      // Orders
      .addCase(fetchAllOrdersWithUserInfo.pending, (state) => { state.isLoading = true; })
      .addCase(fetchAllOrdersWithUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload?.data || [];
      })
      .addCase(fetchAllOrdersWithUserInfo.rejected, (state) => { state.isLoading = false; })

      .addCase(fetchOrdersByUser.fulfilled, (state, action) => {
        state.userOrders = action.payload?.data?.orders || [];
      });
  },
});

export const { clearSellerProducts, clearUserOrders } = adminManagementSlice.actions;
export default adminManagementSlice.reducer;

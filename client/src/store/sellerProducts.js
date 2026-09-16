import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

export const addSellerProduct = createAsyncThunk(
  "/seller/products/add",
  async (formData) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/seller/products/add`,
      formData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    return result?.data;
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "/seller/products/fetch",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/seller/products/get`,
      { withCredentials: true }
    );
    return result?.data;
  }
);

export const editSellerProduct = createAsyncThunk(
  "/seller/products/edit",
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/seller/products/edit/${id}`,
      formData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    return result?.data;
  }
);

export const deleteSellerProduct = createAsyncThunk(
  "/seller/products/delete",
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/seller/products/delete/${id}`,
      { withCredentials: true }
    );
    return result?.data;
  }
);

const sellerProductsSlice = createSlice({
  name: "sellerProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchSellerProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      });
  },
});

export default sellerProductsSlice.reducer;

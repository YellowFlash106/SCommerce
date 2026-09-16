import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import adminProductsSlice from "./admin/adminProducts";
import adminOrderSlice from "./admin/adminOrder";
import adminManagementSlice from "./admin/adminManagement";
import adminDashboardSlice from "./admin/adminDashboard";

import sellerProductsSlice from "./sellerProducts";

import shopProductsSlice from "./shop/productSlice";
import shopCartSlice from "./shop/cartSlice";
import shopAddressSlice from "./shop/addressSlice";
import shopOrderSlice from "./shop/orderSlice";
import shopSearchSlice from "./shop/searchSlice";
import shopReviewSlice from "./shop/reviewSlice";
import commonFeatureSlice from "./common";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminManagement: adminManagementSlice,
    adminDashboard: adminDashboardSlice,

    sellerProducts: sellerProductsSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;

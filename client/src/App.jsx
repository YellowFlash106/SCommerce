import { Route, Routes } from "react-router-dom";

// Auth
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";

// Admin
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminManageUsers from "./pages/admin-view/manage-users";
import AdminManageSellers from "./pages/admin-view/manage-sellers";
import AdminProductApprovals from "./pages/admin-view/product-approvals";
import AdminManageOrders from "./pages/admin-view/manage-orders";

// Seller
import SellerLayout from "./components/seller-view/layout";
import SellerDashboard from "./pages/seller-view/dashboard";
import SellerProducts from "./pages/seller-view/products";
import SellerAddProduct from "./pages/seller-view/add-product";

// Shop
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";

// Common
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import NotFound from "./pages/not-found";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth";
import { Skeleton } from "@/components/ui/skeleton";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} />
          }
        />

        {/* Auth */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          {/* Management */}
          <Route path="manage-users" element={<AdminManageUsers />} />
          <Route path="manage-sellers" element={<AdminManageSellers />} />
          <Route path="product-approvals" element={<AdminProductApprovals />} />
          <Route path="manage-orders" element={<AdminManageOrders />} />
        </Route>

        {/* Seller */}
        <Route
          path="/seller"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <SellerLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="add-product" element={<SellerAddProduct />} />
        </Route>

        {/* Shop */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* Misc */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const role = user?.role;
  const path = location.pathname;

  // ── Root redirect ────────────────────────────────────────────────────────────
  if (path === "/") {
    if (!isAuthenticated) return <Navigate to="/auth/login" />;
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "seller") return <Navigate to="/seller/dashboard" />;
    return <Navigate to="/shop/home" />;
  }

  // ── Not authenticated → send to login (except auth pages) ───────────────────
  if (
    !isAuthenticated &&
    !path.includes("/login") &&
    !path.includes("/register")
  ) {
    return <Navigate to="/auth/login" />;
  }

  // ── Authenticated on auth pages → redirect to home ──────────────────────────
  if (
    isAuthenticated &&
    (path.includes("/login") || path.includes("/register"))
  ) {
    if (role === "admin") return <Navigate to="/admin/dashboard" />;
    if (role === "seller") return <Navigate to="/seller/dashboard" />;
    return <Navigate to="/shop/home" />;
  }

  // ── Role guard: only admin can access /admin/* ───────────────────────────────
  if (isAuthenticated && role !== "admin" && path.includes("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  // ── Role guard: only seller can access /seller/* ─────────────────────────────
  if (isAuthenticated && role !== "seller" && path.includes("/seller")) {
    return <Navigate to="/unauth-page" />;
  }

  // ── Admin / seller cannot browse the shop ───────────────────────────────────
  if (isAuthenticated && role === "admin" && path.includes("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }
  if (isAuthenticated && role === "seller" && path.includes("/shop")) {
    return <Navigate to="/seller/dashboard" />;
  }

  // ── User cannot access admin or seller panels ────────────────────────────────
  if (isAuthenticated && role === "user" && path.includes("/seller")) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}

export default CheckAuth;

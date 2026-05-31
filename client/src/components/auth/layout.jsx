import { Outlet } from "react-router-dom";
import banner1 from "@/assets/banner-1.webp";

function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={banner1}
        alt="Featured collection"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-black/40 to-black/80" />
      <div className="absolute -left-24 -top-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;

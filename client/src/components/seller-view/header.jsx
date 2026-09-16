import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth";

function SellerHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 items-center justify-between ml-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {user?.storeName || user?.userName}
          </span>
          {user?.sellerStatus === "pending" && (
            <span className="text-xs text-yellow-600 font-medium">
              ⏳ Pending Approval
            </span>
          )}
          {user?.sellerStatus === "approved" && (
            <span className="text-xs text-green-600 font-medium">
              ✓ Approved Seller
            </span>
          )}
        </div>
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default SellerHeader;

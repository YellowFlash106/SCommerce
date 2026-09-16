import { LayoutDashboard, Package, PlusCircle, Store } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const sellerSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/seller/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "My Products",
    path: "/seller/products",
    icon: <Package />,
  },
  {
    id: "add-product",
    label: "Add Product",
    path: "/seller/add-product",
    icon: <PlusCircle />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {sellerSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function SellerSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <Store size={30} />
                <h1 className="text-2xl font-extrabold">Seller Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/seller/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <Store size={30} />
          <h1 className="text-2xl font-extrabold">Seller Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default SellerSideBar;

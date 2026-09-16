import {
  BadgeCheck,
  ChartNoAxesCombined,
  ClipboardCheck,
  LayoutDashboard,
  ShoppingBag,
  ShoppingBasket,
  Store,
  Users,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "divider-1",
    label: "── Management ──",
    path: null,
    icon: null,
    divider: true,
  },
  {
    id: "manage-orders",
    label: "All Orders",
    path: "/admin/manage-orders",
    icon: <ShoppingBag />,
  },
  {
    id: "manage-users",
    label: "Users",
    path: "/admin/manage-users",
    icon: <Users />,
  },
  {
    id: "manage-sellers",
    label: "Sellers",
    path: "/admin/manage-sellers",
    icon: <Store />,
  },
  {
    id: "product-approvals",
    label: "Product Approvals",
    path: "/admin/product-approvals",
    icon: <ClipboardCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        if (menuItem.divider) {
          return (
            <p
              key={menuItem.id}
              className="text-xs text-muted-foreground px-3 py-2 mt-2 uppercase tracking-wider"
            >
              Management
            </p>
          );
        }
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {menuItem.icon}
            <span className="text-base">{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;

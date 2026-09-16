import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "@/store/sellerProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, CheckCircle, XCircle, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function SellerDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { productList } = useSelector((state) => state.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.isApprovedSeller) dispatch(fetchSellerProducts());
  }, [dispatch, user]);

  const approved = productList.filter((p) => p.approvalStatus === "approved").length;
  const pending = productList.filter((p) => p.approvalStatus === "pending").length;
  const rejected = productList.filter((p) => p.approvalStatus === "rejected").length;

  const isPending = user?.sellerStatus === "pending";
  const isRejected = user?.sellerStatus === "rejected";

  return (
    <div className="space-y-6">
      {/* Account status banner */}
      {isPending && (
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-start gap-3">
          <Clock className="text-yellow-600 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-yellow-800">Account Pending Approval</p>
            <p className="text-sm text-yellow-700 mt-1">
              Your seller account is waiting for admin review. You won't be able to list
              products until you're approved. Check back soon!
            </p>
          </div>
        </div>
      )}
      {isRejected && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 flex items-start gap-3">
          <XCircle className="text-red-600 mt-0.5 shrink-0" size={20} />
          <div>
            <p className="font-semibold text-red-800">Account Rejected</p>
            <p className="text-sm text-red-700 mt-1">
              Your seller application was not approved. Please contact support for more information.
            </p>
          </div>
        </div>
      )}

      {/* Welcome card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Store size={28} className="text-primary" />
          <div>
            <CardTitle className="text-2xl">
              Welcome, {user?.storeName || user?.userName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {user?.email}
            </p>
          </div>
          <div className="ml-auto">
            <Badge
              className={
                user?.sellerStatus === "approved"
                  ? "bg-green-500"
                  : user?.sellerStatus === "rejected"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }
            >
              {user?.sellerStatus || "pending"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{productList.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All your listed products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle size={18} className="text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Live on the store</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock size={18} className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting admin approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      {user?.isApprovedSeller && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3 flex-wrap">
            <Button onClick={() => navigate("/seller/add-product")}>
              + Add New Product
            </Button>
            <Button variant="outline" onClick={() => navigate("/seller/products")}>
              View My Products
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent rejected note */}
      {rejected > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>{rejected} product(s)</strong> were rejected by admin. Go to{" "}
          <button
            className="underline font-medium"
            onClick={() => navigate("/seller/products")}
          >
            My Products
          </button>{" "}
          to see admin notes and resubmit.
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;

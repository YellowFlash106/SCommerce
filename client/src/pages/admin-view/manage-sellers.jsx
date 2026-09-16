import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSellers,
  deleteUserOrSeller,
  updateSellerStatus,
  fetchProductsBySeller,
  clearSellerProducts,
} from "@/store//admin/adminManagement";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Trash2, Eye, Store } from "lucide-react";

const statusColors = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  rejected: "bg-red-500",
};

function AdminManageSellers() {
  const dispatch = useDispatch();
  const { sellers, sellerProducts, isLoading } = useSelector(
    (state) => state.adminManagement
  );
  const { toast } = useToast();

  const [productsDialogOpen, setProductsDialogOpen] = useState(false);
  const [viewingSeller, setViewingSeller] = useState(null);

  useEffect(() => {
    dispatch(fetchAllSellers());
  }, [dispatch]);

  function handleApprove(id, name) {
    dispatch(updateSellerStatus({ id, status: "approved" })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `Seller "${name}" approved.` });
        dispatch(fetchAllSellers());
      } else {
        toast({ title: "Failed to update status", variant: "destructive" });
      }
    });
  }

  function handleReject(id, name) {
    dispatch(updateSellerStatus({ id, status: "rejected" })).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `Seller "${name}" rejected.` });
        dispatch(fetchAllSellers());
      } else {
        toast({ title: "Failed to update status", variant: "destructive" });
      }
    });
  }

  function handleDelete(id, name) {
    if (
      !window.confirm(
        `Delete seller "${name}"? All their products will also be deleted. This cannot be undone.`
      )
    )
      return;
    dispatch(deleteUserOrSeller(id)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `Seller "${name}" and their products deleted.` });
      } else {
        toast({ title: "Failed to delete seller", variant: "destructive" });
      }
    });
  }

  function handleViewProducts(seller) {
    setViewingSeller(seller);
    dispatch(fetchProductsBySeller(seller._id));
    setProductsDialogOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Store size={22} />
          <CardTitle>All Sellers</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {sellers.length} total
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground py-8 text-center">Loading...</p>
          ) : sellers.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No sellers registered yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store / Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellers.map((seller) => (
                  <TableRow key={seller._id}>
                    <TableCell>
                      <div className="font-medium">
                        {seller.storeName || seller.userName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{seller.userName}
                      </div>
                    </TableCell>
                    <TableCell>{seller.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          statusColors[seller.sellerStatus] || "bg-gray-400"
                        }`}
                      >
                        {seller.sellerStatus || "pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {seller.createdAt
                        ? new Date(seller.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProducts(seller)}
                        >
                          <Eye size={13} className="mr-1" />
                          Products
                        </Button>
                        {seller.sellerStatus !== "approved" && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleApprove(seller._id, seller.userName)
                            }
                          >
                            <CheckCircle size={13} className="mr-1" />
                            Approve
                          </Button>
                        )}
                        {seller.sellerStatus !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-400 text-red-600 hover:bg-red-50"
                            onClick={() =>
                              handleReject(seller._id, seller.userName)
                            }
                          >
                            <XCircle size={13} className="mr-1" />
                            Reject
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(seller._id, seller.userName)
                          }
                        >
                          <Trash2 size={13} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Seller products dialog */}
      <Dialog
        open={productsDialogOpen}
        onOpenChange={(open) => {
          setProductsDialogOpen(open);
          if (!open) {
            setViewingSeller(null);
            dispatch(clearSellerProducts());
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Products by{" "}
              {viewingSeller?.storeName || viewingSeller?.userName}
            </DialogTitle>
          </DialogHeader>
          {sellerProducts.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              No products listed by this seller.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerProducts.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>{p.totalStock}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          statusColors[p.approvalStatus] || "bg-gray-400"
                        }`}
                      >
                        {p.approvalStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminManageSellers;

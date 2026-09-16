import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingProducts,
  updateProductApproval,
  adminDeleteProduct,
} from "@/store/admin/adminManagement";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Trash2, ClipboardCheck } from "lucide-react";

function AdminProductApprovals() {
  const dispatch = useDispatch();
  const { pendingProducts, isLoading } = useSelector(
    (state) => state.adminManagement
  );
  const { toast } = useToast();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingProduct, setRejectingProduct] = useState(null);
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    dispatch(fetchPendingProducts());
  }, [dispatch]);

  function handleApprove(product) {
    dispatch(
      updateProductApproval({ id: product._id, approvalStatus: "approved" })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `"${product.title}" approved and now live.` });
      } else {
        toast({ title: "Failed to approve", variant: "destructive" });
      }
    });
  }

  function openRejectDialog(product) {
    setRejectingProduct(product);
    setAdminNote("");
    setRejectDialogOpen(true);
  }

  function handleRejectConfirm() {
    dispatch(
      updateProductApproval({
        id: rejectingProduct._id,
        approvalStatus: "rejected",
        adminNote,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `"${rejectingProduct.title}" rejected.` });
        setRejectDialogOpen(false);
        setRejectingProduct(null);
      } else {
        toast({ title: "Failed to reject", variant: "destructive" });
      }
    });
  }

  function handleDelete(product) {
    if (
      !window.confirm(`Permanently delete "${product.title}"? Cannot be undone.`)
    )
      return;
    dispatch(adminDeleteProduct(product._id)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `"${product.title}" deleted.` });
      } else {
        toast({ title: "Failed to delete", variant: "destructive" });
      }
    });
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <ClipboardCheck size={22} />
          <CardTitle>Product Approvals</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {pendingProducts.length} pending
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground py-8 text-center">Loading...</p>
          ) : pendingProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <CheckCircle size={40} className="mx-auto mb-3 text-green-400" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm">No products waiting for approval.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingProducts.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-lg overflow-hidden flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-44 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      Pending
                    </Badge>
                  </div>
                  <div className="p-3 flex flex-col flex-1 gap-1">
                    <h3 className="font-semibold text-base leading-tight">
                      {product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex gap-2 text-sm mt-1">
                      <span className="font-medium">${product.price}</span>
                      {product.salePrice > 0 && (
                        <span className="text-muted-foreground line-through">
                          ${product.salePrice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Seller:{" "}
                      <span className="font-medium">
                        {product.sellerName ||
                          product.sellerId?.userName ||
                          "—"}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Category: {product.category} · Brand: {product.brand}
                    </p>
                    <div className="flex gap-2 mt-auto pt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(product)}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-400 text-red-600 hover:bg-red-50"
                        onClick={() => openRejectDialog(product)}
                      >
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject with note dialog */}
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={(open) => {
          setRejectDialogOpen(open);
          if (!open) setRejectingProduct(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Rejecting:{" "}
            <span className="font-medium">{rejectingProduct?.title}</span>
          </p>
          <div className="grid gap-2">
            <Label htmlFor="admin-note">
              Reason / Note for seller{" "}
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              id="admin-note"
              placeholder="e.g. Images are too low quality, please re-upload"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminProductApprovals;

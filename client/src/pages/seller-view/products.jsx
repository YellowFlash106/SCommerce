import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerProducts,
  deleteSellerProduct,
  editSellerProduct,
} from "@/store/sellerProducts";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { addProductFormElements } from "@/config";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

const statusColors = {
  approved: "bg-green-500",
  pending: "bg-yellow-500",
  rejected: "bg-red-500",
};

function SellerProducts() {
  const dispatch = useDispatch();
  const { productList, isLoading } = useSelector((state) => state.sellerProducts);
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  function handleEditOpen(product) {
    setEditingId(product._id);
    setFormData({
      image: product.image,
      title: product.title,
      description: product.description,
      category: product.category,
      brand: product.brand,
      price: product.price,
      salePrice: product.salePrice,
      totalStock: product.totalStock,
    });
    setUploadedImageUrl(product.image || "");
    setEditDialogOpen(true);
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    dispatch(
      editSellerProduct({
        id: editingId,
        formData: { ...formData, image: uploadedImageUrl || formData.image },
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Product updated. Pending re-approval." });
        dispatch(fetchSellerProducts());
        setEditDialogOpen(false);
        setFormData(initialFormData);
      } else {
        toast({ title: "Failed to update product", variant: "destructive" });
      }
    });
  }

  function handleDelete(id) {
    dispatch(deleteSellerProduct(id)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: "Product deleted" });
        dispatch(fetchSellerProducts());
      } else {
        toast({ title: "Failed to delete product", variant: "destructive" });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((k) => k !== "salePrice")
      .every((k) => formData[k] !== "" && formData[k] !== null);
  }

  if (!user?.isApprovedSeller) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          Your seller account is{" "}
          <span className="capitalize text-yellow-600">{user?.sellerStatus || "pending"}</span>.
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
          You can only list products after your account is approved by an admin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">My Products</h2>
        <span className="text-sm text-muted-foreground">{productList.length} total</span>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : productList.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-2 text-center text-muted-foreground">
          <p className="text-lg">No products yet.</p>
          <p className="text-sm">Go to "Add Product" to submit your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {productList.map((product) => (
            <Card key={product._id} className="w-full max-w-sm mx-auto">
              <div>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-[220px] object-cover rounded-t-lg"
                  />
                  <Badge
                    className={`absolute top-2 right-2 capitalize ${
                      statusColors[product.approvalStatus] || "bg-gray-400"
                    }`}
                  >
                    {product.approvalStatus}
                  </Badge>
                </div>
                <CardContent className="pt-3">
                  <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                  <div className="flex gap-2 items-center mb-1">
                    <span
                      className={`text-base font-semibold ${
                        product.salePrice > 0 ? "line-through text-muted-foreground" : "text-primary"
                      }`}
                    >
                      ${product.price}
                    </span>
                    {product.salePrice > 0 && (
                      <span className="text-base font-bold text-primary">
                        ${product.salePrice}
                      </span>
                    )}
                  </div>
                  {product.approvalStatus === "rejected" && product.adminNote && (
                    <p className="text-xs text-red-600 bg-red-50 rounded p-2 mt-2">
                      <strong>Admin note:</strong> {product.adminNote}
                    </p>
                  )}
                  {product.approvalStatus === "pending" && (
                    <p className="text-xs text-yellow-700 bg-yellow-50 rounded p-2 mt-2">
                      Waiting for admin approval
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleEditOpen(product)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(product._id)}>
                    Delete
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setFormData(initialFormData);
            setEditingId(null);
          }
        }}
      >
        <DialogContent className="max-w-md overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-yellow-700 bg-yellow-50 rounded p-2">
            Editing will re-submit this product for admin approval.
          </p>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={false}
            uploadEndpoint="/api/seller/products/upload-image"
          />
          <CommonForm
            formControls={addProductFormElements}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleEditSubmit}
            buttonText="Save & Resubmit"
            isBtnDisabled={!isFormValid()}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SellerProducts;

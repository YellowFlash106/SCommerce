import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSellerProduct } from "@/store/sellerProducts";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommonForm from "@/components/common/form";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { addProductFormElements } from "@/config";
import { Clock } from "lucide-react";

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

function SellerAddProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  function isFormValid() {
    return (
      uploadedImageUrl !== "" &&
      Object.keys(formData)
        .filter((k) => k !== "salePrice" && k !== "image")
        .every((k) => formData[k] !== "" && formData[k] !== null)
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    dispatch(
      addSellerProduct({ ...formData, image: uploadedImageUrl })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Product submitted for approval!",
          description: "The admin will review it before it goes live.",
        });
        setFormData(initialFormData);
        setImageFile(null);
        setUploadedImageUrl("");
        navigate("/seller/products");
      } else {
        toast({
          title: "Failed to submit product",
          variant: "destructive",
        });
      }
    });
  }

  if (!user?.isApprovedSeller) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Clock size={48} className="text-yellow-500" />
        <p className="text-xl font-semibold">Account Not Yet Approved</p>
        <p className="text-sm text-muted-foreground max-w-md">
          You can submit products for listing only after an admin approves your
          seller account. Your application is currently{" "}
          <span className="font-medium capitalize text-yellow-600">
            {user?.sellerStatus || "pending"}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your product will be reviewed by an admin before it appears on the store.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4 text-sm text-yellow-700 bg-yellow-50 rounded p-3">
            <Clock size={16} />
            Products are pending approval until an admin reviews them.
          </div>
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
          <div className="mt-6">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText="Submit for Approval"
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerAddProduct;

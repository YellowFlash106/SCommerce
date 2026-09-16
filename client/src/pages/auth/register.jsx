import { useToast } from "@/components/ui/use-toast";
import { registerUser } from "@/store/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AuthRegister() {
  const [selectedRole, setSelectedRole] = useState("user");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    storeName: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function isFormValid() {
    const base =
      formData.userName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.trim() !== "";
    if (selectedRole === "seller") return base && formData.storeName.trim() !== "";
    return base;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const payload = {
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        ...(selectedRole === "seller" && { storeName: formData.storeName }),
      };

      const result = await dispatch(registerUser(payload));
      if (result.error) throw new Error(result.error.message || "Registration failed");

      if (result.payload?.success) {
        toast({
          title: result.payload.message || "Registration successful!",
          description:
            selectedRole === "seller"
              ? "Your seller account is under review. Log in once approved."
              : "Please log in to continue.",
        });
        navigate("/auth/login");
      } else {
        throw new Error(
          result.payload?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="space-y-6 px-6 py-10 sm:px-8">
          {/* Header */}
          <div className="space-y-3 text-center text-white">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-white/90 text-black flex items-center justify-center text-lg font-semibold">
              KK
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-sm text-white/70">
              Already have an account?
              <Link
                className="font-semibold ml-2 text-white hover:underline"
                to="/auth/login"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("user")}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                selectedRole === "user"
                  ? "bg-white text-black border-white"
                  : "border-white/30 text-white/80 hover:border-white/60"
              }`}
            >
              🛒 I'm a Buyer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("seller")}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                selectedRole === "seller"
                  ? "bg-white text-black border-white"
                  : "border-white/30 text-white/80 hover:border-white/60"
              }`}
            >
              🏪 I'm a Seller
            </button>
          </div>

          {selectedRole === "seller" && (
            <div className="text-xs text-yellow-300 bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-2">
              ⏳ Seller accounts require admin approval before you can list products.
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="grid gap-1.5">
              <Label className="text-white/80">Username</Label>
              <Input
                name="userName"
                type="text"
                placeholder="Enter your username"
                value={formData.userName}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-white/80">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid gap-1.5">
              <Label className="text-white/80">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>

            {selectedRole === "seller" && (
              <div className="grid gap-1.5">
                <Label className="text-white/80">Store Name</Label>
                <Input
                  name="storeName"
                  type="text"
                  placeholder="Your store's display name"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={!isFormValid()}
              className="mt-1 w-full"
            >
              {selectedRole === "seller" ? "Apply as Seller" : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-xs text-white/70">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;

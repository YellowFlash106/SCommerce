import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const result = await dispatch(registerUser(formData));
      
      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }
      
      if (result.payload?.success) {
        toast({
          title: result.payload.message || 'Registration successful!',
          description: 'Please log in to continue.',
        });
        navigate("/auth/login");
      } else {
        throw new Error(result.payload?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="space-y-6 px-6 py-10 sm:px-8">
          <div className="space-y-3 text-center text-white">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-white/90 text-black flex items-center justify-center text-lg font-semibold">
              KK
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-display">
              Create account
            </h1>
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
          <CommonForm
            formControls={registerFormControls}
            buttonText={"Sign Up"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
          <p className="text-center text-xs text-white/70">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthRegister;

import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
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
              Sign in
            </h1>
            <p className="text-sm text-white/70">
              New here?
              <Link
                className="font-semibold ml-2 text-white hover:underline"
                to="/auth/register"
              >
                Create an account
              </Link>
            </p>
          </div>
          <CommonForm
            formControls={loginFormControls}
            buttonText={"Sign In"}
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

export default AuthLogin;

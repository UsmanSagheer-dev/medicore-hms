"use client";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { loginUser, clearError } from "@/redux/slices/authSlice";

import Button from "@/components/ui/Button";

function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, isAuthenticated, user } = useAppSelector(
    (state) => state.auth,
  );
  const hasRedirected = useRef(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const resolveRoleRoute = (authUser: any) => {
    const role = authUser.role;

    if (role === "doctor") {
      const doctorId = authUser.doctor?.id;
      const status = String(authUser.doctorOnboarding?.status || "").toLowerCase();

      if (doctorId || status === "approved") {
        return doctorId
          ? `/dashboard/doctor/${doctorId}`
          : "/onboarding/doctor/pending";
      }

      if (status) {
        return "/onboarding/doctor/pending";
      }

      return "/onboarding/doctor";
    }

    if (role === "receptionist") {
      const receptionistId =
        authUser.receptionist?.id;
      const status = String(
        authUser.receptionistOnboarding?.status || "".toLowerCase(),
      );

      if (receptionistId || status === "approved") {
        return "/dashboard/receptionist";
      }

      if (status) {
        return "/onboarding/receptionist/pending";
      }

      return "/onboarding/reception";
    }

    if (role === "PHARMACY") {
      const pharmacyId = authUser.pharmacy?.id;
      const status = String(authUser.pharmacyOnboarding?.status || "").toLowerCase();

      if (pharmacyId || status === "approved") {
        return "/dashboard/pharmacy";
      }

      if (status) {
        return "/onboarding/pharmacy/pending";
      }

      return "/onboarding/pharmacy";
    }

    if (role === "ADMIN") {
      return "/dashboard/admin";
    }

    return "/auth/login";
  };

  // Handle redirect after successful login
  useEffect(() => {
    if (hasRedirected.current) return;

    if (isAuthenticated && user) {
      hasRedirected.current = true;

      const redirect = async () => {
        // Wait longer for cookies to be set and visible
        await new Promise((resolve) => setTimeout(resolve, 500));

        const targetRoute = resolveRoleRoute(user);

        if (targetRoute === "/dashboard/admin") {
          toast.success(`Welcome back, ${user.name}`);
          // Force full page reload for admin to ensure cookies are sent
          setTimeout(() => {
            window.location.href = targetRoute;
          }, 500);
          return;
        }

        if (targetRoute !== "/auth/login") {
          router.push(targetRoute);
        } else {
          dispatch(clearError());
          router.push("/auth/login");
        }
      };

      redirect();
    }
  }, [isAuthenticated, user, router, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(clearError());
    };
  }, [error, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };
  
  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 py-5">
          Welcome Back
        </h1>
        <p className="text-white/70">Please enter your details to sign in</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90 ml-1">
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            icon={<Mail className="w-5 h-5 text-white/40" />}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white/90 ml-1">
              Password
            </label>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            icon={<Lock className="w-5 h-5 text-white/40" />}
            suffixIcon={
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />

          <div className="flex justify-end">
            <Link
              href="/auth/forgetPassword"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-1">
          <input
            type="checkbox"
            id="remember"
            className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
          />
          <label htmlFor="remember" className="text-sm text-white/70">
            Remember me for 30 days
          </label>
        </div>

        <Button
          type="submit"
          isLoading={loading}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-white font-semibold hover:underline decoration-blue-500 underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
import Input from "@/components/ui/Input";

function Login() {
  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 py-5">
          Welcome Back
        </h1>
        <p className="text-white/70">Please enter your details to sign in</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90 ml-1">
            Email Address
          </label>
          <Input
            type="email"
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
            type="password"
            placeholder="••••••••"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/40 h-12 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            icon={<Lock className="w-5 h-5 text-white/40" />}
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

        <Link href="/auth/forgetPassword" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
          <LogIn className="w-5 h-5" />
          Sign In
        </Link>
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

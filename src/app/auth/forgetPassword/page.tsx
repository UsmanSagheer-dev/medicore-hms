"use client";

import Input from "@/components/ui/Input";
import {  Mail } from "lucide-react";
import Link from "next/link";

function ForgetPassword() {
  return (
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2 py-5">
          Forget Password
        </h1>
        <p className="text-white/70">
          Please enter your email address to reset your password
        </p>
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

        <div className=" flex gap-2 w-full">
          <Link
            href="/auth/login"
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Send Reset Link
          </Link>
          <Link
            href="/auth/login"
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ForgetPassword;

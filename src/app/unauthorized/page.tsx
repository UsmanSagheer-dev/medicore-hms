"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

/**
 * Professional Unauthorized Page
 * This page is shown when a user tries to access a route they don't have permission for.
 * Features: Glassmorphism design, Lucide icons, and Geist font integration.
 */
const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-(family-name:--font-geist-sans)">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-100/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-10 md:p-14 rounded-5xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] text-center transition-all">
          
          {/* Animated Icon Section */}
          <div className="mb-10 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-200 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse" />
              <div className="relative bg-white p-8 rounded-4xl shadow-xl border border-red-50 ring-4 ring-red-50/50">
                <ShieldAlert className="w-20 h-20 text-red-500" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-4 mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Access Restricted
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-md mx-auto font-medium">
              Oops! Aapke pas is page ko access karne ki permission nahi hai. 
              <span className="block mt-2 text-slate-400 text-base italic">Agar aapko lagta hai ke yeh ek galti hai, toh please administrator se contact karein.</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 transition-all duration-300 hover:shadow-lg active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              Peeche Jao
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.5)] active:scale-95"
            >
              <Home className="w-5 h-5" />
              Home Page
            </button>
          </div>

          {/* Footer Branding */}
          <div className="mt-16 pt-10 border-t border-slate-100/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-slate-800 font-bold tracking-wider text-sm">MEDICORE HMS</span>
            </div>
            <p className="text-slate-400 text-xs font-medium">
              &copy; {new Date().getFullYear()} Security System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
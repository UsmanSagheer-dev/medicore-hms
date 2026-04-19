"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    // Small delay to ensure auth state is initialized
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        // Not logged in - redirect to login
        router.push("/auth/login");
      } else if (user) {
        // Logged in - redirect based on role
        const role = user.role?.toLowerCase();
        
        if (role === "doctor") {
          router.push(`/dashboard/doctor/${user.id || user._id}`);
        } else if (role === "admin") {
          router.push("/dashboard/admin");
        } else if (role === "receptionist") {
          router.push("/dashboard/receptionist");
        } else {
          // Unknown role - redirect to login
          router.push("/auth/login");
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  // Show loading while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}

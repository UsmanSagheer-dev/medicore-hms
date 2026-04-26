"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  const resolveRoleRoute = (authUser: any) => {
    const role = authUser.role?.toLowerCase();

    if (role === "doctor") {
      const doctorId = authUser.doctor?.id || authUser.doctorId;
      const status = String(authUser.doctorOnboarding?.status || "").toLowerCase();

      if (doctorId || status === "approved") {
        return doctorId
          ? `/dashboard/doctor/${doctorId}`
          : "/onboarding/doctor/pending";
      }

      if (status) return "/onboarding/doctor/pending";
      return "/onboarding/doctor";
    }

    if (role === "receptionist") {
      const receptionistId =
        authUser.receptionist?.id || authUser.receptionistId;
      const status = String(
        authUser.receptionistOnboarding?.status || "",
      ).toLowerCase();

      if (receptionistId || status === "approved") {
        return "/dashboard/receptionist";
      }

      if (status) return "/onboarding/receptionist/pending";
      return "/onboarding/reception";
    }

    if (role === "pharmacy") {
      const pharmacyId = authUser.pharmacy?.id || authUser.pharmacyId;
      const status = String(authUser.pharmacyOnboarding?.status || "").toLowerCase();

      if (pharmacyId || status === "approved" || status === "active") {
        return "/dashboard/pharmacy";
      }

      if (status) return "/onboarding/pharmacy/pending";
      return "/onboarding/pharmacy";
    }

    if (role === "admin") {
      return "/dashboard/admin";
    }

    return "/auth/login";
  };

  useEffect(() => {
    // Small delay to ensure auth state is initialized
    const timer = setTimeout(async () => {
      if (!isAuthenticated) {
        // Not logged in - redirect to login
        router.push("/auth/login");
      } else if (user) {
        router.push(resolveRoleRoute(user));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  // Show loading while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <div className="text-gray-600 dark:text-gray-400 animate-spin"></div>
      </div>
    </div>
  );
}

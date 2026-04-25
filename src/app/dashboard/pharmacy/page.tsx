"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Phone,
  MapPin,
  BadgeCheck,
  CalendarClock,
  FileText,
  User,
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getPharmacyByUserId } from "@/redux/slices/pharmacySlice";

export default function PharmacyDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.pharmacy);

  useEffect(() => {
    const verifyApprovedProfile = async () => {
      if (!user?.id) return;

      try {
        await dispatch(getPharmacyByUserId(user.id)).unwrap();
      } catch {
        router.replace("/onboarding/pharmacy/pending");
      }
    };

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "PHARMACY") {
      router.push("/unauthorized");
      return;
    }

    verifyApprovedProfile();
  }, [dispatch, isAuthenticated, router, user]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Profile Status",
        value: profile?.isApproved ? "Approved" : "Active",
        icon: BadgeCheck,
        tone: "text-emerald-700 bg-emerald-50 border-emerald-100",
      },
      {
        label: "License Number",
        value: profile?.license_number || "N/A",
        icon: FileText,
        tone: "text-blue-700 bg-blue-50 border-blue-100",
      },
      {
        label: "Pharmacy City",
        value: profile?.pharmacy_city || "N/A",
        icon: MapPin,
        tone: "text-indigo-700 bg-indigo-50 border-indigo-100",
      },
      {
        label: "Experience",
        value: profile?.years_of_experience
          ? `${profile.years_of_experience} years`
          : "N/A",
        icon: CalendarClock,
        tone: "text-amber-700 bg-amber-50 border-amber-100",
      },
    ],
    [profile],
  );

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-3xl font-black text-gray-900">Pharmacy Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back. Manage your pharmacy profile and operational details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className={`rounded-2xl border p-5 ${card.tone} shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  {card.label}
                </p>
                <card.icon className="w-5 h-5" />
              </div>
              <p className="text-lg font-extrabold wrap-break-word">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Pharmacy Information
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Name:</span>{" "}
                {profile?.pharmacy_name || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Address:</span>{" "}
                {profile?.pharmacy_address || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Registration Authority:</span>{" "}
                {profile?.registration_authority || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Issue Date:</span>{" "}
                {profile?.registration_issue_date
                  ? new Date(profile.registration_issue_date).toLocaleDateString()
                  : "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Expiry Date:</span>{" "}
                {profile?.registration_expiry_date
                  ? new Date(profile.registration_expiry_date).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Professional Contact
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Full Name:</span>{" "}
                {profile?.full_name || user?.name || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                {profile?.email || user?.email || "Not available"}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                {profile?.phone || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">CNIC:</span>{" "}
                {profile?.cnic_number || "Not available"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Qualifications:</span>{" "}
                {profile?.qualifications || "Not available"}
              </p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-500">
            Loading pharmacy profile...
          </div>
        )}
      </div>
    </div>
  );
}

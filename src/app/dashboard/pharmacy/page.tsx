"use client";

import { useEffect, useState } from "react";
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
import MedicineList from "@/components/features/pharmacy/MedicineList";
import MedicineForm from "@/components/features/pharmacy/MedicineForm";
import PharmacyDashboardStats from "@/components/features/pharmacy/PharmacyDashboardStats";
import StockAlerts from "@/components/features/pharmacy/StockAlerts";
import SalesReport from "@/components/features/pharmacy/SalesReport";
import MedicineSalesStats from "@/components/features/pharmacy/MedicineSalesStats";
import DispensePrescription from "@/components/features/pharmacy/DispensePrescription";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getPharmacyByUserId,
  getPharmacyOnboardingByUserId,
  resolvePharmacyOnboardingRoute,
} from "@/redux/slices/pharmacySlice";

export default function PharmacyDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.pharmacy);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [editingMedicineId, setEditingMedicineId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<
    "overview" | "medicines" | "dispense" | "reports"
  >("overview");

  useEffect(() => {
    const verifyApprovedProfile = async () => {
      if (!user?.id) return;

      const verifyOnboardingState = async () => {
        const payload = await dispatch(
          getPharmacyOnboardingByUserId(user.id),
        ).unwrap();
        const nextRoute = resolvePharmacyOnboardingRoute(payload);

        if (nextRoute === "pending") {
          router.replace("/onboarding/pharmacy/pending");
          return;
        }

        if (nextRoute === "onboarding") {
          router.replace("/onboarding/pharmacy");
        }
      };

      try {
        await dispatch(getPharmacyByUserId(user.id)).unwrap();
      } catch {
        try {
          await verifyOnboardingState();
        } catch {
          router.replace("/onboarding/pharmacy");
        }
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

  const summaryCards = [
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
  ];

  const handleEditMedicine = (medicineId: string) => {
    setEditingMedicineId(medicineId);
    setShowMedicineForm(true);
  };

  const handleCloseMedicineForm = () => {
    setShowMedicineForm(false);
    setEditingMedicineId(undefined);
  };

  const handleMedicineFormSuccess = () => {
    setEditingMedicineId(undefined);
  };

  const tabButtons = [
    { id: "overview", label: "Overview" },
    { id: "medicines", label: "Medicines" },
    { id: "dispense", label: "Dispense" },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h1 className="text-3xl font-black text-gray-900">Pharmacy Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back. Manage your pharmacy profile, inventory, and operations.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveTab(btn.id as any)}
                className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === btn.id
                    ? "text-teal-600 border-teal-600"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <PharmacyDashboardStats />

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

            {/* Stock Alerts on Overview */}
            <StockAlerts />
          </div>
        )}

        {/* Medicines Tab */}
        {activeTab === "medicines" && (
          <div>
            <MedicineList
              onAddMedicine={() => {
                setEditingMedicineId(undefined);
                setShowMedicineForm(true);
              }}
              onEditMedicine={handleEditMedicine}
            />
          </div>
        )}

        {/* Dispense Tab */}
        {activeTab === "dispense" && (
          <div>
            <DispensePrescription />
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-5">
            <SalesReport />
            <MedicineSalesStats />
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-sm text-gray-500">
            Loading pharmacy profile...
          </div>
        )}
      </div>

      {/* Medicine Form Modal */}
      <MedicineForm
        isOpen={showMedicineForm}
        medicineId={editingMedicineId}
        onClose={handleCloseMedicineForm}
        onSuccess={handleMedicineFormSuccess}
      />
    </div>
  );
}

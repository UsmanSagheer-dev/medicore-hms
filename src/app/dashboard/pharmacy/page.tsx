"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
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

  // sync active tab from `?tab=` query param (works when clicking sidebar links)
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (
      tab &&
      ["overview", "medicines", "dispense", "reports"].includes(tab)
    ) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);


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

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-5 space-y-5">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <PharmacyDashboardStats />


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

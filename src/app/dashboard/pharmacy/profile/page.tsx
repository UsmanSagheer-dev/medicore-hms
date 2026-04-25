"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, FileText, Building2, MapPin, Phone } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getPharmacyByUserId } from "@/redux/slices/pharmacySlice";

const ProfileRow = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-gray-100 rounded-xl p-3 bg-gray-50/40">
    <p className="text-[11px] uppercase tracking-widest font-bold text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-1 break-words">{value || "Not provided"}</p>
  </div>
);

export default function PharmacyProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile, loading } = useAppSelector((state) => state.pharmacy);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "PHARMACY") {
      router.push("/unauthorized");
      return;
    }

    if (user?.id) {
      dispatch(getPharmacyByUserId(user.id));
    }
  }, [dispatch, isAuthenticated, router, user]);

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-black text-gray-900">Pharmacy Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete profile details visible after onboarding approval.
          </p>

          {loading ? (
            <p className="text-sm text-gray-500 mt-6">Loading profile...</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="space-y-3">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Personal
                </h2>
                <ProfileRow label="Full Name" value={profile?.full_name || ""} />
                <ProfileRow label="Email" value={profile?.email || user?.email || ""} />
                <ProfileRow label="Phone" value={profile?.phone || ""} />
                <ProfileRow label="Gender" value={profile?.gender || ""} />
                <ProfileRow label="CNIC" value={profile?.cnic_number || ""} />
              </section>

              <section className="space-y-3">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" /> Credentials
                </h2>
                <ProfileRow label="License Number" value={profile?.license_number || ""} />
                <ProfileRow
                  label="Registration Authority"
                  value={profile?.registration_authority || ""}
                />
                <ProfileRow
                  label="Issue Date"
                  value={profile?.registration_issue_date || ""}
                />
                <ProfileRow
                  label="Expiry Date"
                  value={profile?.registration_expiry_date || ""}
                />
                <ProfileRow
                  label="Qualifications"
                  value={profile?.qualifications || ""}
                />
              </section>

              <section className="space-y-3 lg:col-span-2">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" /> Pharmacy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ProfileRow label="Pharmacy Name" value={profile?.pharmacy_name || ""} />
                  <ProfileRow label="City" value={profile?.pharmacy_city || ""} />
                  <ProfileRow
                    label="Pharmacy Address"
                    value={profile?.pharmacy_address || ""}
                  />
                  <ProfileRow
                    label="Experience"
                    value={profile?.years_of_experience ? `${profile.years_of_experience} years` : ""}
                  />
                </div>
              </section>

              <section className="space-y-3 lg:col-span-2">
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" /> Status
                </h2>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-emerald-700">
                    Account Status: {profile?.isApproved ? "Approved" : "Active"}
                  </p>
                  <Phone className="w-4 h-4 text-emerald-700" />
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

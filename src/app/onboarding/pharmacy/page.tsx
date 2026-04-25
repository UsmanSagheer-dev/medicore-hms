"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  FileText,
  Building2,
  Calendar,
  BadgeCheck,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePharmacyOnboarding } from "@/hooks/usePharmacyOnboarding";
import { resetPharmacyState } from "@/redux/slices/pharmacySlice";
import toast from "react-hot-toast";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Registration", icon: BadgeCheck },
  { id: 3, title: "Professional", icon: Briefcase },
  { id: 4, title: "Pharmacy Details", icon: Building2 },
];

export default function PharmacyOnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const formSubmittedRef = useRef(false);

  const { step, loading, success, error, formData, handleChange, handleNext, handleBack } =
    usePharmacyOnboarding();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "PHARMACY") {
      toast.error("Access denied. Only pharmacy staff can access this page.");
      router.push("/unauthorized");
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    dispatch(resetPharmacyState());
  }, [dispatch]);

  useEffect(() => {
    if (formSubmittedRef.current && success) {
      toast.success(
        "Pharmacy onboarding submitted successfully! Please wait for admin approval.",
      );
      router.push("/onboarding/pharmacy/pending");
      dispatch(resetPharmacyState());
      formSubmittedRef.current = false;
    }

    if (error) {
      const errorMsg =
        typeof error === "string"
          ? error
          : (error as any)?.message || "An error occurred";
      toast.error(errorMsg);
    }
  }, [success, error, router, dispatch]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 bg-black/20 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-teal-600/10 z-0"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Pharmacy Onboarding
            </h1>
            <p className="text-white/60 mb-10">
              Complete your pharmacy profile to continue.
            </p>

            <div className="space-y-6">
              {steps.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-4 transition-all duration-300 ${isActive ? "translate-x-2" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive
                          ? "bg-teal-500 border-teal-500 text-white shadow-lg shadow-teal-500/30"
                          : isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-white/20 text-white/40"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${isActive || isCompleted ? "text-white" : "text-white/40"}`}
                      >
                        {s.title}
                      </h3>
                      {isActive && (
                        <p className="text-xs text-teal-300 animate-pulse">
                          In Progress
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 mt-10 md:mt-0">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-sm">
                Need help? Contact support at{" "}
                <span className="text-teal-400">support@medicore.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-full p-8 md:p-12 bg-white/5 relative">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="text-teal-400" /> Personal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  label="Full Name"
                  placeholder="John Doe"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<User className="w-4 h-4 text-white/50" />}
                />
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<Mail className="w-4 h-4 text-white/50" />}
                />
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  label="Phone Number"
                  placeholder="+1 234 567 890"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<Phone className="w-4 h-4 text-white/50" />}
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Gender
                  </label>
                  <Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { label: "Male", value: "Male" },
                      { label: "Female", value: "Female" },
                      { label: "Other", value: "Other" },
                    ]}
                    className="bg-white/5 border-white/10 text-white focus:bg-white/10"
                  />
                </div>
                <Input
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  label="Date of Birth"
                  type="date"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<Calendar className="w-4 h-4 text-white/50" />}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BadgeCheck className="text-teal-400" /> Registration Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleChange}
                  label="License Number"
                  placeholder="PH-123456"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<FileText className="w-4 h-4 text-white/50" />}
                />
                <Input
                  name="registration_authority"
                  value={formData.registration_authority}
                  onChange={handleChange}
                  label="Registration Authority"
                  placeholder="Pharmacy Council"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<Building2 className="w-4 h-4 text-white/50" />}
                />
                <Input
                  name="registration_issue_date"
                  value={formData.registration_issue_date}
                  onChange={handleChange}
                  label="Issue Date"
                  type="date"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                />
                <Input
                  name="registration_expiry_date"
                  value={formData.registration_expiry_date}
                  onChange={handleChange}
                  label="Expiry Date"
                  type="date"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-teal-400" /> Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="years_of_experience"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  label="Years of Experience"
                  type="number"
                  placeholder="5"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                />
                <Input
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  label="Qualifications"
                  placeholder="Pharm-D"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                />
                <Input
                  name="pharmacy_college"
                  value={formData.pharmacy_college}
                  onChange={handleChange}
                  label="Pharmacy College"
                  placeholder="Punjab Pharmacy College"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                />
                <Input
                  name="passing_year"
                  value={formData.passing_year}
                  onChange={handleChange}
                  label="Passing Year"
                  type="number"
                  placeholder="2018"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                />
                <Input
                  name="cnic_number"
                  value={formData.cnic_number}
                  onChange={handleChange}
                  label="CNIC Number"
                  placeholder="12345-6789012-3"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<FileText className="w-4 h-4 text-white/50" />}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="text-teal-400" /> Pharmacy Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="pharmacy_name"
                  value={formData.pharmacy_name}
                  onChange={handleChange}
                  label="Pharmacy Name"
                  placeholder="City Care Pharmacy"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<Building2 className="w-4 h-4 text-white/50" />}
                />
                <Input
                  name="pharmacy_city"
                  value={formData.pharmacy_city}
                  onChange={handleChange}
                  label="City"
                  placeholder="Lahore"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                  icon={<MapPin className="w-4 h-4 text-white/50" />}
                />
                <div className="md:col-span-2">
                  <Input
                    name="pharmacy_address"
                    value={formData.pharmacy_address}
                    onChange={handleChange}
                    label="Pharmacy Address"
                    placeholder="Street 22, Main Boulevard"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                    icon={<MapPin className="w-4 h-4 text-white/50" />}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/10">
            <Button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-2 bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-transparent hover:border-white/10 ${step === 1 ? "invisible" : ""}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <Button
              onClick={async () => {
                if (step === 4) {
                  formSubmittedRef.current = true;
                }
                await handleNext();
              }}
              isLoading={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 group"
            >
              {step === 4 ? "Submit Application" : "Next Step"}
              {step !== 4 && (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

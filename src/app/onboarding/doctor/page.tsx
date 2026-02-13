"use client";

import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Banknote,
  Calendar,
  ArrowRight,
  User,
  Mail,
  Phone,
  FileText,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateDoctorProfile, resetDoctorState } from "@/redux/slices/doctorSlice";
import { useEffect } from "react";
import { useDoctorOnboarding } from "@/hooks/useDoctorOnboarding";

export default function DoctorOnboarding() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error, success } = useAppSelector((state) => state.doctor);

  const {
    step,
    loading,
    handleNext,
    handleBack,
    toggleDay,
    workingDays,
    refs,
  } = useDoctorOnboarding();

  useEffect(() => {
    if (success) {
      toast.success("Doctor profile setup complete!");
      router.push("/onboarding/doctor/pending");
      dispatch(resetDoctorState());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, router, dispatch]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const stepClass = (s: number) => (step === s ? "block" : "hidden");

  return (
    <div className="w-full max-w-full bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl transition-all duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Complete Your Doctor Profile
          </h1>
          <p className="text-white/60 text-lg">
            Provide your professional details to set up your practice
          </p>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5, 6, 7].map((s) => (
            <div
              key={s}
              className={`h-2.5 w-10 rounded-full transition-all duration-500 ${step >= s ? "bg-indigo-500" : "bg-white/10"}`}
            />
          ))}
        </div>
      </div>

      <div className="min-h-full">
        {/* Step 1: Basic Information */}
        <div className={`space-y-8 animate-in ${stepClass(1)}`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-7 h-7 text-indigo-400" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Full Name
              </label>
              <Input
                ref={refs.fullNameRef}
                placeholder="Dr. John Doe"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<User className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Email Address
              </label>
              <Input
                ref={refs.emailRef}
                type="email"
                placeholder="doctor@example.com"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<Mail className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Phone Number
              </label>
              <Input
                ref={refs.phoneRef}
                placeholder="+1 234 567 890"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<Phone className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Gender
              </label>
              <Select
                ref={refs.genderRef}
                defaultValue="Male"
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Date of Birth
              </label>
              <Input
                ref={refs.dobRef}
                type="date"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<Calendar className="w-5 h-5 text-white/40" />}
              />
            </div>
          </div>
        </div>

        {/* Step 2: Professional Registration */}
        <div className={`space-y-8 animate-in ${stepClass(2)}`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            Professional Registration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Registration Number
              </label>
              <Input
                ref={refs.regNumberRef}
                placeholder="REG-12345"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<FileText className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Registration Authority
              </label>
              <Input
                ref={refs.regAuthorityRef}
                placeholder="Medical Council"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<Building2 className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Issue Date
              </label>
              <Input
                ref={refs.regIssueDateRef}
                type="date"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Expiry Date
              </label>
              <Input
                ref={refs.regExpiryDateRef}
                type="date"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Professional Profile */}
        <div className={`space-y-8 animate-in ${stepClass(3)}`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            Professional Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Specialization
              </label>
              <Input
                ref={refs.specializationRef}
                placeholder="e.g. Cardiologist"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<Stethoscope className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Sub Specialization
              </label>
              <Input
                ref={refs.subSpecializationRef}
                placeholder="e.g. Pediatric Cardiology"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Years of Experience
              </label>
              <Input
                ref={refs.experienceRef}
                type="number"
                placeholder="e.g. 10"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Qualifications
              </label>
              <Input
                ref={refs.qualificationsRef}
                placeholder="MBBS, MD, FCPS"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<GraduationCap className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Medical College
              </label>
              <Input
                ref={refs.medicalCollegeRef}
                placeholder="King Edward Medical College"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<Building2 className="w-5 h-5 text-white/40" />}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                Passing Year
              </label>
              <Input
                ref={refs.passingYearRef}
                type="number"
                placeholder="2010"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Clinic / Hospital */}
        <div className={`space-y-8 animate-in ${stepClass(4)}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Building2 className="w-7 h-7 text-indigo-400" />
                Clinic / Hospital
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  ref={refs.clinicNameRef}
                  label="Clinic Name"
                  placeholder="City Care Clinic"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
                <Input
                  ref={refs.clinicCityRef}
                  label="City"
                  placeholder="New York"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
                <Input
                  ref={refs.clinicAddressRef}
                  label="Full Address"
                  placeholder="123 Medical Way, St. Hospital"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  icon={<MapPin className="w-5 h-5 text-white/40" />}
                />
                <Input
                  ref={refs.roomNumberRef}
                  label="Room / Cabin Number"
                  placeholder="OPD-204"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <DollarSign className="w-7 h-7 text-indigo-400" />
                Fees Details
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  ref={refs.consultationFeeRef}
                  type="number"
                  label="Consultation Fee"
                  placeholder="100"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  icon={<Banknote className="w-5 h-5 text-white/40" />}
                />
                <Input
                  ref={refs.followupFeeRef}
                  type="number"
                  label="Follow-up Fee"
                  placeholder="50"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">
                    Follow-up Validity (Days)
                  </label>
                  <Select
                    ref={refs.followupValidityRef}
                    defaultValue="7"
                    options={[
                      { label: "3 Days", value: "3" },
                      { label: "7 Days", value: "7" },
                      { label: "15 Days", value: "15" },
                      { label: "30 Days", value: "30" },
                    ]}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Practice Schedule */}
        <div className={`space-y-8 animate-in ${stepClass(5)}`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Clock className="w-7 h-7 text-indigo-400" />
            Practice Schedule
          </h2>
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-white/70 ml-1 italic">
                Select Working Days
              </label>
              <div className="flex flex-wrap gap-4">
                {days.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      workingDays.includes(day)
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Start Time
                </label>
                <Input
                  ref={refs.startTimeRef}
                  type="time"
                  defaultValue="09:00"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  End Time
                </label>
                <Input
                  ref={refs.endTimeRef}
                  type="time"
                  defaultValue="17:00"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Slot Duration (Minutes)
                </label>
                <Select
                  ref={refs.slotDurationRef}
                  defaultValue="15"
                  options={[
                    { label: "10 Mins", value: "10" },
                    { label: "15 Mins", value: "15" },
                    { label: "20 Mins", value: "20" },
                    { label: "30 Mins", value: "30" },
                  ]}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 6: Identification */}
        <div className={`space-y-8 animate-in ${stepClass(6)}`}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-indigo-400" />
            Identification Documents
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">
                CNIC Number
              </label>
              <Input
                ref={refs.cnicRef}
                placeholder="12345-6789012-3"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                icon={<FileText className="w-5 h-5 text-white/40" />}
              />
            </div>
          </div>
        </div>

        {/* Step 7: Completion */}
        <div className={`space-y-8 animate-in text-center py-10 flex flex-col items-center ${stepClass(7)}`}>
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-green-500/20">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            All Steps Completed!
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
            We've collected all the necessary information to verify your
            profile and set up your practice. You're ready to start providing
            healthcare services.
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-6 mt-10 max-w-lg w-full text-indigo-300 text-sm">
            <p>
              By clicking "Submit", you agree to our professional terms and
              confirm that all provided information is accurate.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-between items-center bg-white/5 p-6 rounded-4xl border border-white/10">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`text-white/60 hover:text-white transition-colors text-lg font-bold flex items-center gap-2 disabled:opacity-0 pointer-events-auto`}
        >
          {step > 1 && <>Back</>}
        </button>
        <div className="flex items-center gap-6">
          <span className="text-white/30 text-sm font-bold uppercase tracking-widest hidden sm:block">
            Step {step} of 7
          </span>
          <Button
            onClick={handleNext}
            isLoading={loading}
            className="px-10 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center gap-3 text-lg font-bold shadow-xl shadow-indigo-600/30 group"
          >
            {step === 7 ? "Finalize & Submit" : "Next Step"}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

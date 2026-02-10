"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Award,
  Banknote,
  Calendar,
  CheckSquare,
  ArrowRight,
  User,
  Mail,
  Phone,
  FileText,
  Building2,
  MapPin,
  Clock,
  Upload,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  DollarSign,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateDoctorProfile, resetDoctorState } from "@/redux/slices/doctorSlice";
import { useEffect } from "react";

export default function DoctorOnboarding() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.doctor);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    gender: "Male",
    date_of_birth: "",

    registration_number: "",
    registration_authority: "",
    registration_issue_date: "",
    registration_expiry_date: "",

    specialization: "General Physician",
    sub_specialization: "",
    years_of_experience: "",
    qualifications: "",
    medical_college: "",
    passing_year: "",
    clinic_name: "",
    clinic_city: "",
    clinic_address: "",
    room_number: "",
    consultation_fee: "",
    followup_fee: "",
    followup_validity_days: "7",
    working_days: [] as string[],
    start_time: "09:00",
    end_time: "17:00",
    slot_duration_minutes: "15",
    cnic_number: "",

  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const handleNext = () => {
    if (step < 7) setStep(step + 1);
    else handleSubmit();
  };

  useEffect(() => {
    if (success) {
      toast.success("Doctor profile setup complete!");
      router.push("/dashboard/doctor");
      dispatch(resetDoctorState());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, router, dispatch]);

  const handleSubmit = async () => {
    dispatch(updateDoctorProfile(formData));
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
        {step === 1 && (
          <div className="space-y-8 animate-in">
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
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
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
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
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
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  icon={<Calendar className="w-5 h-5 text-white/40" />}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in">
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
                  name="registration_number"
                  value={formData.registration_number}
                  onChange={handleChange}
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
                  name="registration_authority"
                  value={formData.registration_authority}
                  onChange={handleChange}
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
                  name="registration_issue_date"
                  type="date"
                  value={formData.registration_issue_date}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Expiry Date
                </label>
                <Input
                  name="registration_expiry_date"
                  type="date"
                  value={formData.registration_expiry_date}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>

            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in">
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
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
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
                  name="sub_specialization"
                  value={formData.sub_specialization}
                  onChange={handleChange}
                  placeholder="e.g. Pediatric Cardiology"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Years of Experience
                </label>
                <Input
                  name="years_of_experience"
                  type="number"
                  value={formData.years_of_experience}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium text-white/70 ml-1">
                  Qualifications
                </label>
                <Input
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
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
                  name="medical_college"
                  value={formData.medical_college}
                  onChange={handleChange}
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
                  name="passing_year"
                  type="number"
                  value={formData.passing_year}
                  onChange={handleChange}
                  placeholder="2010"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Building2 className="w-7 h-7 text-indigo-400" />
                  Clinic / Hospital
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    name="clinic_name"
                    label="Clinic Name"
                    value={formData.clinic_name}
                    onChange={handleChange}
                    placeholder="City Care Clinic"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                  <Input
                    name="clinic_city"
                    label="City"
                    value={formData.clinic_city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                  <Input
                    name="clinic_address"
                    label="Full Address"
                    value={formData.clinic_address}
                    onChange={handleChange}
                    placeholder="123 Medical Way, St. Hospital"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                    icon={<MapPin className="w-5 h-5 text-white/40" />}
                  />
                  <Input
                    name="room_number"
                    label="Room / Cabin Number"
                    value={formData.room_number}
                    onChange={handleChange}
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
                    name="consultation_fee"
                    type="number"
                    label="Consultation Fee"
                    value={formData.consultation_fee}
                    onChange={handleChange}
                    placeholder="100"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                    icon={<Banknote className="w-5 h-5 text-white/40" />}
                  />
                  <Input
                    name="followup_fee"
                    type="number"
                    label="Follow-up Fee"
                    value={formData.followup_fee}
                    onChange={handleChange}
                    placeholder="50"
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 ml-1">
                      Follow-up Validity (Days)
                    </label>
                    <Select
                      name="followup_validity_days"
                      value={formData.followup_validity_days}
                      onChange={handleChange}
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
        )}

        {step === 5 && (
          <div className="space-y-8 animate-in">
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
                      onClick={() => toggleDay(day)}
                      className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                        formData.working_days.includes(day)
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
                    name="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">
                    End Time
                  </label>
                  <Input
                    name="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 ml-1">
                    Slot Duration (Minutes)
                  </label>
                  <Select
                    name="slot_duration_minutes"
                    value={formData.slot_duration_minutes}
                    onChange={handleChange}
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
        )}

        {step === 6 && (
          <div className="space-y-8 animate-in">
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
                  name="cnic_number"
                  value={formData.cnic_number}
                  onChange={handleChange}
                  placeholder="12345-6789012-3"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  icon={<FileText className="w-5 h-5 text-white/40" />}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Completion */}
        {step === 7 && (
          <div className="space-y-8 animate-in text-center py-10 flex flex-col items-center">
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
        )}
      </div>

      <div className="mt-16 flex justify-between items-center bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
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

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  BadgeCheck,
  Briefcase,
  Monitor,
  Globe,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useReceptionistOnboarding } from "@/hooks/useReceptionistOnboarding";
import { resetReceptionistState } from "@/redux/slices/receptionistSlice";
import toast from "react-hot-toast";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Professional Info", icon: Briefcase },
  { id: 3, title: "Work Preferences", icon: Clock },
];

export default function ReceptionistOnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const {
    step,
    loading,
    success,
    error,
    formData,
    handleChange,
    handleNext,
    handleBack,
    toggleDay,
    availabilityDays,
    canWorkWeekends,
    setCanWorkWeekends,
  } = useReceptionistOnboarding();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    
    if (user?.role !== "RECEPTIONIST") {
      toast.error("Access denied. Only receptionists can access this page.");
      router.push("/unauthorized"); // Or dashboard
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (success) {
      // Toast is already in hook, but this is fine
      router.push("/onboarding/receptionist/pending");
      dispatch(resetReceptionistState());
    }
    if (error) {
      toast.error(error);
    }
  }, [success, error, router, dispatch]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper to hide steps instead of unmounting
  const stepClass = (s: number) => (step === s ? "block" : "hidden");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar / Progress */}
        <div className="w-full md:w-1/3 bg-black/20 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-600/10 z-0"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Receptionist Onboarding</h1>
            <p className="text-white/60 mb-10">Complete your profile to get started.</p>
            
            <div className="space-y-6">
              {steps.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                
                return (
                  <div key={s.id} className={`flex items-center gap-4 transition-all duration-300 ${isActive ? 'translate-x-2' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30' : 
                      isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                      'border-white/20 text-white/40'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isActive || isCompleted ? 'text-white' : 'text-white/40'}`}>
                        {s.title}
                      </h3>
                      {isActive && <p className="text-xs text-blue-300 animate-pulse">In Progress</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative z-10 mt-10 md:mt-0">
             <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/60 text-sm">Need help? Contact support at <span className="text-blue-400">support@medicore.com</span></p>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-8 md:p-12 bg-white/5 relative">
           {/* Step 1: Personal Information */}
           <div className={`space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 ${stepClass(1)}`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="text-blue-400" /> Personal Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                   name="full_name"
                   value={formData.full_name}
                   onChange={handleChange}
                   label="Full Name" 
                   placeholder="John Doe" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
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
                   labelClassName="text-white/70"
                   icon={<Mail className="w-4 h-4 text-white/50" />}
                />
                <Input 
                   name="phone"
                   value={formData.phone}
                   onChange={handleChange}
                   label="Phone Number" 
                   placeholder="+1 234 567 890" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                   icon={<Phone className="w-4 h-4 text-white/50" />}
                />
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white/70 mb-1">Gender</label>
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
                   labelClassName="text-white/70"
                />
                <Input 
                   name="cnic_number"
                   value={formData.cnic_number}
                   onChange={handleChange}
                   label="CNIC Number" 
                   placeholder="12345-6789012-3" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                   icon={<FileText className="w-4 h-4 text-white/50" />}
                />
                <Input 
                   name="address"
                   value={formData.address}
                   onChange={handleChange}
                   label="Address" 
                   placeholder="123 Main St" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                   icon={<MapPin className="w-4 h-4 text-white/50" />}
                />
                <Input 
                   name="city"
                   value={formData.city}
                   onChange={handleChange}
                   label="City" 
                   placeholder="New York" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                   icon={<Building2 className="w-4 h-4 text-white/50" />}
                />
              </div>
           </div>

           {/* Step 2: Professional Info */}
           <div className={`space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 ${stepClass(2)}`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-blue-400" /> Professional Qualifications
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                   name="highest_qualification"
                   value={formData.highest_qualification}
                   onChange={handleChange}
                   label="Highest Qualification" 
                   placeholder="Bachelor's Degree" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                   icon={<BadgeCheck className="w-4 h-4 text-white/50" />}
                />
                <Input 
                   name="qualification_field"
                   value={formData.qualification_field}
                   onChange={handleChange}
                   label="Field of Study" 
                   placeholder="Check this field is correct" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                />
                <Input 
                   name="years_of_experience"
                   value={formData.years_of_experience}
                   onChange={handleChange}
                   label="Years of Experience" 
                   type="number"
                   placeholder="3" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                />
                <Input 
                   name="languages"
                   value={formData.languages}
                   onChange={handleChange}
                   label="Languages Spoken" 
                   placeholder="English, Spanish" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                   icon={<Globe className="w-4 h-4 text-white/50" />}
                />
                <div className="md:col-span-2">
                  <Input 
                     name="computer_proficiency"
                     value={formData.computer_proficiency}
                     onChange={handleChange}
                     label="Computer Proficiency" 
                     placeholder="MS Office, Typing, etc." 
                     className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                     labelClassName="text-white/70"
                     icon={<Monitor className="w-4 h-4 text-white/50" />}
                  />
                </div>
                <Input 
                   name="previous_employer"
                   value={formData.previous_employer}
                   onChange={handleChange}
                   label="Previous Employer" 
                   placeholder="Company Name" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                />
                <Input 
                   name="previous_designation"
                   value={formData.previous_designation}
                   onChange={handleChange}
                   label="Previous Designation" 
                   placeholder="Front Desk Officer" 
                   className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10"
                   labelClassName="text-white/70"
                />
              </div>
           </div>

           {/* Step 3: Work Preferences */}
           <div className={`space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 ${stepClass(3)}`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-blue-400" /> Work Preferences
              </h2>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-white/70 mb-1">Preferred Shift</label>
                  <Select
                    name="preferred_shift"
                    value={formData.preferred_shift}
                    onChange={handleChange}
                    options={[
                      { label: "Morning", value: "Morning" },
                      { label: "Evening", value: "Evening" },
                      { label: "Night", value: "Night" },
                    ]}
                    className="bg-white/5 border-white/10 text-white focus:bg-white/10"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white/70 mb-1">Availability Days</label>
                  <div className="flex flex-wrap gap-3">
                    {days.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          availabilityDays.includes(day)
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    id="weekends"
                    checked={canWorkWeekends}
                    onChange={(e) => setCanWorkWeekends(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-transparent text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <label htmlFor="weekends" className="text-white/80 cursor-pointer select-none">
                    I am willing to work on weekends if required
                  </label>
                </div>
              </div>
           </div>

           {/* Navigation Buttons */}
           <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/10">
             <Button
               onClick={handleBack}
               disabled={step === 1}
               className={`flex items-center gap-2 bg-transparent hover:bg-white/5 text-white/70 hover:text-white border border-transparent hover:border-white/10 ${step === 1 ? 'invisible' : ''}`}
             >
               <ArrowLeft className="w-4 h-4" /> Back
             </Button>
             
             <Button
               onClick={handleNext}
               isLoading={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 group"
             >
               {step === 3 ? "Submit Application" : "Next Step"}
               {step !== 3 && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

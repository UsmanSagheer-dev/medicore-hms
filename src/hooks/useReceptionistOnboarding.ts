"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submitReceptionistOnboarding } from "@/redux/slices/receptionistSlice";

interface FormDataType {
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  address: string;
  city: string;
  highest_qualification: string;
  qualification_field: string;
  years_of_experience: string;
  previous_employer: string;
  previous_designation: string;
  cnic_number: string;
  preferred_shift: string;
  availability_days: string[];
  can_work_weekends: boolean;
  languages: string;
  computer_proficiency: string;
}

export const useReceptionistOnboarding = () => {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.receptionist);
  const [step, setStep] = useState(1);
  
  // Controlled form state
  const [formData, setFormData] = useState<FormDataType>({
    full_name: "",
    email: "",
    phone: "",
    gender: "Male",
    date_of_birth: "",
    address: "",
    city: "",
    highest_qualification: "",
    qualification_field: "",
    years_of_experience: "",
    previous_employer: "",
    previous_designation: "",
    cnic_number: "",
    preferred_shift: "Morning",
    availability_days: [],
    can_work_weekends: false,
    languages: "",
    computer_proficiency: "",
  });

  // Step 1: Personal Information - NO REFS NEEDED, using formData state
  // Step 2: Professional Qualifications - NO REFS NEEDED
  // Step 3: Work Preferences & History - NO REFS NEEDED

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (value: string | string[], fieldName: string): boolean => {
    if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
      toast.error(`Please enter ${fieldName}`);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateField(formData.full_name, "Full Name")) return;
      if (!validateField(formData.email, "Email Address")) return;
      if (!validateField(formData.phone, "Phone Number")) return;
      if (!validateField(formData.gender, "Gender")) return;
      if (!validateField(formData.date_of_birth, "Date of Birth")) return;
      if (!validateField(formData.cnic_number, "CNIC Number")) return;
      if (!validateField(formData.address, "Address")) return;
      if (!validateField(formData.city, "City")) return;
    } else if (step === 2) {
      if (!validateField(formData.highest_qualification, "Highest Qualification")) return;
      if (!validateField(formData.years_of_experience, "Years of Experience")) return;
      if (!validateField(formData.languages, "Languages Spoken")) return;
      if (!validateField(formData.computer_proficiency, "Computer Proficiency")) return;
    } else if (step === 3) {
      if (!validateField(formData.preferred_shift, "Preferred Shift")) return;
      if (formData.availability_days.length === 0) {
        toast.error("Please select at least one availability day");
        return;
      }
    }

    if (step < 3) setStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const toggleDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability_days: prev.availability_days.includes(day)
        ? prev.availability_days.filter((d) => d !== day)
        : [...prev.availability_days, day],
    }));
  };

  const handleSubmit = async () => {
    console.log("Submitting Receptionist Onboarding Data:", formData);
    await dispatch(submitReceptionistOnboarding(formData));
  };

  return {
    step,
    loading,
    success,
    error,
    formData,
    handleChange,
    handleNext,
    handleBack,
    toggleDay,
    availabilityDays: formData.availability_days,
    canWorkWeekends: formData.can_work_weekends,
    setCanWorkWeekends: (value: boolean) => {
      setFormData((prev) => ({
        ...prev,
        can_work_weekends: value,
      }));
    },
  };
};

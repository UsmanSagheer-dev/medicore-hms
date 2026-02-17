"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submitReceptionistOnboarding } from "@/redux/slices/receptionistSlice";

interface FormDataType {
  full_name: string;
  email: string;
  phone: string;
  cnic_number: string;
  years_of_experience: string;
  languages: string;
  computer_proficiency: string;
  preferred_shift: string;
  availability_days: string[];
  can_work_weekends: boolean;
}

export const useReceptionistOnboarding = () => {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector(
    (state) => state.receptionist,
  );
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormDataType>({
    full_name: "",
    email: "",
    phone: "",
    cnic_number: "",
    years_of_experience: "",
    languages: "",
    computer_proficiency: "",
    preferred_shift: "Morning",
    availability_days: [],
    can_work_weekends: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (
    value: string | string[],
    fieldName: string,
  ): boolean => {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      value === ""
    ) {
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
      if (!validateField(formData.cnic_number, "CNIC Number")) return;
    } else if (step === 2) {
      if (!validateField(formData.preferred_shift, "Preferred Shift")) return;
      if (formData.availability_days.length === 0) {
        toast.error("Please select at least one availability day");
        return;
      }
    }

    if (step < 2) setStep((prev) => prev + 1);
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

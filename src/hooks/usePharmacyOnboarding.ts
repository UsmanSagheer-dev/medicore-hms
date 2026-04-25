"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  submitPharmacyOnboarding,
  type PharmacyOnboardingFormData,
} from "@/redux/slices/pharmacySlice";

interface PharmacyFormData extends PharmacyOnboardingFormData {
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  license_number: string;
  registration_authority: string;
  registration_issue_date: string;
  registration_expiry_date: string;
  years_of_experience: string;
  qualifications: string;
  pharmacy_college: string;
  passing_year: string;
  pharmacy_name: string;
  pharmacy_city: string;
  pharmacy_address: string;
  cnic_number: string;
}

const initialFormData: PharmacyFormData = {
  full_name: "",
  email: "",
  phone: "",
  gender: "Male",
  date_of_birth: "",
  license_number: "",
  registration_authority: "",
  registration_issue_date: "",
  registration_expiry_date: "",
  years_of_experience: "",
  qualifications: "",
  pharmacy_college: "",
  passing_year: "",
  pharmacy_name: "",
  pharmacy_city: "",
  pharmacy_address: "",
  cnic_number: "",
};

export const usePharmacyOnboarding = () => {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.pharmacy);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<PharmacyFormData>(initialFormData);

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

  const validateField = (value: string, fieldName: string): boolean => {
    if (!value || value.trim() === "") {
      toast.error(`Please enter ${fieldName}`);
      return false;
    }
    return true;
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!validateField(formData.full_name, "Full Name")) return false;
      if (!validateField(formData.email, "Email Address")) return false;
      if (!validateField(formData.phone, "Phone Number")) return false;
      if (!validateField(formData.gender, "Gender")) return false;
      if (!validateField(formData.date_of_birth, "Date of Birth")) return false;
    }

    if (step === 2) {
      if (!validateField(formData.license_number, "License Number")) return false;
      if (
        !validateField(
          formData.registration_authority,
          "Registration Authority",
        )
      )
        return false;
      if (
        !validateField(formData.registration_issue_date, "Registration Issue Date")
      )
        return false;
      if (
        !validateField(
          formData.registration_expiry_date,
          "Registration Expiry Date",
        )
      )
        return false;
    }

    if (step === 3) {
      if (
        !validateField(formData.years_of_experience, "Years of Experience")
      )
        return false;
      if (!validateField(formData.qualifications, "Qualifications")) return false;
      if (!validateField(formData.pharmacy_college, "Pharmacy College"))
        return false;
      if (!validateField(formData.passing_year, "Passing Year")) return false;
      if (!validateField(formData.cnic_number, "CNIC Number")) return false;
    }

    if (step === 4) {
      if (!validateField(formData.pharmacy_name, "Pharmacy Name")) return false;
      if (!validateField(formData.pharmacy_city, "Pharmacy City")) return false;
      if (!validateField(formData.pharmacy_address, "Pharmacy Address"))
        return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep((prev) => prev + 1);
      return;
    }

    await dispatch(submitPharmacyOnboarding(formData));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
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
  };
};

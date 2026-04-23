"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { submitDoctorProfile } from "@/redux/slices/doctorSlice";
import { DayKey, normalizeDayKey } from "@/lib/daySchedule";

export const useDoctorOnboarding = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.doctor);
  const [step, setStep] = useState(1);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);

  const regNumberRef = useRef<HTMLInputElement>(null);
  const regAuthorityRef = useRef<HTMLInputElement>(null);
  const regIssueDateRef = useRef<HTMLInputElement>(null);
  const regExpiryDateRef = useRef<HTMLInputElement>(null);
  const specializationRef = useRef<HTMLInputElement>(null);
  const subSpecializationRef = useRef<HTMLInputElement>(null);
  const experienceRef = useRef<HTMLInputElement>(null);
  const qualificationsRef = useRef<HTMLInputElement>(null);
  const medicalCollegeRef = useRef<HTMLInputElement>(null);
  const passingYearRef = useRef<HTMLInputElement>(null);

  const clinicNameRef = useRef<HTMLInputElement>(null);
  const clinicCityRef = useRef<HTMLInputElement>(null);
  const clinicAddressRef = useRef<HTMLInputElement>(null);
  const roomNumberRef = useRef<HTMLInputElement>(null);
  const consultationFeeRef = useRef<HTMLInputElement>(null);
  const followupFeeRef = useRef<HTMLInputElement>(null);
  const followupValidityRef = useRef<HTMLSelectElement>(null);

  const [workingHours, setWorkingHours] = useState<
    Partial<Record<DayKey, { start: string; end: string }>>
  >({});
  const slotDurationRef = useRef<HTMLSelectElement>(null);
  const cnicRef = useRef<HTMLInputElement>(null);

  const validateField = (
    ref: React.RefObject<HTMLInputElement | HTMLSelectElement | null>,
    fieldName: string,
  ) => {
    if (!ref.current?.value) {
      toast.error(`Please enter ${fieldName}`);
      ref.current?.focus();
      ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateField(fullNameRef, "Full Name")) return;
      if (!validateField(emailRef, "Email Address")) return;
      if (!validateField(phoneRef, "Phone Number")) return;
      if (!validateField(genderRef, "Gender")) return;
      if (!validateField(dobRef, "Date of Birth")) return;
    } else if (step === 2) {
      if (!validateField(regNumberRef, "Registration Number")) return;
      if (!validateField(regAuthorityRef, "Registration Authority")) return;
      if (!validateField(regIssueDateRef, "Issue Date")) return;
      if (!validateField(regExpiryDateRef, "Expiry Date")) return;
    } else if (step === 3) {
      if (!validateField(specializationRef, "Specialization")) return;
      if (!validateField(experienceRef, "Years of Experience")) return;
      if (!validateField(qualificationsRef, "Qualifications")) return;
    } else if (step === 4) {
      if (!validateField(clinicNameRef, "Clinic Name")) return;
      if (!validateField(clinicCityRef, "City")) return;
      if (!validateField(clinicAddressRef, "Full Address")) return;
      if (!validateField(consultationFeeRef, "Consultation Fee")) return;
    } else if (step === 5) {
      if (Object.keys(workingHours).length === 0) {
        toast.error("Please select at least one working day with times");
        return;
      }
      // Validate that all working days have start and end times
      const allHaveTime = Object.entries(workingHours).every(
        ([_, times]) => times.start && times.end,
      );
      if (!allHaveTime) {
        toast.error("Please set start and end time for all selected days");
        return;
      }
    } else if (step === 6) {
      if (!validateField(cnicRef, "CNIC Number")) return;
    }

    if (step < 7) setStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const toggleDay = (day: string) => {
    const normalizedDay = normalizeDayKey(day);
    if (!normalizedDay) {
      return;
    }

    setWorkingHours((prev) => {
      const updated = { ...prev };
      if (updated[normalizedDay]) {
        delete updated[normalizedDay];
      } else {
        updated[normalizedDay] = { start: "09:00", end: "17:00" };
      }
      return updated;
    });
  };

  const updateDayTime = (
    day: string,
    timeType: "start" | "end",
    value: string,
  ) => {
    const normalizedDay = normalizeDayKey(day);
    if (!normalizedDay) {
      return;
    }

    setWorkingHours((prev) => ({
      ...prev,
      [normalizedDay]: {
        ...prev[normalizedDay],
        [timeType]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const formData = {
      full_name: fullNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      gender: genderRef.current?.value || "Male",
      date_of_birth: dobRef.current?.value || "",
      registration_number: regNumberRef.current?.value || "",
      registration_authority: regAuthorityRef.current?.value || "",
      registration_issue_date: regIssueDateRef.current?.value || "",
      registration_expiry_date: regExpiryDateRef.current?.value || "",
      specialization: specializationRef.current?.value || "General Physician",
      sub_specialization: subSpecializationRef.current?.value || "",
      years_of_experience: experienceRef.current?.value || "",
      qualifications: qualificationsRef.current?.value || "",
      medical_college: medicalCollegeRef.current?.value || "",
      passing_year: passingYearRef.current?.value || "",
      clinic_name: clinicNameRef.current?.value || "",
      clinic_city: clinicCityRef.current?.value || "",
      clinic_address: clinicAddressRef.current?.value || "",
      room_number: roomNumberRef.current?.value || "",
      consultation_fee: consultationFeeRef.current?.value || "",
      followup_fee: followupFeeRef.current?.value || "",
      followup_validity_days: followupValidityRef.current?.value || "7",
      working_days: JSON.stringify(workingHours),
      start_time: Object.values(workingHours)[0]?.start || "",
      end_time: Object.values(workingHours)[0]?.end || "",
      slot_duration_minutes: slotDurationRef.current?.value || "15",
      cnic_number: cnicRef.current?.value || "",
    };
    dispatch(submitDoctorProfile(formData));
  };

  return {
    step,
    loading,
    handleNext,
    handleBack,
    toggleDay,
    updateDayTime,
    workingHours,
    refs: {
      fullNameRef,
      emailRef,
      phoneRef,
      genderRef,
      dobRef,
      regNumberRef,
      regAuthorityRef,
      regIssueDateRef,
      regExpiryDateRef,
      specializationRef,
      subSpecializationRef,
      experienceRef,
      qualificationsRef,
      medicalCollegeRef,
      passingYearRef,
      clinicNameRef,
      clinicCityRef,
      clinicAddressRef,
      roomNumberRef,
      consultationFeeRef,
      followupFeeRef,
      followupValidityRef,
      slotDurationRef,
      cnicRef,
    },
  };
};

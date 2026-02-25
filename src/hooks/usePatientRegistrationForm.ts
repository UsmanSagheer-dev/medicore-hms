import { useRef, useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { TokenData } from "@/types/token";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeDoctor } from "@/redux/slices/doctorSlice";
import {
  createPatient,
  createPatientVisit,
} from "@/redux/slices/patientVisitSlice";

interface UsePatientRegistrationFormProps {
  onRegister?: (token: TokenData) => void;
}

export function usePatientRegistrationForm({
  onRegister,
}: UsePatientRegistrationFormProps) {
  // Form refs
  const fullNameRef = useRef<HTMLInputElement>(null);
  const fatherNameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const selectDoctorRef = useRef<HTMLSelectElement>(null);
  const cnicRef = useRef<HTMLInputElement>(null);
  const visitTypeRef = useRef<HTMLSelectElement>(null);
  const discountRef = useRef<HTMLInputElement>(null);
  const consultationFeeRef = useRef<HTMLInputElement>(null);

  // State
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux
  const dispatch = useAppDispatch();
  const { activeDoctors } = useAppSelector((state) => state.doctor);
  const { loading: patientLoading } = useAppSelector(
    (state) => state.patientVisit,
  );

  // Fetch active doctors on mount
  useEffect(() => {
    dispatch(activeDoctor());
  }, [dispatch]);

  // Fee calculation logic
  const setFeeFromDoctorAndVisitType = (
    doctorId: string,
    visitType: string,
  ) => {
    const selectedDoctor = activeDoctors.find((doc) => doc.id === doctorId);
    if (!consultationFeeRef.current) return;

    if (!selectedDoctor) {
      consultationFeeRef.current.value = "";
      return;
    }

    consultationFeeRef.current.value =
      visitType === "followup"
        ? selectedDoctor.followup_fee || selectedDoctor.consultation_fee || ""
        : selectedDoctor.consultation_fee || "";
  };

  // Event handlers
  const handleDoctorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentVisitType = visitTypeRef.current?.value || "";
    setFeeFromDoctorAndVisitType(e.target.value, currentVisitType);
  };

  const handleVisitTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentDoctorId = selectDoctorRef.current?.value || "";
    setFeeFromDoctorAndVisitType(currentDoctorId, e.target.value);
  };

  // Field validation helper
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

  // Main registration handler
  const handleRegister = async () => {
    // Validate all fields
    if (!validateField(fullNameRef, "Full Name")) return;
    if (!validateField(fatherNameRef, "Father Name")) return;
    if (!validateField(ageRef, "Age")) return;
    if (!validateField(genderRef, "Gender")) return;
    if (!validateField(addressRef, "Address")) return;
    if (!validateField(phoneNumberRef, "Phone Number")) return;
    if (!validateField(selectDoctorRef, "Select Doctor")) return;
    if (!validateField(cnicRef, "CNIC")) return;
    if (!validateField(visitTypeRef, "Visit Type")) return;
    if (!validateField(consultationFeeRef, "Consultation Fee")) return;

    // Validate CNIC length
    if (cnicRef.current?.value.length !== 13) {
      toast.error("Please enter a valid CNIC (13 digits)");
      cnicRef.current?.focus();
      cnicRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Validate phone number length
    if (phoneNumberRef.current?.value.length !== 11) {
      toast.error("Please enter a valid Phone Number (11 digits)");
      phoneNumberRef.current?.focus();
      phoneNumberRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const doctorId = selectDoctorRef.current?.value || "";
      const selectedDoctor = activeDoctors.find((doc) => doc.id === doctorId);

      // Step 1: Create Patient in Database
      const patientResult = await dispatch(
        createPatient({
          fullName: fullNameRef.current?.value || "",
          fatherName: fatherNameRef.current?.value || "",
          age: parseInt(ageRef.current?.value || "0"),
          gender: genderRef.current?.value || "",
          cnic: cnicRef.current?.value || "",
          phoneNumber: phoneNumberRef.current?.value || "",
          address: addressRef.current?.value || "",
          doctorId: doctorId,
        }),
      );

      if (patientResult.meta.requestStatus === "rejected") {
        toast.error(patientResult.payload || "Failed to create patient");
        setIsSubmitting(false);
        return;
      }

      // Get patient ID from response
      const patientId = patientResult.payload?.data?.id || "";

      if (!patientId) {
        toast.error("Failed to extract patient ID from response");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Create Patient Visit Token
      const currentDate = new Date().toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Map visit type to enum value
      let visitTypeEnum = "NEW";
      if (visitTypeRef.current?.value === "revisit") {
        visitTypeEnum = "REVISIT";
      } else if (visitTypeRef.current?.value === "followup") {
        visitTypeEnum = "FOLLOWUP";
      }

      const visitResult = await dispatch(
        createPatientVisit({
          patientName: fullNameRef.current?.value || "",
          fatherName: fatherNameRef.current?.value || "",
          age: `${ageRef.current?.value} Years`,
          gender: genderRef.current?.value || "",
          cnic: cnicRef.current?.value || "",
          phoneNumber: phoneNumberRef.current?.value || "",
          address: addressRef.current?.value || "",
          doctorName: selectedDoctor?.full_name || "",
          specialization: selectedDoctor?.specialization || "General Physician",
          roomNo: selectedDoctor?.room_number || "N/A",
          consultationFee: consultationFeeRef.current?.value || "0",
          discount: discountRef.current?.value || "0",
          date: currentDate,
          time: currentTime,
          isPaid: paymentStatus === "paid",
          paymentStatus: paymentStatus as "pending" | "paid",
          visitType: visitTypeEnum as any,
          patientId: patientId,
          doctorId: doctorId,
        } as any),
      );

      if (visitResult.meta.requestStatus === "rejected") {
        toast.error(
          (visitResult.payload as string) || "Failed to create patient visit",
        );
        setIsSubmitting(false);
        return;
      }

      console.log("Visit Result:", visitResult.payload);

      // Backend response structure: response.data
      const createdVisit = (visitResult.payload as any) || {};

      // Try to get token number from different possible response structures
      const tokenNo = createdVisit.data?.tokenNo;

      const resolvedTokenNo = String(tokenNo).padStart(2, "0");

      const newToken: TokenData = {
        tokenNo: resolvedTokenNo,
        patientName:
          createdVisit.patientName || fullNameRef.current?.value || "",
        fatherName:
          createdVisit.fatherName || fatherNameRef.current?.value || "",
        age: createdVisit.age || `${ageRef.current?.value} Years`,
        gender: createdVisit.gender || genderRef.current?.value || "",
        cnic: createdVisit.cnic || cnicRef.current?.value || "",
        doctorName: createdVisit.doctorName || selectedDoctor?.full_name || "",
        specialization:
          createdVisit.specialization ||
          selectedDoctor?.specialization ||
          "General Physician",
        roomNo: createdVisit.roomNo || selectedDoctor?.room_number || "N/A",
        date: createdVisit.date || currentDate,
        time: createdVisit.time || currentTime,
        fee: String(
          createdVisit.consultationFee ||
            consultationFeeRef.current?.value ||
            "0",
        ),
        isPaid: Boolean(createdVisit.isPaid ?? paymentStatus === "paid"),
        visitType:
          (createdVisit.visitType as TokenData["visitType"]) ||
          (visitTypeRef.current?.value === "new"
            ? "New"
            : visitTypeRef.current?.value === "revisit"
              ? "Revisit"
              : "Follow up"),
      };

      if (onRegister) {
        onRegister(newToken);
      }
      toast.success(`Token ${newToken.tokenNo} generated successfully!`);
      handleReset();
    } catch (error) {
      toast.error("An error occurred while creating the token");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    if (fullNameRef.current) fullNameRef.current.value = "";
    if (fatherNameRef.current) fatherNameRef.current.value = "";
    if (ageRef.current) ageRef.current.value = "";
    if (genderRef.current) genderRef.current.value = "";
    if (addressRef.current) addressRef.current.value = "";
    if (phoneNumberRef.current) phoneNumberRef.current.value = "";
    if (selectDoctorRef.current) selectDoctorRef.current.value = "";
    if (cnicRef.current) cnicRef.current.value = "";
    if (visitTypeRef.current) visitTypeRef.current.value = "";
    if (discountRef.current) discountRef.current.value = "";
    if (consultationFeeRef.current) consultationFeeRef.current.value = "";
    setPaymentStatus("pending");
  };

  return {
    // Refs
    refs: {
      fullNameRef,
      fatherNameRef,
      ageRef,
      genderRef,
      addressRef,
      phoneNumberRef,
      selectDoctorRef,
      cnicRef,
      visitTypeRef,
      discountRef,
      consultationFeeRef,
    },
    // State
    paymentStatus,
    setPaymentStatus,
    isSubmitting,
    // Redux state
    activeDoctors,
    patientLoading,
    // Handlers
    handleDoctorChange,
    handleVisitTypeChange,
    handleRegister,
    handleReset,
  };
}

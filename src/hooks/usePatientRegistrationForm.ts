import { useRef, useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { toast } from "react-hot-toast";
import { TokenData } from "@/types/token";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeDoctor } from "@/redux/slices/doctorSlice";
import {
  createPatient,
  createPatientVisit,
  getPatientByCNIC,
  getVistiByPatientId,
  getLatestConsultation,
} from "@/redux/slices/patientVisitSlice";

interface UsePatientRegistrationFormProps {
  onRegister?: (token: TokenData) => void;
}

export function usePatientRegistrationForm({
  onRegister,
}: UsePatientRegistrationFormProps) {
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
  const searchCnicRef = useRef<HTMLInputElement>(null);

  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchCnic, setSearchCnic] = useState("");
  const [patientFound, setPatientFound] = useState(false);
  const [searchedPatient, setSearchedPatient] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { activeDoctors } = useAppSelector((state) => state.doctor);
  const { loading: patientLoading } = useAppSelector(
    (state) => state.patientVisit,
  );

  useEffect(() => {
    dispatch(activeDoctor());
  }, [dispatch]);

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
const handleDoctorChange = async (e: ChangeEvent<HTMLSelectElement>) => {
  const doctorId = e.target.value;
  
  if (searchedPatient?.id) {
    try {
      const consultationResult = await dispatch(
        getLatestConsultation(searchedPatient.id),
      );

      if (consultationResult.meta.requestStatus === "fulfilled" && consultationResult.payload) {
        const consultation = consultationResult.payload?.data || consultationResult.payload;
        
        let visitType = "NEW"; // Default to NEW if no consultation found
        
        // ✅ PRIMARY CHECK: nextFollowUp date
        if (consultation?.nextFollowUp) {
          const followUpDate = new Date(consultation.nextFollowUp);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          followUpDate.setHours(0, 0, 0, 0);
          
          if (followUpDate >= today) {
            visitType = "FOLLOWUP"; 
          } else {
            visitType = "REVISIT";
          }
        } 
        else if (consultation?.id) {
         
          visitType = "REVISIT";
        }
        
        if (visitTypeRef.current) {
          visitTypeRef.current.value = visitType;
        }
        
        setFeeFromDoctorAndVisitType(doctorId, visitType);
      }
    } catch (error) {
      console.error("Error fetching consultation:", error);
    }
  }
};

  const handleVisitTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentDoctorId = selectDoctorRef.current?.value || "";
    setFeeFromDoctorAndVisitType(currentDoctorId, e.target.value);
  };

  // Search CNIC handler - called on input change
  const handleSearchCnicChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const cnic = e.target.value;
    setSearchCnic(cnic);
    setPatientFound(false);
    setSearchedPatient(null);

    if (cnic.length === 13) {
      setSearchLoading(true);
      try {
        const result = await dispatch(getPatientByCNIC(cnic));
        if (result.meta.requestStatus === "fulfilled") {
          const patientData =
            result.payload?.patient || result.payload?.data || result.payload;
          if (
            patientData &&
            (patientData.id ||
              patientData.cnic ||
              patientData.fullName ||
              patientData.full_name)
          ) {
            setPatientFound(true);
            setSearchedPatient(patientData);
          }
        }
      } catch (error) {
        console.error("Error searching patient:", error);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleSearchKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && patientFound && searchedPatient) {
      e.preventDefault();
      setSearchLoading(true);

      try {
     
        // Fill basic patient information
        if (fullNameRef.current)
          fullNameRef.current.value =
            searchedPatient.fullName || searchedPatient.full_name || "";
        if (fatherNameRef.current)
          fatherNameRef.current.value =
            searchedPatient.fatherName || searchedPatient.father_name || "";
        if (ageRef.current)
          ageRef.current.value =
            searchedPatient.age?.toString().replace(" Years", "") || "";
        if (genderRef.current)
          genderRef.current.value = searchedPatient.gender || "";
        if (addressRef.current)
          addressRef.current.value = searchedPatient.address || "";
        if (phoneNumberRef.current)
          phoneNumberRef.current.value =
            searchedPatient.phoneNumber || searchedPatient.phone_number || "";
        if (cnicRef.current) cnicRef.current.value = searchedPatient.cnic || "";

        toast.success("Patient data loaded! Now select a doctor to auto-set follow-up type.");
      } catch (error) {
        toast.error("Error loading patient data");
        console.error("Error fetching patient visit:", error);
      } finally {
        setSearchLoading(false);
      }
    }
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

  const handleRegister = async () => {
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

    if (cnicRef.current?.value.length !== 13) {
      toast.error("Please enter a valid CNIC (13 digits)");
      cnicRef.current?.focus();
      cnicRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

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
        const errorMessage =
          typeof patientResult.payload === "string"
            ? patientResult.payload
            : (patientResult.payload as any)?.message ||
              "Failed to create/update patient";
        toast.error(errorMessage);
        setIsSubmitting(false);
        return;
      }

      if ((patientResult.payload as any)?.mismatchWarning) {
        toast.error(
          (patientResult.payload as any)?.warningMessage ||
            "CNIC is already registered with a different name",
        );
        setIsSubmitting(false);
        return;
      }

      console.log("Patient Result Payload:", patientResult.payload);

      const patientId = patientResult.payload?.data?.id || "";
      console.log("Extracted Patient ID:", patientId);

      if (!patientId) {
        console.error(
          "Patient ID not found in response:",
          patientResult.payload,
        );
        toast.error("Failed to extract patient ID from response");
        setIsSubmitting(false);
        return;
      }

      console.log("Extracted Patient ID:", patientId);

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

      // Backend response structure: {success: true, message: '...', data: {...}}
      const createdVisit = (visitResult.payload as any)?.data || {};

      // Try to get token number from different possible response structures
      const tokenNo = createdVisit.tokenNo || "00";
      

      console.log("Created Visit Data:", createdVisit);
      console.log("Token No:", tokenNo);

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
        visitType: (() => {
          const vt =
            createdVisit.visitType || visitTypeRef.current?.value || "new";
          if (vt === "NEW" || vt === "new") return "New";
          if (vt === "REVISIT" || vt === "revisit") return "Revisit";
          if (vt === "FOLLOWUP" || vt === "followup") return "Follow up";
          return "New";
        })() as TokenData["visitType"],
      };

      if (onRegister) {
        onRegister(newToken);
      }
      toast.success(`Token ${newToken.tokenNo} generated successfully!`);
      handleReset();
    } catch (error) {
      console.error("Error in handleRegister:", error);
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
    if (searchCnicRef.current) searchCnicRef.current.value = "";
    setPaymentStatus("pending");
    setSearchCnic("");
    setPatientFound(false);
    setSearchedPatient(null);
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
      searchCnicRef,
    },
    // State
    paymentStatus,
    setPaymentStatus,
    isSubmitting,
    // Search state
    searchCnic,
    patientFound,
    searchLoading,
    // Redux state
    activeDoctors,
    patientLoading,
    // Handlers
    handleDoctorChange,
    handleVisitTypeChange,
    handleRegister,
    handleReset,
    handleSearchCnicChange,
    handleSearchKeyDown,
  };
}

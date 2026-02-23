"use client";
import { useRef, useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import { TokenData } from "@/types/token";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeDoctor } from "@/redux/slices/doctorSlice";
import {
  createPatient,
  createPatientVisit,
} from "@/redux/slices/patientVisitSlice";

interface PatientRegistrationFormProps {
  onRegister?: (token: TokenData) => void;
}

function PatientRegistrationForm({
  onRegister,
}: PatientRegistrationFormProps) {
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
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { activeDoctors } = useAppSelector((state) => state.doctor);
  const { loading: patientLoading } = useAppSelector(
    (state) => state.patientVisit,
  );

  useEffect(() => {
    dispatch(activeDoctor());
  }, [dispatch]);

  const setFeeFromDoctorAndVisitType = (doctorId: string, visitType: string) => {
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

  const handleDoctorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentVisitType = visitTypeRef.current?.value || "";
    setFeeFromDoctorAndVisitType(e.target.value, currentVisitType);
  };

  const handleVisitTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const currentDoctorId = selectDoctorRef.current?.value || "";
    setFeeFromDoctorAndVisitType(currentDoctorId, e.target.value);
  };

  const handleRegister = async () => {
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
      const patientId =
        patientResult.payload?.data?.id|| "";

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
          doctorName: selectedDoctor?.full_name || "",
          specialization: selectedDoctor?.specialization || "General Physician",
          roomNo: selectedDoctor?.room_number || "N/A",
          fee: consultationFeeRef.current?.value || "0",
          isPaid: paymentStatus === "paid",
          visitType: visitTypeEnum as any,
          patientId: patientId,
          doctorId: doctorId,
          phoneNumber: phoneNumberRef.current?.value || "",
          address: addressRef.current?.value || "",
          consultationFee: parseFloat(consultationFeeRef.current?.value || "0"),
          discount: parseFloat(discountRef.current?.value || "0"),
          paymentStatus: paymentStatus as "pending" | "paid",
        } as any),
      );

      if (visitResult.meta.requestStatus === "rejected") {
        toast.error((visitResult.payload as string) || "Failed to create patient visit");
        setIsSubmitting(false);
        return;
      }

      const createdVisit =
        (visitResult.payload as any)?.visit
        {};

      const resolvedTokenNo = String(createdVisit.tokenNo || "").padStart(2, "0");

      const newToken: TokenData = {
        tokenNo: resolvedTokenNo,
        patientName: createdVisit.patientName || fullNameRef.current?.value || "",
        fatherName: createdVisit.fatherName || fatherNameRef.current?.value || "",
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
        fee: String(createdVisit.consultationFee || consultationFeeRef.current?.value || "0"),
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

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      <div className="mb-6 shrink-0">
        <Input
          placeholder="Search Old Patient / CNIC"
          icon={<Search />}
          className="w-full bg-gray-50/50"
        />
      </div>

      <div className="custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input placeholder="Full Name" label="Full Name" ref={fullNameRef} />
          <Input
            placeholder="Father Name"
            label="Father Name"
            ref={fatherNameRef}
          />
          <Input type="number" placeholder="Age" label="Age" ref={ageRef} />
          <Select
            ref={genderRef}
            label="Gender"
            placeholder="Gender"
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />

          <Input placeholder="Address" label="Address" ref={addressRef} />
          <Input
            placeholder="Phone Number"
            type="tel"
            label="Phone Number"
            ref={phoneNumberRef}
          />

          <Select
            ref={selectDoctorRef}
            label="Select Doctor"
            placeholder="Select Doctor"
            onChange={handleDoctorChange}
            options={activeDoctors.map((doctor) => ({
              value: doctor.id || "",
              label: `${doctor.full_name} (Room: ${doctor.room_number})`,
            }))}
          />
          <Input placeholder="CNIC" label="CNIC" ref={cnicRef} />

          <Select
            ref={visitTypeRef}
            label="Visit Type"
            placeholder="Visit Type"
            onChange={handleVisitTypeChange}
            options={[
              { value: "new", label: "New Case" },
              { value: "revisit", label: "Revisit" },
              { value: "followup", label: "Follow Up" },
            ]}
          />

          <Input
            placeholder="Discount"
            type="number"
            label="Discount"
            ref={discountRef}
          />
          <Input
            placeholder="Consultation Fee"
            type="number"
            label="Consultation Fee"
            ref={consultationFeeRef}
            readOnly
            disabled
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="pending"
                  checked={paymentStatus === "pending"}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Pending</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentStatus"
                  value="paid"
                  checked={paymentStatus === "paid"}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Paid</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-4 shrink-0">
        <Button
          variant="secondary"
          size="md"
          onClick={handleReset}
          disabled={isSubmitting || patientLoading}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleRegister}
          disabled={isSubmitting || patientLoading}
        >
          {isSubmitting || patientLoading ? "Loading..." : "Generate Token"}
        </Button>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;

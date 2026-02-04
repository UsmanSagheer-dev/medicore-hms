"use client";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Search } from "lucide-react";
import { TokenData } from "@/types/token";

interface PatientRegistrationFormProps {
  onRegister: (token: TokenData) => void;
  lastTokenNo: number;
}

function PatientRegistrationForm({
  onRegister,
  lastTokenNo,
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

  const handleRegister = () => {
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
    if (!validateField(selectDoctorRef, "Doctor")) return;
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

    const doctorElement = selectDoctorRef.current;
    const selectedDoctorText =
      doctorElement?.options[doctorElement.selectedIndex].text || "";
    const roomMatch = selectedDoctorText.match(/Room: (\d+)/);
    const roomNo = roomMatch ? roomMatch[1] : "N/A";
    const doctorName = selectedDoctorText.split("(")[0].trim();

    const newToken: TokenData = {
      tokenNo: (lastTokenNo + 1).toString().padStart(2, "0"),
      patientName: fullNameRef.current?.value || "",
      fatherName: fatherNameRef.current?.value || "",
      age: `${ageRef.current?.value} Years`,
      gender: genderRef.current?.value || "",
      cnic: cnicRef.current?.value || "",
      doctorName: doctorName,
      specialization: "General Physician",
      roomNo: roomNo,
      date: new Date().toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fee: consultationFeeRef.current?.value || "0",
      isPaid: paymentStatus === "paid",
      visitType:
        visitTypeRef.current?.value === "new"
          ? "New"
          : visitTypeRef.current?.value === "revisit"
            ? "Revisit"
            : "Follow up",
    };

    onRegister(newToken);
    toast.success(`Token ${newToken.tokenNo} generated successfully!`);
    handleReset();
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

      <div className="  custom-scrollbar ">
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
            options={[
              { value: "1", label: "Dr. John Doe (Room: 101)" },
              { value: "2", label: "Dr. Jane Smith (Room: 102)" },
              { value: "3", label: "Dr. Robert Johnson (Room: 104)" },
            ]}
          />
          <Input placeholder="CNIC" label="CNIC" ref={cnicRef} />

          <Select
            ref={visitTypeRef}
            label="Visit Type"
            placeholder="Visit Type"
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
        <Button variant="secondary" size="md" onClick={handleReset}>
          Reset
        </Button>
        <Button variant="primary" size="md" onClick={handleRegister}>
          Generate Token
        </Button>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;

"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { Search, CheckCircle, Loader2 } from "lucide-react";
import { TokenData } from "@/types/token";
import { usePatientRegistrationForm } from "@/hooks/usePatientRegistrationForm";

interface PatientRegistrationFormProps {
  onRegister?: (token: TokenData) => void;
}

function PatientRegistrationForm({
  onRegister,
}: PatientRegistrationFormProps) {
  const {
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
    paymentStatus,
    setPaymentStatus,
    isSubmitting,
    searchCnic,
    patientFound,
    searchLoading,
    activeDoctors,
    patientLoading,
    handleDoctorChange,
    handleVisitTypeChange,
    handleRegister,
    handleReset,
    handleSearchCnicChange,
    handleSearchKeyDown,
  } = usePatientRegistrationForm({ onRegister });


  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
      <div className="mb-6 shrink-0">
        <Input
          ref={searchCnicRef}
          placeholder="Search Old Patient / CNIC (Press Enter to fill)"
          icon={<Search />}
          suffixIcon={
            searchLoading ? (
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            ) : patientFound ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : null
          }
          className="w-full bg-gray-50/50"
          value={searchCnic}
          onChange={handleSearchCnicChange}
          onKeyDown={handleSearchKeyDown}
          maxLength={13}
        />
        {patientFound && (
          <p className="text-sm text-green-600 mt-1">
            Patient found! Press Enter to auto-fill the form.
          </p>
        )}
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
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Generate Token"}
        </Button>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;

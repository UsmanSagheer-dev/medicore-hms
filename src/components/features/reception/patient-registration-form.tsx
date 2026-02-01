'use client'
import { useRef } from "react";
import { toast } from "react-hot-toast";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";


function PatientRegistrationForm() {
    const fullNameRef = useRef<HTMLInputElement>(null);
    const fatherNameRef = useRef<HTMLInputElement>(null);
    const dateOfBirthRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const phoneNumberRef = useRef<HTMLInputElement>(null);
    const selectDoctorRef = useRef<HTMLSelectElement>(null);
    const cnicRef = useRef<HTMLInputElement>(null);
    const visitDateRef = useRef<HTMLInputElement>(null);
    const visitTypeRef = useRef<HTMLSelectElement>(null);
    const discountRef = useRef<HTMLInputElement>(null);
    const consultationFeeRef = useRef<HTMLInputElement>(null);
    const paymentStatusRef = useRef<HTMLSelectElement>(null);

    const handleRegister=()=>{
        if(!fullNameRef.current?.value || !fatherNameRef.current?.value || !dateOfBirthRef.current?.value || !genderRef.current?.value || !addressRef.current?.value || !phoneNumberRef.current?.value || !selectDoctorRef.current?.value || !cnicRef.current?.value || !visitDateRef.current?.value || !visitTypeRef.current?.value || !discountRef.current?.value || !consultationFeeRef.current?.value || !paymentStatusRef.current?.value){
            toast("Please fill all the fields");
            return;
        }
        
    }
  return (
    <div className="w-1/2  p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Top Search Bar */}
      <div className="mb-6">
        <Input placeholder="Search Old Patient / CNIC" className="w-full bg-gray-50/50" />
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Row 1 */}
        <Input placeholder="Full Name" label="Full Name" ref={fullNameRef} />
        <Input placeholder="Father Name" label="Father Name" ref={fatherNameRef} />

        {/* Row 2 */}
        <Input type="date" placeholder="Date of Birth" label="Date of Birth" ref={dateOfBirthRef} />
        <Select
          label="Gender"
          placeholder="Gender"
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />

        {/* Row 3 */}
        <Input placeholder="Address" label="Address" ref={addressRef} />
        <Input placeholder="Phone Number" type="tel" label="Phone Number" ref={phoneNumberRef} />

        {/* Row 4 */}
        <Select
          label="Select Doctor"
          placeholder="Select Doctor"
          options={[
            { value: "1", label: "Dr. John Doe (Room: 101)" },
            { value: "2", label: "Dr. Jane Smith (Room: 102)" },
            { value: "3", label: "Dr. Robert Johnson (Room: 104)" },
          ]}
        />
        <Input placeholder="CNIC" label="CNIC" ref={cnicRef} />

        {/* Row 5 */}
        <Input type="date" placeholder="Visit Date" label="Visit Date" ref={visitDateRef} />
        <Select
          label="Visit Type"
          placeholder="Visit Type"
          options={[
            { value: "new", label: "New Case" },
            { value: "revisit", label: "Revisit" },
            { value: "followup", label: "Follow Up" },
          ]}
        />

        {/* Row 6 */}
        <Input placeholder="Discount" type="number" label="Discount" ref={discountRef} />
        <Input placeholder="Consultation Fee" type="number" label="Consultation Fee" ref={consultationFeeRef} />

        {/* Row 7 */}
        <div className="col-span-1"></div> {/* Spacer or place for action buttons later */}
        <Select
          label="Payment Status"
          placeholder="Payment Status"
          options={[
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
          ]}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4">
        <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            Reset
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm" onClick={handleRegister}>
            Register Patient
        </button>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;

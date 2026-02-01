import TokenCard from '@/components/ui/TokenCard';
import { TokenData } from '@/types/token';

function LiveTokenDisplay() {
  const tokens: TokenData[] = [
    {
      tokenNo: "045",
      patientName: "Muhammad Ali Khan",
      fatherName: "Ghulam Mustafa",
      age: "33 Years",
      gender: "Male",
      cnic: "35202-1234567-8",
      doctorName: "Dr. Usman Ahmed",
      specialization: "Cardiology",
      roomNo: "05",
      date: "31-Jan-2026",
      time: "05:45 PM",
      fee: "1200",
      isPaid: true
    },
    {
      tokenNo: "046",
      patientName: "Sara Ahmed",
      fatherName: "Zubair Ahmed",
      age: "25 Years",
      gender: "Female",
      cnic: "35202-9876543-1",
      doctorName: "Dr. Jane Smith",
      specialization: "General Physician",
      roomNo: "02",
      date: "31-Jan-2026",
      time: "06:00 PM",
      fee: "1000",
      isPaid: false
    },
    {
      tokenNo: "047",
      patientName: "Ahmed Raza",
      fatherName: "Irfan Raza",
      age: "12 Years",
      gender: "Male",
      cnic: "35202-5555555-5",
      doctorName: "Dr. Robert",
      specialization: "Pediatrics",
      roomNo: "04",
      date: "31-Jan-2026",
      time: "06:15 PM",
      fee: "800",
      isPaid: true
    }
  ];

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4 p-4 bg-gray-50 border-l border-gray-200 overflow-y-auto max-h-[calc(100vh-30px)] rounded-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-2 border-b pb-2">Live Token Queue</h2>
      <div className="flex flex-col gap-4 items-center">
        {tokens.map((token) => (
          <TokenCard key={token.tokenNo} {...token} />
        ))}
      </div>
    </div>
  );
}

export default LiveTokenDisplay;
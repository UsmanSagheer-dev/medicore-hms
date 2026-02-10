"use client";

import DoctorTokenCard from "./token-card";

interface TokenListProps {
  doctorId: string;
}

const TokenList = ({ doctorId }: TokenListProps) => {
  const tokens: {
    id: string;
    patientName: string;
    tokenNumber: string;
    time: string;
    status: string;
    visitType: "New" | "Follow up" | "Revisit";
  }[] = [
    {
      id: "1",
      patientName: "Muhammad Ali",
      tokenNumber: "001",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "2",
      patientName: "Sara Khan",
      tokenNumber: "002",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "3",
      patientName: "Ahmed Raza",
      tokenNumber: "003",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
          {
      id: "4",
      patientName: "Muhammad Ali",
      tokenNumber: "004",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "5",
      patientName: "Sara Khan",
      tokenNumber: "005",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "6",
      patientName: "Ahmed Raza",
      tokenNumber: "006",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "7",
      patientName: "Muhammad Ali",
      tokenNumber: "007",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "8",
      patientName: "Sara Khan",
      tokenNumber: "008",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "9",
      patientName: "Ahmed Raza",
      tokenNumber: "009",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "10",
      patientName: "Muhammad Ali",
      tokenNumber: "010",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "11",
      patientName: "Sara Khan",
      tokenNumber: "011",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "12",
      patientName: "Ahmed Raza",
      tokenNumber: "012",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "13",
      patientName: "Muhammad Ali",
      tokenNumber: "013",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "14",
      patientName: "Sara Khan",
      tokenNumber: "014",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "15",
      patientName: "Ahmed Raza",
      tokenNumber: "015",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "16",
      patientName: "Muhammad Ali",
      tokenNumber: "016",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "17",
      patientName: "Sara Khan",
      tokenNumber: "017",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "18",
      patientName: "Ahmed Raza",
      tokenNumber: "018",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "19",
      patientName: "Muhammad Ali",
      tokenNumber: "019",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "20",
      patientName: "Sara Khan",
      tokenNumber: "020",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "21",
      patientName: "Ahmed Raza",
      tokenNumber: "021",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "22",
      patientName: "Muhammad Ali",
      tokenNumber: "022",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "23",
      patientName: "Sara Khan",
      tokenNumber: "023",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "24",
      patientName: "Ahmed Raza",
      tokenNumber: "024",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "25",
      patientName: "Muhammad Ali",
      tokenNumber: "025",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "26",
      patientName: "Sara Khan",
      tokenNumber: "026",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "27",
      patientName: "Ahmed Raza",
      tokenNumber: "027",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "28",
      patientName: "Muhammad Ali",
      tokenNumber: "028",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "29",
      patientName: "Sara Khan",
      tokenNumber: "029",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "30",
      patientName: "Ahmed Raza",
      tokenNumber: "030",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "31",
      patientName: "Muhammad Ali",
      tokenNumber: "031",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
    {
      id: "32",
      patientName: "Sara Khan",
      tokenNumber: "032",
      time: "10:45 AM",
      status: "waiting",
      visitType: "Follow up",
    },
    {
      id: "33",
      patientName: "Ahmed Raza",
      tokenNumber: "033",
      time: "11:00 AM",
      status: "called",
      visitType: "Revisit",
    },
    {
      id: "34",
      patientName: "Muhammad Ali",
      tokenNumber: "034",
      time: "10:30 AM",
      status: "waiting",
      visitType: "New",
    },
  ];

  return (
    <div className="space-y-4">
      {tokens.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No patients in the queue for today.
        </div>
      ) : (
        tokens.map((token) => <DoctorTokenCard key={token.id} token={token} />)
      )}
    </div>
  );
};

export default TokenList;

"use client";

import React from "react";
import DoctorTokenCard from "./token-card";

interface TokenListProps {
  doctorId: string;
}

const TokenList = ({ doctorId }: TokenListProps) => {
  // Mock data - In reality, this would be fetched from an API or Socket
  const tokens = [
    { id: "1", patientName: "Muhammad Ali", tokenNumber: "001", time: "10:30 AM", status: "waiting" },
    { id: "2", patientName: "Sara Khan", tokenNumber: "002", time: "10:45 AM", status: "waiting" },
    { id: "3", patientName: "Ahmed Raza", tokenNumber: "003", time: "11:00 AM", status: "called" },
  ];

  return (
    <div className="space-y-4">
      {tokens.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No patients in the queue for today.
        </div>
      ) : (
        tokens.map((token) => (
          <DoctorTokenCard key={token.id} token={token} />
        ))
      )}
    </div>
  );
};

export default TokenList;

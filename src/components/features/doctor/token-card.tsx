"use client";

import React from "react";
import { CheckCircle, Clock, User } from "lucide-react";

interface TokenCardProps {
  token: {
    id: string;
    patientName: string;
    tokenNumber: string;
    time: string;
    status: string;
  };
}

const DoctorTokenCard = ({ token }: TokenCardProps) => {
  return (
    <div className="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
          {token.tokenNumber}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            {token.patientName}
          </h4>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Registered at {token.time}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {token.status === "waiting" ? (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Call Patient
          </button>
        ) : (
          <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
            <CheckCircle className="w-4 h-4" />
            In Consultation
          </span>
        )}
      </div>
    </div>
  );
};

export default DoctorTokenCard;

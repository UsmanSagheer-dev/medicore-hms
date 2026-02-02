import React from "react";
import { TokenData } from "@/types/token";

const TokenCard: React.FC<TokenData> = ({
  tokenNo,
  patientName,
  fatherName,
  age,
  gender,
  cnic,
  doctorName,
  specialization,
  roomNo,
  date,
  time,
  fee,
  isPaid,
  type = "follow-up/New",
}) => {
  return (
    <div className="max-w-full w-full bg-white border border-black rounded-lg overflow-hidden font-sans text-black shadow-md relative print:shadow-none print:border shrink-0">
      <div className="absolute top-2 right-2 border border-black rounded-full px-2 py-0.5 text-[10px] font-bold bg-white">
        {type}
      </div>

      <div className="p-3">
        <div className="text-center border-b border-black pb-1.5 mb-2">
          <h1 className="text-sm font-bold uppercase tracking-wider leading-tight">
            Usman Medical Center
          </h1>
          <p className="text-[10px] font-medium leading-none">
            Gulshan-e-Iqbal, Karachi
          </p>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-xs font-bold uppercase leading-none">
            Token No: <span className="text-xl ml-1">{tokenNo}</span>
          </h2>
        </div>

        <div className="space-y-0.5 text-[11px] font-semibold leading-tight">
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">Patient:</span>
            <span>{patientName}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">Father:</span>
            <span>{fatherName}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">
              Age/Gender:
            </span>
            <span>
              {age} / {gender}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">CNIC:</span>
            <span>{cnic}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">Doctor:</span>
            <span>{doctorName}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">
              Specialty:
            </span>
            <span>{specialization}</span>
          </div>
          <div className="flex gap-2">
            <span className="min-w-[65px] opacity-70 font-bold">Room No:</span>
            <span>{roomNo}</span>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-dotted border-gray-400">
            <div className="opacity-70 text-[10px]">
              {date} | {time}
            </div>
            <div className="text-[10px]">
              Fee: Rs.{fee} ({isPaid ? "Paid" : "Pending"})
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 pt-1 border-t border-black text-center font-bold text-xs uppercase">
          <p>Please proceed to Room {roomNo}</p>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;

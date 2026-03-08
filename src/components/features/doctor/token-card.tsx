"use client";

import { Clock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { callPatient } from "@/redux/slices/patientVisitSlice";
import { useRouter, useParams } from "next/navigation";

interface TokenCardProps {
  token: {
    id: string;
    patientName: string;
    tokenNumber: string;
    time: string;
    status: string;
    visitType: "New" | "Follow up" | "Revisit";
  };
}

const DoctorTokenCard = ({ token }: TokenCardProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  const { loading } = useAppSelector((state) => state.patientVisit);

  const handleCallPatient = async () => {
    router.push(`/dashboard/doctor/${doctorId}/consultation/${token.id}`);
    
    try {
      await dispatch(callPatient(token.id)).unwrap();
    } catch (error) {
      console.error("Error calling patient:", error);
    }
  };

  const handleResumeConsultation = () => {
    router.push(`/dashboard/doctor/${doctorId}/consultation/${token.id}`);
  };

  const getVisitTypeStyles = (type: string) => {
    switch (type) {
      case "New":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Follow up":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Revisit":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="group bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-slate-50 transition-all duration-200 mb-3 last:mb-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-blue-600 flex flex-col items-center justify-center text-white shrink-0">
            <span className="text-[9px] font-bold uppercase opacity-80">
              TOKEN
            </span>
            <span className="text-lg font-bold leading-tight">
              {token.tokenNumber}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-gray-900">{token.patientName}</h4>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getVisitTypeStyles(token.visitType)}`}
              >
                {token.visitType}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                ID: P-{token.id}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {token.time}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {token.status === "WAITING" ? (
            <button 
              onClick={handleCallPatient}
              disabled={loading}
              className="px-5 py-2 bg-gray-900 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Calling..." : "Call Patient"}
            </button>
          ) : token.status === "INPROGRESS" ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 font-bold text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                IN PROGRESS
              </div>
              <button
                onClick={handleResumeConsultation}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Resume
              </button>
            </div>
          ) : token.status === "COMPLETED" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-bold text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              COMPLETED
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg border border-gray-200 font-bold text-xs uppercase">
              {token.status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorTokenCard;

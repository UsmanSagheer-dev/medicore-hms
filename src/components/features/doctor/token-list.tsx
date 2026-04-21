"use client";

import { useEffect, useMemo } from "react";
import DoctorTokenCard from "./token-card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVistByDoctor } from "@/redux/slices/patientVisitSlice";
import { RefreshCw } from "lucide-react";

interface TokenListProps {
  doctorId: string;
}

const TokenList = ({ doctorId }: TokenListProps) => {
  const dispatch = useAppDispatch();
  const { visits, loading, error } = useAppSelector((state) => state.patientVisit);

  useEffect(() => {
    if (!doctorId) {
      return;
    }

    dispatch(getVistByDoctor(doctorId));
  }, [dispatch, doctorId]);

  const handleRefresh = () => {
    if (doctorId) {
      dispatch(getVistByDoctor(doctorId));
    }
  };

  const tokens = useMemo(
    () =>
      visits.map((visit, index) => ({
        id: visit.id || String(index + 1),
        patientId: (visit as any).patientId,
        patientName: visit.patientName || "Unknown Patient",
        tokenNumber: String((visit as any).tokenNo || (visit as any).tokenNumber || index + 1).padStart(3, "0"),
        time: visit.time || "--:--",
        status: ((visit as any).status as string) || "waiting",
        visitType: visit.visitType || "NEW",
      })),
    [visits]
  );

  const activeTokens= useMemo(() => tokens.filter((token) => token.status === "WAITING" || token.status ==="INPROGRESS"), [tokens]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
 
      </div>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading queue...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : tokens.length === 0 || activeTokens.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No patient list
        </div>
      ) : (
        activeTokens.map((token) => <DoctorTokenCard key={token.id} token={token} />)
      )}
    </div>
  );
};

export default TokenList;

"use client";

import { useEffect, useMemo } from "react";
import DoctorTokenCard from "./token-card";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVistByDoctor } from "@/redux/slices/patientVisitSlice";


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

  const tokens = useMemo(
    () =>
      visits.map((visit, index) => ({
        id: visit.id || String(index + 1),
        patientName: visit.patientName || "Unknown Patient",
        tokenNumber: String((visit as any).tokenNo || (visit as any).tokenNumber || index + 1).padStart(3, "0"),
        time: visit.time || "--:--",
        status: ((visit as any).status as string) || "waiting",
        visitType: visit.visitType || "New",
      })),
    [visits]
  );

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading queue...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : tokens.length === 0 ? (
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

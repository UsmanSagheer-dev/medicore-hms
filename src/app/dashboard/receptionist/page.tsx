"use client";
import React, { useEffect, useMemo } from "react";
import LiveTokenDisplay from "@/components/features/reception/live-token-display";
import PatientRegistrationForm from "@/components/features/reception/patient-registration-form";
import { TokenData } from "@/types/token";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getTodayVisits } from "@/redux/slices/patientVisitSlice";

function ReceptionistDashboard() {
    const dispatch = useAppDispatch();
    const { todayVisits } = useAppSelector((state) => state.patientVisit);

    useEffect(() => {
        dispatch(getTodayVisits());
    }, [dispatch]);

    const tokens = useMemo<TokenData[]>(
        () => {
            if (!Array.isArray(todayVisits)) return [];
            
            return todayVisits
                .filter((visit) => visit && typeof visit === "object")
                .map((visit) => ({
                    tokenNo: String((visit as any).tokenNo || "").padStart(2, "0"),
                    patientName: visit.patientName || "",
                    fatherName: visit.fatherName || "",
                    age: visit.age || "",
                    gender: visit.gender || "",
                    cnic: visit.cnic || "",
                    doctorName: visit.doctorName || "",
                    specialization: visit.specialization || "",
                    roomNo: visit.roomNo || "",
                    date: (visit as any).date || "",
                    time: (visit as any).time || "",
                    fee: String((visit as any).consultationFee || "0"),
                    isPaid: Boolean(visit.isPaid),
                    visitType:
                        (visit.visitType as TokenData["visitType"]) || "New",
                }))
                .sort((a, b) => Number(a.tokenNo) - Number(b.tokenNo));
        },
        [todayVisits],
    );

    return (
        <div className="h-full bg-white overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-4 h-auto md:h-full p-1">
                <div className="w-full md:flex-2 min-w-0 h-full">
                    <PatientRegistrationForm />
                </div>
                <div className="w-full md:flex-1 min-w-0 h-full">
                    <LiveTokenDisplay tokens={tokens} />
                </div>
            </div>
        </div>
    );
}

export default ReceptionistDashboard;

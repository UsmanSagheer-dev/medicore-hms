"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Users } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVistByDoctor } from "@/redux/slices/patientVisitSlice";
import { useParams } from "next/navigation";
import PatientCard from "@/components/features/patientCard/PatientCard";

const PatientsPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const doctorId = params.id as string;
  const { visits, loading, error } = useAppSelector((state) => state.patientVisit);

  useEffect(() => {
    if (doctorId) {
      dispatch(getVistByDoctor(doctorId));
    }
  }, [dispatch, doctorId]);

  // Group patients by status
  const waiting = visits.filter((p: any) => p.status === "WAITING");
  const inProgress = visits.filter((p: any) => p.status === "INPROGRESS");
  const completed = visits.filter((p: any) => p.status === "COMPLETED");

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-amber-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" /> My Patients
        </h1>
        {loading ? (
          <div className="text-center text-blue-600 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : visits.length === 0 ? (
          <div className="text-center text-gray-500">No patients found.</div>
        ) : (
          <>
            <PatientGroup title="Waiting" patients={waiting} />
            <PatientGroup title="In Progress" patients={inProgress} />
            <PatientGroup title="Completed" patients={completed} />
          </>
        )}
      </div>
    </div>
  );
};

const PatientGroup = ({ title, patients }: { title: string; patients: any[] }) => (
  patients.length === 0 ? null : (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title} ({patients.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  )
);


export default PatientsPage;

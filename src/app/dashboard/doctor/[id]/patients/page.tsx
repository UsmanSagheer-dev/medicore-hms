"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVistByDoctor } from "@/redux/slices/patientVisitSlice";
import { useParams } from "next/navigation";
import PatientCard from "@/components/features/patientCard/PatientCard";

const PatientsPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const doctorId = params.id as string;
  const { visits, loading, error } = useAppSelector(
    (state) => state.patientVisit,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "WAITING" | "INPROGRESS" | "COMPLETED" | "CANCELED"
  >("WAITING");

  useEffect(() => {
    if (doctorId) {
      dispatch(getVistByDoctor(doctorId));
    }
  }, [dispatch, doctorId]);

  const getNormalizedStatus = (status: unknown) => {
    const value = `${status ?? ""}`.toUpperCase();

    if (value === "COMPLETE" || value === "COMPLETED") return "COMPLETED";
    if (value === "CANCEL" || value === "CANCELLED" || value === "CANCELED")
      return "CANCELED";
    if (value === "INPROGRESS" || value === "IN_PROGRESS") return "INPROGRESS";
    if (value === "WAITING") return "WAITING";

    return value;
  };

  const filteredVisits = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return visits.filter((visit: any) => {
      const patientName = `${visit?.patientName ?? ""}`.trim().toLowerCase();
      const fullName = `${visit?.firstName ?? ""} ${visit?.lastName ?? ""}`
        .trim()
        .toLowerCase();
      const nestedPatientName =
        `${visit?.patient?.firstName ?? ""} ${visit?.patient?.lastName ?? ""}`
          .trim()
          .toLowerCase();
      const genericName = `${visit?.patient?.name ?? ""}`.trim().toLowerCase();
      const cnic = `${visit?.cnic ?? ""}`.toLowerCase();
      const phoneNumber = `${visit?.phoneNumber ?? ""}`.toLowerCase();
      const tokenNo = `${visit?.tokenNo ?? ""}`.toLowerCase();

      const matchesSearch =
        query.length === 0 ||
        patientName.includes(query) ||
        fullName.includes(query) ||
        nestedPatientName.includes(query) ||
        genericName.includes(query) ||
        cnic.includes(query) ||
        phoneNumber.includes(query) ||
        tokenNo.includes(query);

      const visitStatus = getNormalizedStatus(visit?.status);
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "WAITING" && visitStatus === "WAITING") ||
        (statusFilter === "INPROGRESS" && visitStatus === "INPROGRESS") ||
        (statusFilter === "COMPLETED" && visitStatus === "COMPLETED") ||
        (statusFilter === "CANCELED" && visitStatus === "CANCELED");

      return matchesSearch && matchesStatus;
    });
  }, [visits, searchTerm, statusFilter]);

  // Group patients by status
  const waiting = filteredVisits.filter(
    (p: any) => getNormalizedStatus(p.status) === "WAITING",
  );
  const inProgress = filteredVisits.filter(
    (p: any) => getNormalizedStatus(p.status) === "INPROGRESS",
  );
  const completed = filteredVisits.filter(
    (p: any) => getNormalizedStatus(p.status) === "COMPLETED",
  );
  const canceled = filteredVisits.filter(
    (p: any) => getNormalizedStatus(p.status) === "CANCELED",
  );

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-amber-50">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient by name"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "ALL"
                  | "WAITING"
                  | "INPROGRESS"
                  | "COMPLETED"
                  | "CANCELED",
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:w-56"
          >
            <option value="WAITING">Waiting</option>
            <option value="INPROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
            <option value="ALL">All Statuses</option>
          </select>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" /> My Patients
        </h1>
        {loading ? (
          <div className="text-center text-blue-600 font-semibold">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-semibold">{error}</div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center text-gray-500">No patients found.</div>
        ) : (
          <>
            <PatientGroup title="Waiting" patients={waiting} />
            <PatientGroup title="In Progress" patients={inProgress} />
            <PatientGroup title="Completed" patients={completed} />
            <PatientGroup title="Canceled" patients={canceled} />
          </>
        )}
      </div>
    </div>
  );
};

const PatientGroup = ({
  title,
  patients,
}: {
  title: string;
  patients: any[];
}) =>
  patients.length === 0 ? null : (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {title} ({patients.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );

export default PatientsPage;

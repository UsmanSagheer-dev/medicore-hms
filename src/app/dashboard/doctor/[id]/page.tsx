"use client";
import { useState, useEffect, useMemo } from "react";

import { useParams, redirect } from "next/navigation";
import TokenList from "@/components/features/doctor/token-list";
import Sidebar from "@/components/layout/Sidebar";
import {
  Clock,
  User,
  ChevronRight,
  Activity,
  Users,
  RefreshCw,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  getVistByDoctor,
  endDoctorDay,
} from "@/redux/slices/patientVisitSlice";

const DoctorDashboard = () => {
  const params = useParams();
  const doctorId = params.id;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { visits, loading } = useAppSelector((state) => state.patientVisit);

  const todayVisits = useMemo(() => {
    const now = new Date();

    return visits.filter((visit) => {
      const rawDate = visit.createdAt || visit.date;
      if (!rawDate) return false;

      let visitDate = new Date(rawDate);

      // Fallback for DD/MM/YYYY or DD-MM-YYYY formats
      if (Number.isNaN(visitDate.getTime())) {
        const match = rawDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
        if (!match) return false;

        const [, day, month, year] = match;
        visitDate = new Date(Number(year), Number(month) - 1, Number(day));
      }

      return (
        visitDate.getFullYear() === now.getFullYear() &&
        visitDate.getMonth() === now.getMonth() &&
        visitDate.getDate() === now.getDate()
      );
    });
  }, [visits]);

  const patientStats = useMemo(() => {
    const total = todayVisits.length;
    const waiting = todayVisits.filter(
      (visit) => (visit as any).status === "WAITING",
    ).length;
    const seen = todayVisits.filter(
      (visit) => (visit as any).status === "COMPLETED",
    ).length;

    return { total, waiting, seen };
  }, [todayVisits]);

  const handleEndDay = async () => {
    const result = await dispatch(endDoctorDay(doctorId as string));
    if (endDoctorDay.fulfilled.match(result)) {
      alert("Doctor's day ended successfully!");
    }
  };

  const handleRefresh = () => {
    if (doctorId) {
      dispatch(getVistByDoctor(doctorId as string));
    }
  };

  useEffect(() => {
    if (doctorId) {
      dispatch(getVistByDoctor(doctorId as string));
    }
  }, [dispatch, doctorId]);

  if (user?.doctor?.id && String(user.doctor.id) !== doctorId) {
    redirect("/unauthorized");
  }

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const doctorName = user?.name || "Doctor";

  return (
    <div className="flex h-full overflow-hidden " >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-6 px-4 pb-4 " style={{
        background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
      }}>
        <div className="max-w-full mx-auto w-full mb-6 flex items-end justify-end">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="max-w-full mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col h-full min-h-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Patient Queue
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        Manage your patients for today
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </span>
                      LIVE QUEUE
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/20">
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleEndDay}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      End Day
                    </button>
                  </div>
                  <TokenList doctorId={doctorId as string} />
                </div>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto pr-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Daily Summary
                </h3>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">
                        Total Patients
                      </p>
                      <p className="text-3xl font-black text-gray-900">
                        {String(patientStats.total).padStart(2, "0")}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-gray-400">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-2xl font-black text-blue-700">
                        {String(patientStats.seen).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">
                        Seen
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                      <p className="text-2xl font-black text-orange-700">
                        {String(patientStats.waiting).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] uppercase font-bold text-orange-600 tracking-widest">
                        Waiting
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed Patients Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  Completed Today
                  <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                    {patientStats.seen}
                  </span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {todayVisits
                    .filter((visit) => (visit as any).status === "COMPLETED")
                    .map((visit, index) => (
                      <div
                        key={visit.id || index}
                        className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            {String(
                              (visit as any).tokenNo || index + 1,
                            ).padStart(2, "0")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {visit?.patientName || "Unknown Patient"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {visit.visitType || "New"}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-600 font-medium">
                          completed
                        </span>
                      </div>
                    ))}
                  {patientStats.seen === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No completed patients yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

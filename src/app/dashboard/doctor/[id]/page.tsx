"use client";
import { useState, useEffect } from "react";

import { useParams } from "next/navigation";
import TokenList from "@/components/features/doctor/token-list";
import { Clock, User, ChevronRight, Activity, Users } from "lucide-react";

const DoctorDashboard = () => {
  const params = useParams();
  const doctorId = params.id;
  
  // Digital Clock Logic
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const doctorName = "Dr. Usman Sagheer";

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Doctor Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">Welcome back, <span className="text-blue-600 font-semibold">{doctorName}</span></p>
          </div>
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
             <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Clock className="w-5 h-5" />
             </div>
             <div className="pr-4">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider text-right">Current Time</p>
                <p className="text-xl font-mono font-bold text-blue-700 tabular-nums">
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Patient Queue</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Manage your patients for today</p>
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
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <TokenList doctorId={doctorId as string} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Daily Summary
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Total Patients</p>
                  <p className="text-3xl font-black text-gray-900">17</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-gray-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-2xl font-black text-blue-700">12</p>
                  <p className="text-[10px] uppercase font-bold text-blue-600 tracking-widest">Seen</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <p className="text-2xl font-black text-orange-700">05</p>
                  <p className="text-[10px] uppercase font-bold text-orange-600 tracking-widest">Waiting</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-4 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl text-left transition-all font-semibold flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  View Schedule
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full p-4 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl text-left transition-all font-semibold flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <Clock className="w-5 h-5" />
                  Patient Records
                </span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

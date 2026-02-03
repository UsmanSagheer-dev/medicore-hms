"use client";

import React from "react";
import { useParams } from "next/navigation";
import TokenList from "@/components/features/doctor/token-list";

const DoctorDashboard = () => {
  const params = useParams();
  const doctorId = params.id;

  // In a real app, you'd fetch doctor info using the ID
  const doctorName = "Dr. Usman Sagheer"; // Placeholder

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back, {doctorName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Patient Queue</h2>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                Live Updates
              </span>
            </div>
            <TokenList doctorId={doctorId as string} />
          </div>
        </div>

        {/* Stats/Info Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-medium opacity-90 mb-4">Daily Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm opacity-80">Patients Seen</p>
              </div>
              <div>
                <p className="text-3xl font-bold">5</p>
                <p className="text-sm opacity-80">Waiting</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-left transition-colors font-medium">
                View Schedule
              </button>
              <button className="w-full py-2 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-left transition-colors font-medium">
                Patient Records
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;

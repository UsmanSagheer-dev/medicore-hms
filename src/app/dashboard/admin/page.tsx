"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pendingDoctorRequests } from "@/redux/slices/doctorSlice";
import { RootState, AppDispatch } from "@/redux/store";
import {
  Users,
  UserPlus,
  Search,
  Settings,
  Trash2,
  Edit,
  ShieldCheck,
  Stethoscope,
  Briefcase,
} from "lucide-react";
import Button from "@/components/ui/Button";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");

  // Mock data for initial UI
  const stats = [
    {
      label: "Total Doctors",
      value: "12",
      icon: Stethoscope,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Receptionists",
      value: "08",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "New Requests",
      value: "05",
      icon: UserPlus,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Patients",
      value: "1,280",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const staffList = [
    {
      id: 1,
      name: "Dr. Usman Sagheer",
      role: "Doctor",
      specialty: "Cardiology",
      status: "Active",
      email: "usman@medicore.com",
    },
    {
      id: 2,
      name: "Zahid Ahmed",
      role: "Receptionist",
      specialty: "Front Desk",
      status: "Active",
      email: "zahid@medicore.com",
    },
    {
      id: 3,
      name: "Dr. Sarah Khan",
      role: "Doctor",
      specialty: "Pediatrics",
      status: "Inactive",
      email: "sarah@medicore.com",
    },
    {
      id: 4,
      name: "Maria Iqbal",
      role: "Receptionist",
      specialty: "Evening Shift",
      status: "Active",
      email: "maria@medicore.com",
    },
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { pendingRequests, loading, error } = useSelector(
    (state: RootState) => state.doctor,
  );

  useEffect(() => {
    dispatch(pendingDoctorRequests());
  }, [dispatch]);

  const requests = Array.isArray(pendingRequests) ? pendingRequests : [];

  const handleApprove = (id: any) => {};

  const handleReject = (id: any) => {};

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-shadow-sm">
            Admin Management
          </h1>
          <p className="mt-1 text-gray-500 font-medium">
            Monitor doctor requests and manage hospital staff.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="shadow-sm flex items-center gap-2"
          >
            <Settings size={18} />
            System Settings
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          Error: {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-black text-gray-900">
                    {stat.value}
                  </h3>
                  {stat.label === "New Requests" && (
                    <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded-full">
                      ACTION REQUIRED
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-0">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">Hospital Staff</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "requests" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Doctor Requests
                {requests.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-[8px]">
                    {requests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("doctors")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "doctors" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Active Doctors
              </button>
              <button
                onClick={() => setActiveTab("staff")}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "staff" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Receptionists
              </button>
            </div>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeTab === "requests" ? (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-widest sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Doctor Information</th>
                  <th className="px-6 py-4">Specialty & Exp.</th>
                  <th className="px-6 py-4">Request Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((req: any) => (
                  <tr
                    key={req._id || req.id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                          {(req.full_name || req.name || "D")
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {req.full_name || req.name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-medium">
                            {req.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-700">
                        {req.specialization || req.specialty}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {req.years_of_experience || req.experience} experience
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-medium text-gray-600">
                        {req.createdAt
                          ? new Date(req.createdAt).toLocaleDateString()
                          : req.date || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(req._id || req.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <ShieldCheck size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(req._id || req.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all border border-red-100"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {loading && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-blue-500"
                    >
                      Loading requests...
                    </td>
                  </tr>
                )}
                {!loading && requests.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500 italic"
                    >
                      No pending doctor requests at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 tracking-widest sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">Name & Role</th>
                  <th className="px-6 py-4">Specialty/Shift</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staffList
                  .filter(
                    (user) =>
                      activeTab === "all" ||
                      (activeTab === "doctors" && user.role === "Doctor") ||
                      (activeTab === "staff" && user.role === "Receptionist"),
                  )
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-700">
                          {user.specialty}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                            user.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white rounded-lg text-blue-600 shadow-sm border border-transparent hover:border-gray-200 transition-all">
                            <Edit size={14} />
                          </button>
                          <button className="p-2 hover:bg-white rounded-lg text-red-600 shadow-sm border border-transparent hover:border-gray-200 transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

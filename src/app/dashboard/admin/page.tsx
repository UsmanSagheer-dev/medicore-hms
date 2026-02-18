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
  Eye,
  X,
  MapPin,
  CreditCard,
  Clock,
  Phone,
  Mail,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  approveDoctorRequest,
  rejectDoctorRequest,
} from "@/redux/slices/doctorSlice";
import {
  pendingReceptionistRequests,
  approveReceptionistRequest,
  rejectReceptionistRequest,
  activeReceptionist,
  updateReceptionistStaffData,
} from "@/redux/slices/receptionistSlice";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedRequestType, setSelectedRequestType] = useState<
    "doctor" | "receptionist"
  >("doctor");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { pendingRequests, loading, error } = useSelector(
    (state: RootState) => state.doctor,
  );
  const {
    pendingRequests: receptionistPendingRequests,
    loading: receptionistLoading,
    receptionists,
  } = useSelector((state: RootState) => state.receptionist);

  useEffect(() => {
    dispatch(pendingDoctorRequests());
    console.log("🔄 Dispatching pendingDoctorRequests");
  }, [dispatch]);

  useEffect(() => {
    dispatch(pendingReceptionistRequests());
    dispatch(activeReceptionist() as any);
    console.log("🔄 Dispatching pendingReceptionistRequests");
    console.log(activeReceptionist);
  }, [dispatch]);

  const requests = Array.isArray(pendingRequests) ? pendingRequests : [];
  const receptionistRequests = Array.isArray(receptionistPendingRequests)
    ? receptionistPendingRequests
    : [];

  console.log("👨‍⚕️ Doctor Requests:", requests);
  console.log("📝 Receptionist Requests:", receptionistRequests);

  const stats = [
    {
      label: "Total Doctors",
      value: receptionists?.filter((r: any) => r.role === "Doctor").length || "0",
      icon: Stethoscope,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Receptionists",
      value: receptionists?.length || "0",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "New Requests",
      value: (requests.length + receptionistRequests.length) || "0",
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

  const staffList = receptionists && receptionists.length > 0 
    ? receptionists 
    : [
        {
          id: 1,
          name: "Dr. Usman Sagheer",
          role: "Doctor",
          specialty: "Cardiology",
          status: "Active",
          email: "usman@medicore.com",
        },
        {
          id: 3,
          name: "Dr. Sarah Khan",
          role: "Doctor",
          specialty: "Pediatrics",
          status: "Inactive",
          email: "sarah@medicore.com",
        },
      ];

  const handleApprove = async (id: string) => {
    try {
      console.log(
        "🔄 handleApprove called with ID:",
        id,
        "Type:",
        selectedRequestType,
      );
      console.log("📋 Full selectedDoctor object:", selectedDoctor);

      if (!id) {
        toast.error("Request ID is missing");
        return;
      }

      if (selectedRequestType === "doctor") {
        await dispatch(approveDoctorRequest(id)).unwrap();
        toast.success("Doctor approved successfully!");
      } else {
        await dispatch(approveReceptionistRequest(id)).unwrap();
        toast.success("Receptionist approved successfully!");
      }
      setIsModalOpen(false);
      setSelectedDoctor(null);
    } catch (err: any) {
      console.error("❌ Approval error:", err);
      toast.error(err?.message || (err as string) || "Approval failed");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      const id = selectedDoctor?.id;
      console.log(
        "🔄 handleReject called with ID:",
        id,
        "Type:",
        selectedRequestType,
        "Reason:",
        rejectionReason,
      );

      if (!id) {
        toast.error("Request ID is missing");
        return;
      }

      if (selectedRequestType === "doctor") {
        await dispatch(
          rejectDoctorRequest({ doctorId: id, rejectionReason }),
        ).unwrap();
        toast.success("Doctor request rejected.");
      } else {
        await dispatch(
          rejectReceptionistRequest({ receptionistId: id, rejectionReason }),
        ).unwrap();
        toast.success("Receptionist request rejected.");
      }
      setIsRejectModalOpen(false);
      setIsModalOpen(false);
      setSelectedDoctor(null);
      setRejectionReason("");
    } catch (err: any) {
      console.error("❌ Rejection error:", err);
      toast.error(err?.message || (err as string) || "Rejection failed");
    }
  };

  const openDetails = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const openEditModal = (staff: any) => {
    setSelectedStaff(staff);
    setEditFormData({ ...staff });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the update API for receptionist
      if (
        activeTab === "staff" ||
        selectedStaff?.role === "Receptionist" ||
        !selectedStaff?.role
      ) {
        await dispatch(
          updateReceptionistStaffData({
            receptionistId: selectedStaff.id,
            updateData: editFormData,
          }),
        ).unwrap();
        toast.success("Receptionist updated successfully!");
      } else {
        // For doctors, add similar logic when needed
        toast.success("Staff updated successfully!");
      }

      // Refresh the list
      dispatch(activeReceptionist() as any);

      setIsEditModalOpen(false);
      setSelectedStaff(null);
      setEditFormData(null);
    } catch (err: any) {
      console.error("❌ Edit error:", err);
      toast.error(err?.message || err || "Update failed");
    }
  };

  const handleDeleteStaff = async (staffId: string | number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        // Add API call here to delete staff member
        toast.success("Staff deleted successfully!");
      } catch (err: any) {
        console.error("❌ Delete error:", err);
        toast.error(err?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-4  overflow-auto">
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
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm  ">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-900">Hospital Staff</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setActiveTab("requests");
                  setSelectedRequestType("doctor");
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "requests" && selectedRequestType === "doctor" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Doctor Requests
                {requests.length > 0 && (
                  <span className="ml-2 bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-[8px]">
                    {requests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("requests");
                  setSelectedRequestType("receptionist");
                }}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "requests" && selectedRequestType === "receptionist" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Receptionist Requests
                {receptionistRequests.length > 0 && (
                  <span className="ml-2 bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-[8px]">
                    {receptionistRequests.length}
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
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeTab === "staff" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Active Receptionists
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
                  <th className="px-6 py-4">
                    {selectedRequestType === "doctor"
                      ? "Doctor"
                      : "Receptionist"}{" "}
                    Information
                  </th>
                  <th className="px-6 py-4">
                    {selectedRequestType === "doctor"
                      ? "Specialty & Exp."
                      : " Exp."}
                  </th>
                  <th className="px-6 py-4">Request Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(selectedRequestType === "doctor"
                  ? requests
                  : receptionistRequests
                ).map((req: any) => (
                  <tr
                    key={req.cnic_number}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${selectedRequestType === "doctor" ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"}`}
                        >
                          {(req.full_name || req.name || "U")
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
                      <p className="text-[10px] text-gray-400">
                        {req.years_of_experience || req.experience || "N/A"}{" "}
                        experience
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
                      <button
                        onClick={() => {
                          console.log("📋 Selected request data:", req);
                          setSelectedDoctor(req);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ml-auto border border-blue-100 active:scale-95"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {(selectedRequestType === "doctor"
                  ? loading
                  : receptionistLoading) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-blue-500"
                    >
                      Loading requests...
                    </td>
                  </tr>
                )}
                {!(selectedRequestType === "doctor"
                  ? loading
                  : receptionistLoading) &&
                  (selectedRequestType === "doctor"
                    ? requests
                    : receptionistRequests
                  ).length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-500 italic"
                      >
                        No pending {selectedRequestType} requests at the moment.
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
                  <th className="px-6 py-4">Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(activeTab === "staff" ? receptionists : staffList)
                  .filter((user: any) => {
                    if (activeTab === "staff") return true;
                    if (activeTab === "all") return true;
                    if (activeTab === "doctors" && user.role === "Doctor")
                      return true;
                    return false;
                  })
                  .map((user: any) => (
                    <tr
                      key={user.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${activeTab === "staff" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {(user.full_name || user.name || "U")
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {user.full_name || user.name}
                            </p>
                            <p className="text-[10px] text-gray-500 font-medium">
                              {activeTab === "staff"
                                ? "Receptionist"
                                : user.role}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-700">
                          {activeTab === "staff"
                            ? user.shiftTiming || "N/A"
                            : user.salary
                              ? `${user.salary} Rs.`
                              : user.specialty || "N/A"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {user.email}
                        </p>
                      </td>
                      <td>
                        <p className="text-sm font-semibold text-gray-700">
                          {user.salary ? `${user.salary} Rs.` : "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                            user.status === "Active" || activeTab === "staff"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-gray-100 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {activeTab === "staff" ? "Active" : user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2  transition-opacity">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 hover:bg-white rounded-lg text-blue-600 shadow-sm border border-transparent hover:border-gray-200 transition-all"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(user.id)}
                            className="p-2 hover:bg-white rounded-lg text-red-600 shadow-sm border border-transparent hover:border-gray-200 transition-all"
                          >
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
      {/* Details Modal */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${selectedRequestType === "doctor" ? "bg-blue-600 shadow-blue-200" : "bg-purple-600 shadow-purple-200"}`}
                >
                  {selectedDoctor.full_name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">
                    {selectedDoctor.full_name}
                  </h2>
                  {selectedRequestType === "doctor" && (
                    <p className="text-sm font-bold text-blue-600">
                      {`${selectedDoctor.specialization} • ${selectedDoctor.years_of_experience} Experience`}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Personal & Professional Info */}
                <div className="space-y-8">
                  {selectedRequestType === "doctor" && (
                    <section>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BookOpen size={14} className="text-blue-500" />
                        Professional Credentials
                      </h3>
                      <div className="grid gap-4">
                        {selectedRequestType === "doctor" ? (
                          <>
                            <DetailItem
                              label="Registration #"
                              value={selectedDoctor.registration_number}
                            />
                            <DetailItem
                              label="Authority"
                              value={selectedDoctor.registration_authority}
                            />
                            <DetailItem
                              label="Qualifications"
                              value={selectedDoctor.qualifications}
                            />
                            <DetailItem
                              label="Medical College"
                              value={selectedDoctor.medical_college}
                            />
                            <DetailItem
                              label="Passing Year"
                              value={selectedDoctor.passing_year}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </section>
                  )}

                  <section>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Phone size={14} className="text-emerald-500" /> Contact
                      Information
                    </h3>
                    <div className="grid gap-4">
                      <DetailItem
                        label="Email Address"
                        value={selectedDoctor.email}
                        icon={<Mail size={14} />}
                      />
                      <DetailItem
                        label="Phone Number"
                        value={selectedDoctor.phone}
                        icon={<Phone size={14} />}
                      />
                      <DetailItem
                        label="CNIC Number"
                        value={selectedDoctor.cnic_number}
                      />
                    </div>
                  </section>
                </div>

                {/* Additional Info */}
                <div className="space-y-8">
                  {selectedRequestType === "doctor" ? (
                    <>
                      <section>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MapPin size={14} className="text-amber-500" /> Clinic
                          Details
                        </h3>
                        <div className="grid gap-4">
                          <DetailItem
                            label="Clinic Name"
                            value={selectedDoctor.clinic_name}
                          />
                          <DetailItem
                            label="City"
                            value={selectedDoctor.clinic_city}
                          />
                          <DetailItem
                            label="Address"
                            value={selectedDoctor.clinic_address}
                          />
                          <DetailItem
                            label="Room #"
                            value={selectedDoctor.room_number}
                          />
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <CreditCard size={14} className="text-purple-500" />{" "}
                          Fees & Schedule
                        </h3>
                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <DetailItem
                              label="Consultation"
                              value={`Rs. ${selectedDoctor.consultation_fee}`}
                            />
                            <DetailItem
                              label="Follow-up"
                              value={`Rs. ${selectedDoctor.followup_fee}`}
                            />
                          </div>
                          <DetailItem
                            label="Working Days"
                            value={
                              Array.isArray(selectedDoctor.working_days)
                                ? selectedDoctor.working_days.join(", ")
                                : selectedDoctor.working_days
                            }
                          />
                          <DetailItem
                            label="Shift Hours"
                            value={`${selectedDoctor.start_time} - ${selectedDoctor.end_time}`}
                            icon={<Clock size={14} />}
                          />
                        </div>
                      </section>
                    </>
                  ) : (
                    <>
                      <section>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Briefcase size={14} className="text-amber-500" />{" "}
                          Work Details
                        </h3>
                        <div className="grid gap-4">
                          <DetailItem
                            label="Shift Timing"
                            value={
                              selectedDoctor.shiftTiming ||
                              selectedDoctor.preferred_shift
                            }
                          />
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Users size={14} className="text-purple-500" />{" "}
                          Preferences & Skills
                        </h3>
                        <div className="grid gap-4">
                          <DetailItem
                            label="Can Work Weekends"
                            value={
                              selectedDoctor.can_work_weekends ? "Yes" : "No"
                            }
                          />
                          <DetailItem
                            label="Availability Days"
                            value={
                              Array.isArray(selectedDoctor.availability_days)
                                ? selectedDoctor.availability_days.join(", ")
                                : selectedDoctor.availability_days || "N/A"
                            }
                          />
                        </div>
                      </section>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
              >
                <ArrowLeft size={18} /> Back to List
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-8 py-3 bg-white text-red-600 border-2 border-red-100 font-bold rounded-2xl hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => {
                    const requestId = selectedDoctor?.id;
                    console.log(
                      "🔘 Approve button clicked with ID:",
                      requestId,
                    );
                    if (!requestId) {
                      toast.error("Request ID not found");
                      return;
                    }
                    handleApprove(requestId);
                  }}
                  disabled={loading}
                  className={`flex-1 sm:flex-none px-10 py-3 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${selectedRequestType === "doctor" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : "bg-purple-600 hover:bg-purple-700 shadow-purple-200"}`}
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <ShieldCheck size={18} /> Approve{" "}
                      {selectedRequestType === "doctor"
                        ? "Doctor"
                        : "Receptionist"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Rejection Reason
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-4">
              Please explain why this {selectedRequestType} request is being
              rejected. This feedback will be sent to the {selectedRequestType}.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={
                selectedRequestType === "doctor"
                  ? "e.g. Invalid registration documents or incomplete profile..."
                  : "e.g. Incomplete qualifications or missing documents..."
              }
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none mb-6 font-medium text-gray-700"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 px-6 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading}
                className="flex-2 px-6 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Processing..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {isEditModalOpen && selectedStaff && editFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg bg-blue-600 shadow-blue-200">
                  {selectedStaff.full_name?.charAt(0) ||
                    selectedStaff.name?.charAt(0) ||
                    "U"}
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">
                    Edit Staff Member
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    {selectedStaff.full_name || selectedStaff.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedStaff(null);
                  setEditFormData(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
              <form
                onSubmit={handleEditSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="date"
                      value={editFormData.joiningDate || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          joiningDate: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Input
                      label="Salary"
                      type="number"
                      value={editFormData.salary || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          salary: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <Select
                      label="shifTiming"
                      name="shiftTiming"
                      value={editFormData.shiftTiming || ""}
                      options={[
                        { label: "Morning Shift", value: "Morning" },
                        { label: "Evening Shift", value: "Evening" },
                        { label: "Night Shift", value: "Night" },
                      ]}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          shiftTiming: e.target.value,
                        })
                      }
                      placeholder="e.g., Cardiology or Morning Shift"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="col-span-full mt-6 flex items-center gap-3 pt-6 border-t border-gray-100">
                  <Button
                  title="Cancle"
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedStaff(null);
                      setEditFormData(null);
                    }}
                    className="flex-1 px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
                  />
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Edit size={18} /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: any;
}) => (
  <div className="group">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1 select-none">
      {label}
    </p>
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-xl border border-transparent group-hover:border-gray-200 group-hover:bg-white transition-all">
      {icon && <span className="text-gray-400">{icon}</span>}
      <p className="text-sm font-bold text-gray-800 break-all">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

export default AdminDashboard;

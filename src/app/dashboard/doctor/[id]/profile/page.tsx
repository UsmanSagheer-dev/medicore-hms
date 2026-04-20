"use client";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Award,
  Edit2,
  Save,
  X,
} from "lucide-react";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const doctorProfile = user?.doctor;
  console.log("Doctor profile data:", doctorProfile);
  
  // Parse working days from JSON string
  const parseWorkingDays = () => {
    if (!doctorProfile?.working_days) return [];
    try {
      return JSON.parse(doctorProfile.working_days);
    } catch {
      return [];
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: doctorProfile?.full_name || "",
    email: user?.email || "",
    phone: doctorProfile?.phone || "0000000000",
    specialization: doctorProfile?.specialization || "",
    years_of_experience: doctorProfile?.years_of_experience || "",
    qualifications: doctorProfile?.qualifications || "",
    medical_college: doctorProfile?.medical_college || "",
    registration_number: doctorProfile?.registration_number || "",
    cnic_number: doctorProfile?.cnic_number || "",
    clinic_name: doctorProfile?.clinic_name || "",
    clinic_city: doctorProfile?.clinic_city || "",
    clinic_address: doctorProfile?.clinic_address || "",
    room_number: doctorProfile?.room_number || "",
    consultation_fee: doctorProfile?.consultation_fee || "",
    followup_fee: doctorProfile?.followup_fee || "",
    start_time: doctorProfile?.start_time || "",
    end_time: doctorProfile?.end_time || "",
    working_days: parseWorkingDays(),
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d: string) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      working_days: JSON.stringify(formData.working_days),
    };
    console.log("Saving profile data:", dataToSave);
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50  to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto pt-4 pb-14">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {formData.full_name}
                  </h1>
                  <p className="text-lg text-blue-600 font-semibold mb-2">
                    {formData.specialization}
                  </p>
                  <p className="text-gray-600">
                    {formData.years_of_experience} Years of Experience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {isEditing ? (
                  <>
                    <X className="w-5 h-5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {!isEditing ? (
            // VIEW MODE
            <div className="space-y-6">
              {/* Row 1: Basic & Professional */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h2>
                  <div className="space-y-3">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs font-medium text-gray-600 uppercase">Email</p>
                      <p className="text-gray-900 mt-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        {formData.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Phone</p>
                      <p className="text-gray-900 mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-600" />
                        {formData.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Professional
                  </h2>
                  <div className="space-y-3">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs font-medium text-gray-600 uppercase">Registration #</p>
                      <p className="text-gray-900 mt-1">{formData.registration_number}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">CNIC</p>
                      <p className="text-gray-900 mt-1">{formData.cnic_number}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Qualifications & Clinic */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Qualifications */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    Qualifications
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase mb-1">Medical College</p>
                      <p className="text-gray-900">{formData.medical_college}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs font-medium text-gray-600 uppercase mb-1">Qualifications</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{formData.qualifications}</p>
                    </div>
                  </div>
                </div>

                {/* Clinic Details */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Clinic Details
                  </h2>
                  <div className="space-y-3">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs font-medium text-gray-600 uppercase">Clinic Name</p>
                      <p className="text-gray-900 mt-1">{formData.clinic_name}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs font-medium text-gray-600 uppercase">City</p>
                      <p className="text-gray-900 mt-1">{formData.clinic_city}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">Room Number</p>
                      <p className="text-gray-900 mt-1">{formData.room_number}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Fees & Working Hours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Structure */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Fee Structure
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-gray-600 uppercase">Consultation Fee</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">Rs. {formData.consultation_fee}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-gray-600 uppercase">Followup Fee</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">Rs. {formData.followup_fee}</p>
                    </div>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Working Hours
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 text-sm">Opening Time</span>
                        <span className="text-lg font-bold text-purple-600">{formData.start_time}</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 text-sm">Closing Time</span>
                        <span className="text-lg font-bold text-purple-600">{formData.end_time}</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs font-medium text-gray-600 uppercase mb-2">Working Days</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.working_days.map((day: string) => (
                          <span key={day} className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // EDIT MODE
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Closing Time</label>
                    <input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (Rs.)</label>
                    <input
                      type="text"
                      name="consultation_fee"
                      value={formData.consultation_fee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Followup Fee (Rs.)</label>
                    <input
                      type="text"
                      name="followup_fee"
                      value={formData.followup_fee}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                    <div className="grid grid-cols-2 gap-2">
                      {days.map((day) => (
                        <label
                          key={day}
                          className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded hover:bg-blue-50 transition"
                        >
                          <input
                            type="checkbox"
                            checked={formData.working_days.includes(day)}
                            onChange={() => handleDayChange(day)}
                            className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                          />
                          <span className="text-gray-700 text-sm">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

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
    phone: doctorProfile?.phone || "",
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {formData.full_name}
                  </h1>
                  <p className="text-lg text-blue-600 font-semibold mt-1">
                    {formData.specialization || "Specialist"}
                  </p>
                  <p className="text-gray-600 mt-2">
                    {formData.years_of_experience} Years of Experience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.full_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Full Name
                        </label>
                        <p className="text-gray-900 mt-1">{formData.full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Email
                        </label>
                        <p className="text-gray-900 mt-1 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          {formData.email}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Professional Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Years of Experience
                        </label>
                        <input
                          type="text"
                          name="years_of_experience"
                          value={formData.years_of_experience}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          name="registration_number"
                          value={formData.registration_number}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNIC Number
                        </label>
                        <input
                          type="text"
                          name="cnic_number"
                          value={formData.cnic_number}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Specialization
                        </label>
                        <p className="text-gray-900 mt-1">{formData.specialization}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Experience
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formData.years_of_experience} years
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Registration Number
                        </label>
                        <p className="text-gray-900 mt-1">{formData.registration_number}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          CNIC
                        </label>
                        <p className="text-gray-900 mt-1">{formData.cnic_number}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Qualifications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Qualifications
                </h2>
                {isEditing ? (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medical College
                      </label>
                      <input
                        type="text"
                        name="medical_college"
                        value={formData.medical_college}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualifications
                      </label>
                      <textarea
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-900 mb-2">
                      <span className="font-medium">Medical College:</span>{" "}
                      {formData.medical_college}
                    </p>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {formData.qualifications}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar - Right Side (1/3 width) */}
            <div className="space-y-6">
              {/* Clinic Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Clinic Details
                </h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Clinic Name
                        </label>
                        <input
                          type="text"
                          name="clinic_name"
                          value={formData.clinic_name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="clinic_city"
                          value={formData.clinic_city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Room Number
                        </label>
                        <input
                          type="text"
                          name="room_number"
                          value={formData.room_number}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-b pb-3">
                        <p className="text-sm font-medium text-gray-600">Clinic Name</p>
                        <p className="text-gray-900 font-semibold">
                          {formData.clinic_name}
                        </p>
                      </div>
                      <div className="border-b pb-3">
                        <p className="text-sm font-medium text-gray-600">City</p>
                        <p className="text-gray-900">{formData.clinic_city}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Room Number</p>
                        <p className="text-gray-900">{formData.room_number}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Fee Structure */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Fee Structure
                </h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Consultation Fee
                        </label>
                        <input
                          type="text"
                          name="consultation_fee"
                          value={formData.consultation_fee}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Followup Fee
                        </label>
                        <input
                          type="text"
                          name="followup_fee"
                          value={formData.followup_fee}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">
                          Consultation Fee
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          Rs. {formData.consultation_fee}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-600">Followup Fee</p>
                        <p className="text-2xl font-bold text-blue-600">
                          Rs. {formData.followup_fee}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Working Hours
                </h2>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working Days
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {days.map((day) => (
                            <label key={day} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.working_days.includes(day)}
                                onChange={() => handleDayChange(day)}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <span className="text-sm text-gray-700">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Opening Time</span>
                        <span className="font-semibold text-gray-900">
                          {formData.start_time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Closing Time</span>
                        <span className="font-semibold text-gray-900">
                          {formData.end_time}
                        </span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">Working Days</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.working_days.map((day: string) => (
                            <span
                              key={day}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-600" />
                  Contact
                </h2>
                {isEditing ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ) : (
                  <p className="text-gray-900 font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-600" />
                    {formData.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

"use client";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { updateDoctorProfile } from "@/redux/slices/doctorSlice";
import { getMe } from "@/redux/slices/authSlice";
import {
  DAY_LABEL_BY_KEY,
  DAY_OPTIONS,
  DayKey,
  WorkingDaysValue,
  normalizeDayKey,
  parseWorkingDaysEntries,
} from "@/lib/daySchedule";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Edit2,
  Save,
  X,
} from "lucide-react";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const doctorProfile = user?.doctor;
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load complete user data on component mount to ensure all fields are available
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    consultation_fee: doctorProfile?.consultation_fee || "",
    followup_fee: doctorProfile?.followup_fee || "",
    start_time: doctorProfile?.start_time || "",
    end_time: doctorProfile?.end_time || "",
    working_days: parseWorkingDaysEntries(doctorProfile?.working_days as WorkingDaysValue),
  });

  useEffect(() => {
    if (isEditing && doctorProfile) {
      setFormData({
        consultation_fee: doctorProfile.consultation_fee?.toString() || "",
        followup_fee: doctorProfile.followup_fee?.toString() || "",
        start_time: doctorProfile.start_time || "",
        end_time: doctorProfile.end_time || "",
        working_days: parseWorkingDaysEntries(doctorProfile.working_days as WorkingDaysValue),
      });
    }
  }, [isEditing, doctorProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayChange = (day: DayKey, time?: string) => {
    setFormData((prev) => {
      const exists = prev.working_days.some((d) => d.day === day);
      return {
        ...prev,
        working_days: exists
          ? prev.working_days.filter((d) => d.day !== day)
          : [
              ...prev.working_days,
              {
                day,
                time:
                  time ||
                  `${prev.start_time || "09:00"} - ${prev.end_time || "17:00"}`,
              },
            ],
      };
    });
  };

  const handleDayTimeRangeChange = (
    day: DayKey,
    part: "start" | "end",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      working_days: prev.working_days.map((d) =>
        d.day === day
          ? {
              ...d,
              time: (() => {
                const [
                  currentStart = prev.start_time || "09:00",
                  currentEnd = prev.end_time || "17:00",
                ] = (d.time || "").split("-").map((t) => t.trim());

                const nextStart = part === "start" ? value : currentStart;
                const nextEnd = part === "end" ? value : currentEnd;

                return `${nextStart} - ${nextEnd}`;
              })(),
            }
          : d,
      ),
    }));
  };

  const getSelectedDayTimeRange = (day: DayKey) => {
    const selected = formData.working_days.find((d) => d.day === day)?.time;
    const [
      start = formData.start_time || "09:00",
      end = formData.end_time || "17:00",
    ] = (selected || "").split("-").map((t) => t.trim());

    return { start, end };
  };

  const handleSave = async () => {
    if (!doctorProfile?.id) {
      toast.error("Doctor ID not found!");
      return;
    }

    setLoading(true);

    const workingDaysPayload = formData.working_days.reduce(
      (acc, entry) => {
        const rawTime = entry.time?.trim();
        let start = formData.start_time;
        let end = formData.end_time;

        if (rawTime && rawTime.includes("-")) {
          const [customStart, customEnd] = rawTime
            .split("-")
            .map((t) => t.trim());
          if (customStart) start = customStart;
          if (customEnd) end = customEnd;
        }

        const normalizedDay = normalizeDayKey(entry.day);
        if (!normalizedDay) {
          return acc;
        }

        acc[normalizedDay] = { start, end };
        return acc;
      },
      {} as Record<string, { start: string; end: string }>,
    );

    const dataToSave = {
      ...doctorProfile,
      id: doctorProfile.id,
      consultation_fee: parseInt(formData.consultation_fee, 10),
      followup_fee: parseInt(formData.followup_fee, 10),
      start_time: formData.start_time,
      end_time: formData.end_time,
      working_days: workingDaysPayload,
    };
    console.log("Data to save:", dataToSave);

    try {
      await dispatch(updateDoctorProfile(dataToSave)).unwrap();
      await dispatch(getMe()).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div
        className="flex h-screen overflow-hidden"
        style={{
          background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
        }}
      >
        <Sidebar />
        <div className="flex-1 overflow-y-auto pt-4 pb-14">
          <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
      }}
    >
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
                    {doctorProfile?.full_name}
                  </h1>
                  <p className="text-lg text-blue-600 font-semibold mb-2">
                    {doctorProfile?.specialization}
                  </p>
                  <p className="text-gray-600">
                    {doctorProfile?.years_of_experience} Years of Experience
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Basic Information
                  </h2>
                  <div className="space-y-3">
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Email
                      </p>
                      <p className="text-gray-900 mt-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        {user?.email || "Not Provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Phone
                      </p>
                      <p className="text-gray-900 mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-orange-600" />
                        {doctorProfile?.phone}
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
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Registration #
                      </p>
                      <p className="text-gray-900 mt-1">
                        {doctorProfile?.registration_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        CNIC
                      </p>
                      <p className="text-gray-900 mt-1">
                        {doctorProfile?.cnic_number}
                      </p>
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
                      <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                        Medical College
                      </p>
                      <p className="text-gray-900">
                        {doctorProfile?.medical_college}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                        Qualifications
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {doctorProfile?.qualifications}
                      </p>
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
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Clinic Name
                      </p>
                      <p className="text-gray-900 mt-1">
                        {doctorProfile?.clinic_name}
                      </p>
                    </div>
                    <div className="border-b border-gray-200 pb-3">
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        City
                      </p>
                      <p className="text-gray-900 mt-1">
                        {doctorProfile?.clinic_city}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Room Number
                      </p>
                      <p className="text-gray-900 mt-1">
                        {doctorProfile?.room_number}
                      </p>
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
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Consultation Fee
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        Rs. {doctorProfile?.consultation_fee}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-xs font-medium text-gray-600 uppercase">
                        Followup Fee
                      </p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        Rs. {doctorProfile?.followup_fee}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Working Hours
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 gap-6 flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700 text-sm">
                          Opening Time
                        </span>
                        <span className="text-lg font-bold text-purple-600">
                          {doctorProfile?.start_time}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium text-gray-700 text-sm">
                          Closing Time
                        </span>
                        <span className="text-lg font-bold text-purple-600">
                          {doctorProfile?.end_time}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                        Working Days
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {parseWorkingDaysEntries(
                          doctorProfile?.working_days as WorkingDaysValue,
                        ).map(({ day, time }) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                          >
                            {DAY_LABEL_BY_KEY[day]}
                            {time ? `: ${time}` : ""}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Profile
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time
                    </label>
                    <Input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time
                    </label>
                    <Input
                      type="time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Fee (Rs.)
                    </label>
                    <Input
                      type="number"
                      name="consultation_fee"
                      value={formData.consultation_fee}
                      onChange={handleChange}
                      placeholder="Enter consultation fee"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Followup Fee (Rs.)
                    </label>
                    <Input
                      type="number"
                      name="followup_fee"
                      value={formData.followup_fee}
                      onChange={handleChange}
                      placeholder="Enter followup fee"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="space-y-2">
                      {DAY_OPTIONS.map((day) => {
                        const isSelected = formData.working_days.some(
                          (d) => d.day === day.key,
                        );
                        const selectedTime = getSelectedDayTimeRange(day.key);

                        return (
                          <div
                            key={day.key}
                            className="grid grid-cols-1 md:grid-cols-[auto_120px_120px] gap-3 items-center p-2 bg-gray-50 rounded hover:bg-blue-50 transition"
                          >
                            <label className="flex items-center gap-2 cursor-pointer">
                              <Input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleDayChange(day.key)}
                                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                              />
                              <span className="text-gray-700 text-sm min-w-10">
                                {day.label}
                              </span>
                            </label>
                            <Input
                              type="time"
                              value={selectedTime.start}
                              onChange={(e) =>
                                handleDayTimeRangeChange(
                                  day.key,
                                  "start",
                                  e.target.value,
                                )
                              }
                              disabled={!isSelected}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-400"
                            />
                            <Input
                              type="time"
                              value={selectedTime.end}
                              onChange={(e) =>
                                handleDayTimeRangeChange(
                                  day.key,
                                  "end",
                                  e.target.value,
                                )
                              }
                              disabled={!isSelected}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 disabled:text-gray-400"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
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

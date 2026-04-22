"use client";

import React, { useState } from "react";
import { Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import Input from "@/components/ui/Input";

interface DaySchedule {
  dayName: string;
  date: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  maxPatients: number;
  slotDuration: number;
}

interface ScheduleManagementProps {
  doctorId: string;
}

export default function ScheduleManagement({ doctorId }: ScheduleManagementProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>({
    monday: {
      dayName: "Monday",
      date: "",
      isActive: true,
      startTime: "09:00",
      endTime: "17:00",
      maxPatients: 70,
      slotDuration: 6,
    },
    tuesday: {
      dayName: "Tuesday",
      date: "",
      isActive: true,
      startTime: "09:00",
      endTime: "17:00",
      maxPatients: 70,
      slotDuration: 6,
    },
    wednesday: {
      dayName: "Wednesday",
      date: "",
      isActive: true,
      startTime: "09:00",
      endTime: "17:00",
      maxPatients: 70,
      slotDuration: 6,
    },
    thursday: {
      dayName: "Thursday",
      date: "",
      isActive: true,
      startTime: "09:00",
      endTime: "17:00",
      maxPatients: 70,
      slotDuration: 6,
    },
    friday: {
      dayName: "Friday",
      date: "",
      isActive: true,
      startTime: "09:00",
      endTime: "17:00",
      maxPatients: 70,
      slotDuration: 6,
    },
    saturday: {
      dayName: "Saturday",
      date: "",
      isActive: false,
      startTime: "10:00",
      endTime: "14:00",
      maxPatients: 40,
      slotDuration: 10,
    },
    sunday: {
      dayName: "Sunday",
      date: "",
      isActive: false,
      startTime: "09:00",
      endTime: "17:00",
      maxPatients: 70,
      slotDuration: 6,
    },
  });

  // Get start of week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const calculateSlotDuration = (
    startTime: string,
    endTime: string,
    maxPatients: number
  ): number => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    const totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
    return Math.ceil(totalMinutes / maxPatients);
  };

  const handleDayToggle = (dayKey: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isActive: !prev[dayKey].isActive,
      },
    }));
  };

  const handleDayUpdate = (dayKey: string, field: string, value: any) => {
    const currentDay = schedule[dayKey];
    const updatedDay = { ...currentDay, [field]: value };

    if (field === "startTime" || field === "endTime" || field === "maxPatients") {
      const startTime = field === "startTime" ? value : currentDay.startTime;
      const endTime = field === "endTime" ? value : currentDay.endTime;
      const maxPatients = field === "maxPatients" ? value : currentDay.maxPatients;

      updatedDay.slotDuration = calculateSlotDuration(startTime, endTime, maxPatients);
    }

    setSchedule((prev) => ({
      ...prev,
      [dayKey]: updatedDay,
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="w-full bg-linear-to-br from-slate-50 to-blue-50 p-6 pb-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Weekly Schedule</h1>
              <p className="text-gray-600 mt-1">Manage your consultation hours and patient capacity</p>
            </div>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
              title="Previous week"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium mb-2">WEEK OF</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDate(weekStart)} - {formatDate(weekEnd)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {weekStart.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>

            <button
              onClick={goToNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
              title="Next week"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              Today's Week
            </button>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {days.map((dayKey, index) => {
            const daySchedule = schedule[dayKey];
            const dayDate = new Date(weekStart);
            dayDate.setDate(dayDate.getDate() + index);

            return (
              <div
                key={dayKey}
                className={`rounded-xl border-2 transition-all ${
                  daySchedule.isActive
                    ? "bg-white border-blue-200 shadow-sm hover:shadow-md hover:border-blue-300"
                    : "bg-gray-50 border-gray-200 shadow-xs"
                }`}
              >
                {/* Day Header */}
                <div
                  className={`px-6 py-4 border-b ${
                    daySchedule.isActive
                      ? "bg-linear-to-r from-blue-50 to-blue-100 border-blue-200"
                      : "bg-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={daySchedule.isActive}
                        onChange={() => handleDayToggle(dayKey)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {dayNames[index]}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {dayDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {daySchedule.isActive && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                {/* Day Content */}
                <div className="px-6 py-5">
                  {daySchedule.isActive ? (
                    <div className="space-y-4">
                      {/* Time Range */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Start Time
                          </label>
                          <div className="relative">
                            <Input
                              type="time"
                              value={daySchedule.startTime}
                              onChange={(e) =>
                                handleDayUpdate(dayKey, "startTime", e.target.value)
                              }
                              className="h-10 border-gray-300 rounded-lg text-center font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            End Time
                          </label>
                          <Input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) =>
                              handleDayUpdate(dayKey, "endTime", e.target.value)
                            }
                            className="h-10 border-gray-300 rounded-lg text-center font-semibold"
                          />
                        </div>
                      </div>

                      {/* Working Hours Display */}
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-sm text-blue-700 font-semibold">
                          {daySchedule.startTime} - {daySchedule.endTime}
                        </p>
                      </div>

                      {/* Patient Capacity */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                          Max Patients / Day
                        </label>
                        <Input
                          type="number"
                          value={daySchedule.maxPatients}
                          onChange={(e) =>
                            handleDayUpdate(dayKey, "maxPatients", parseInt(e.target.value))
                          }
                          className="h-10 border-gray-300 rounded-lg text-center font-semibold"
                          min="1"
                        />
                      </div>

                      {/* Slot Duration - Auto Calculated */}
                      <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">
                          Auto-Calculated Slot Duration
                        </p>
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-bold text-purple-600">
                            {daySchedule.slotDuration}
                          </span>
                          <span className="text-sm text-purple-700 font-semibold">
                            minutes per patient
                          </span>
                        </div>
                        <p className="text-xs text-purple-600 mt-3">
                          {daySchedule.maxPatients} patients ÷ available time = {daySchedule.slotDuration} min slots
                        </p>
                      </div>

                      {/* Info Card */}
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <p className="text-xs text-yellow-800">
                          <span className="font-bold">💡 Tip:</span> Adjust max patients to automatically recalculate slot duration
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-medium">This day is OFF</p>
                      <p className="text-sm text-gray-400 mt-2">Check the checkbox to enable consultations</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Save Notice */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
          <p className="text-sm text-blue-900">
            <span className="font-bold">💾 Note:</span> This is a preview. Your schedule will be saved once backend integration is complete.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Working Days</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {Object.values(schedule).filter((d) => d.isActive).length}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Total Weekly Capacity</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {Object.values(schedule)
                .filter((d) => d.isActive)
                .reduce((sum, d) => sum + d.maxPatients, 0)}{" "}
              patients
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Avg Slot Duration</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {Math.round(
                Object.values(schedule)
                  .filter((d) => d.isActive)
                  .reduce((sum, d) => sum + d.slotDuration, 0) /
                  Object.values(schedule).filter((d) => d.isActive).length
              )}{" "}
              min
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

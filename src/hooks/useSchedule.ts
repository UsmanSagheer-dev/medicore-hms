import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMe } from "@/redux/slices/authSlice";
import { updateDoctorDaySchedule } from "@/redux/slices/scheduleSlice";
import { DayKey, parseWorkingDaysMap } from "@/lib/daySchedule";

interface DaySchedule {
  dayName: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

type DaySchedulePayload = Record<string, { start: string; end: string }>;

const DAYS = [
  { key: "monday" as DayKey, label: "Monday", start: "09:00", end: "17:00", active: true },
  { key: "tuesday" as DayKey, label: "Tuesday", start: "09:00", end: "17:00", active: true },
  { key: "wednesday" as DayKey, label: "Wednesday", start: "09:00", end: "17:00", active: true },
  { key: "thursday" as DayKey, label: "Thursday", start: "09:00", end: "17:00", active: true },
  { key: "friday" as DayKey, label: "Friday", start: "09:00", end: "17:00", active: true },
  { key: "saturday" as DayKey, label: "Saturday", start: "10:00", end: "14:00", active: false },
  { key: "sunday" as DayKey, label: "Sunday", start: "09:00", end: "17:00", active: false },
] as const;

export function useSchedule(doctorId: string) {
  const dispatch = useAppDispatch();

  const doctorProfile = useAppSelector((state) => state.auth.user?.doctor);
  const { loading } = useAppSelector((state) => state.schedule);

  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(() =>
    DAYS.reduce((acc, d) => {
      acc[d.key] = {
        dayName: d.label,
        isActive: d.active,
        startTime: d.start,
        endTime: d.end,
      };
      return acc;
    }, {} as Record<string, DaySchedule>)
  );

  // fetch doctor
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  // sync backend data
  useEffect(() => {
    if (!doctorProfile?.working_days) return;

    const parsed = parseWorkingDaysMap(doctorProfile.working_days);

    setSchedule((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((k) => (updated[k].isActive = false));

      Object.entries(parsed).forEach(([day, val]) => {
        if (updated[day]) {
          updated[day] = {
            ...updated[day],
            isActive: true,
            startTime: val.start,
            endTime: val.end,
          };
        }
      });

      return updated;
    });
  }, [doctorProfile?.working_days]);

  const activeDaysCount = useMemo(
    () => Object.values(schedule).filter((d) => d.isActive).length,
    [schedule]
  );

  const toggleDay = (dayKey: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        isActive: !prev[dayKey].isActive,
      },
    }));
  };

  const changeTime = (
    dayKey: string,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value,
      },
    }));
  };

  const saveSchedule = async () => {
    const payload = buildPayload(schedule);

    if (!Object.keys(payload).length) {
      throw new Error("Please enable at least one working day");
    }

    await dispatch(
      updateDoctorDaySchedule({
        doctorId,
        scheduleData: payload,
      })
    ).unwrap();
  };

  return {
    schedule,
    loading,
    activeDaysCount,
    toggleDay,
    changeTime,
    saveSchedule,
  };
}

// helpers
function buildPayload(schedule: Record<string, DaySchedule>): DaySchedulePayload {
  return Object.entries(schedule).reduce((acc, [key, day]) => {
    if (!day.isActive) return acc;

    if (!isValid(day.startTime, day.endTime)) {
      throw new Error(`${day.dayName}: Invalid time`);
    }

    acc[key] = {
      start: day.startTime,
      end: day.endTime,
    };

    return acc;
  }, {} as DaySchedulePayload);
}

function isValid(start: string, end: string) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return eh * 60 + em > sh * 60 + sm;
}
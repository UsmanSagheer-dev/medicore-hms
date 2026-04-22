export interface DaySchedule {
  dayName: string;
  dayIndex: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
  maxPatients: number;
  slotDuration: number;
}

export interface WeeklySchedule {
  doctorId: string;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
}

export interface ScheduleException {
  id: string;
  doctorId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  maxPatients?: number;
  isOffDay: boolean;
  reason?: string;
  createdAt: string;
}

export interface ScheduleState {
  weeklySchedule: WeeklySchedule | null;
  exceptions: ScheduleException[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

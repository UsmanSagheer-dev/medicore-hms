import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { DayKey, parseWorkingDaysMap } from "@/lib/daySchedule";

export type DoctorDaySchedule = Partial<
  Record<DayKey, { start: string; end: string }>
>;

interface ScheduleState {
  daySchedule: DoctorDaySchedule | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ScheduleState = {
  daySchedule: null,
  loading: false,
  error: null,
  success: false,
};

function toDayScheduleMap(value: unknown): DoctorDaySchedule {
  return parseWorkingDaysMap(value) as DoctorDaySchedule;
}

function extractScheduleFromResponse(responseData: unknown): DoctorDaySchedule | null {
  if (!responseData || typeof responseData !== "object") {
    return null;
  }

  const payload = responseData as Record<string, unknown>;

  if (payload.doctor && typeof payload.doctor === "object") {
    const doctor = payload.doctor as Record<string, unknown>;
    if (doctor.working_days) {
      return toDayScheduleMap(doctor.working_days);
    }
  }

  if (payload.data && typeof payload.data === "object") {
    const data = payload.data as Record<string, unknown>;
    if (data.working_days) {
      return toDayScheduleMap(data.working_days);
    }
  }

  if (payload.working_days) {
    return toDayScheduleMap(payload.working_days);
  }

  return null;
}

export const updateDoctorDaySchedule = createAsyncThunk(
  "schedule/updateDoctorDaySchedule",
  async (
    {
      doctorId,
      scheduleData,
    }: { doctorId: string; scheduleData: DoctorDaySchedule },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/doctors/${doctorId}/schedule`, scheduleData);
      return {
        responseData: response.data,
        scheduleData,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetScheduleState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearSchedule: (state) => {
      state.daySchedule = null;
      state.success = false;
      state.error = null;
    },
    setScheduleFromWorkingDays: (state, action: PayloadAction<unknown>) => {
      state.daySchedule = toDayScheduleMap(action.payload);
      state.error = null;
    },
    setDaySchedule: (state, action: PayloadAction<DoctorDaySchedule>) => {
      state.daySchedule = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDoctorDaySchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDoctorDaySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const extracted = extractScheduleFromResponse(action.payload.responseData);
        state.daySchedule = extracted || action.payload.scheduleData;
      })
      .addCase(updateDoctorDaySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const {
  resetScheduleState,
  clearSchedule,
  setScheduleFromWorkingDays,
  setDaySchedule,
} = scheduleSlice.actions;

export default scheduleSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { WeeklySchedule, ScheduleException, ScheduleState } from "@/types/schedule";

const initialState: ScheduleState = {
  weeklySchedule: null,
  exceptions: [],
  loading: false,
  error: null,
  success: false,
};

export const getWeeklySchedule = createAsyncThunk(
  "schedule/getWeekly",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/schedule/doctor/${doctorId}/weekly`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateWeeklySchedule = createAsyncThunk(
  "schedule/updateWeekly",
  async (
    { doctorId, scheduleData }: { doctorId: string; scheduleData: WeeklySchedule },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(
        `/schedule/doctor/${doctorId}/weekly`,
        scheduleData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getScheduleExceptions = createAsyncThunk(
  "schedule/getExceptions",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/schedule/doctor/${doctorId}/exceptions`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const addScheduleException = createAsyncThunk(
  "schedule/addException",
  async (
    {
      doctorId,
      exceptionData,
    }: {
      doctorId: string;
      exceptionData: Omit<ScheduleException, "id" | "createdAt">;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/schedule/doctor/${doctorId}/exceptions`,
        exceptionData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteScheduleException = createAsyncThunk(
  "schedule/deleteException",
  async (
    { doctorId, exceptionId }: { doctorId: string; exceptionId: string },
    { rejectWithValue }
  ) => {
    try {
      await api.delete(`/schedule/doctor/${doctorId}/exceptions/${exceptionId}`);
      return exceptionId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWeeklySchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeeklySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklySchedule = action.payload;
      })
      .addCase(getWeeklySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateWeeklySchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateWeeklySchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklySchedule = action.payload;
        state.success = true;
      })
      .addCase(updateWeeklySchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      .addCase(getScheduleExceptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getScheduleExceptions.fulfilled, (state, action) => {
        state.loading = false;
        state.exceptions = action.payload;
      })
      .addCase(getScheduleExceptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addScheduleException.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addScheduleException.fulfilled, (state, action) => {
        state.loading = false;
        state.exceptions.push(action.payload);
        state.success = true;
      })
      .addCase(addScheduleException.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteScheduleException.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteScheduleException.fulfilled, (state, action) => {
        state.loading = false;
        state.exceptions = state.exceptions.filter((e) => e.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteScheduleException.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetScheduleState } = scheduleSlice.actions;
export default scheduleSlice.reducer;

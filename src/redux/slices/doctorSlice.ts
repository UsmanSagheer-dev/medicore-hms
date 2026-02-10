import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

interface DoctorProfile {
  _id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  registration_number: string;
  registration_authority: string;
  registration_issue_date: string;
  registration_expiry_date: string;
  specialization: string;
  sub_specialization: string;
  years_of_experience: string;
  qualifications: string;
  medical_college: string;
  passing_year: string;
  clinic_name: string;
  clinic_city: string;
  clinic_address: string;
  room_number: string;
  consultation_fee: string;
  followup_fee: string;
  followup_validity_days: string;
  working_days: string[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: string;
  cnic_number: string;
}

interface DoctorState {
  profile: DoctorProfile | null;
  pendingRequests: DoctorProfile[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DoctorState = {
  profile: null,
  pendingRequests: [],
  loading: false,
  error: null,
  success: false,
};

export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async (profileData: DoctorProfile, { rejectWithValue }) => {
    try {
      console.log("Sending doctor profile data:", profileData);

      const response = await api.post("/doctor/onboarding/submit", profileData);

      return response.data;
    } catch (error: any) {
      console.error(
        "Submission failed:",
        error.response?.data || error.message,
      );
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const pendingDoctorRequests = createAsyncThunk(
  "doctor/pendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctor/onboarding/pending");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const approveDoctorRequest = createAsyncThunk(
  "doctor/approveRequest",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/doctor/onboarding/${doctorId}/approve`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const rejectDoctorRequest = createAsyncThunk(
  "doctor/rejectRequest",
  async (
    {
      doctorId,
      rejectionReason,
    }: { doctorId: string; rejectionReason: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/doctor/onboarding/${doctorId}/reject`, {
        rejectionReason,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    resetDoctorState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload.profile;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(pendingDoctorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(pendingDoctorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Backend typically returns { success: true, profile: [...] } or just the array
        const data =
          action.payload.profile || action.payload.data || action.payload;
        state.pendingRequests = Array.isArray(data) ? data : [];
      })
      .addCase(pendingDoctorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(approveDoctorRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(approveDoctorRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pendingRequests = state.pendingRequests.filter(
          (doctor) => doctor._id !== action.meta.arg,
        );
      })
      .addCase(approveDoctorRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(rejectDoctorRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rejectDoctorRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pendingRequests = state.pendingRequests.filter(
          (doctor) => doctor._id !== action.meta.arg.doctorId,
        );
      })
      .addCase(rejectDoctorRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;

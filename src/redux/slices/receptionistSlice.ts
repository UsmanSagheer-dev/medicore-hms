import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface ReceptionistProfile {
  // Keeping existing fields if they are still relevant, or we might need to unify
  hospitalName?: string;
  department?: string;
  shiftTiming?: string;
  experience?: string;
  address?: string; // Existing, matches new form
  
  // New Onboarding Fields
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  city?: string;
  highest_qualification?: string;
  qualification_field?: string;
  years_of_experience?: string; // Overlaps with experience
  previous_employer?: string;
  previous_designation?: string;
  cnic_number?: string;
  preferred_shift?: string;
  availability_days?: string[];
  can_work_weekends?: boolean;
  languages?: string;
  computer_proficiency?: string;
  status?: string;
}

interface ReceptionistState {
  profile: ReceptionistProfile | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReceptionistState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunk to submit receptionist profile (Legacy, keeping for now)
export const updateReceptionistProfile = createAsyncThunk(
  'receptionist/updateProfile',
  async (profileData: ReceptionistProfile, { rejectWithValue }) => {
    try {
      const response = await api.post('/receptionist/profile', profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Async thunk for full receptionist onboarding
export const submitReceptionistOnboarding = createAsyncThunk(
  'receptionist/submitOnboarding',
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/receptionist/onboarding/submit', formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


export const receptionistSlice = createSlice({
  name: 'receptionist',
  initialState,
  reducers: {
    resetReceptionistState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Legacy Update
      .addCase(updateReceptionistProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReceptionistProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload.profile;
      })
      .addCase(updateReceptionistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // New Onboarding Submission
      .addCase(submitReceptionistOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitReceptionistOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload.onboarding;
      })
      .addCase(submitReceptionistOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetReceptionistState } = receptionistSlice.actions;
export default receptionistSlice.reducer;

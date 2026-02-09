import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface ReceptionistProfile {
  hospitalName: string;
  department: string;
  shiftTiming: string;
  experience: string;
  address: string;
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

// Async thunk to submit receptionist profile
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
      });
  },
});

export const { resetReceptionistState } = receptionistSlice.actions;
export default receptionistSlice.reducer;

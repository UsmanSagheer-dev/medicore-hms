import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

interface ReceptionistProfile {
  id?: string;
  hospitalName?: string;
  department?: string;
  shiftTiming?: string;
  experience?: string;
  address?: string;

  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  city?: string;
  highest_qualification?: string;
  qualification_field?: string;
  years_of_experience?: string;
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
  pendingRequests: ReceptionistProfile[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ReceptionistState = {
  profile: null,
  pendingRequests: [],
  loading: false,
  error: null,
  success: false,
};

export const updateReceptionistProfile = createAsyncThunk(
  "receptionist/updateProfile",
  async (profileData: ReceptionistProfile, { rejectWithValue }) => {
    try {
      const response = await api.post("/receptionist/profile", profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const submitReceptionistOnboarding = createAsyncThunk(
  "receptionist/submitOnboarding",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/receptionist/onboarding/submit",
        formData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const pendingReceptionistRequests = createAsyncThunk(
  "receptionist/fetchPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/receptionist/onboarding/pending");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const approveReceptionistRequest = createAsyncThunk(
  "receptionist/approveRequest",
  async (receptionistId: string, { rejectWithValue }) => {
    try {
      console.log("🔄 Sending approval request for ID:", receptionistId);
      const response = await api.post(
        `/receptionist/onboarding/${receptionistId}/approve`,
      );
      console.log("✅ Approval response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const rejectReceptionistRequest = createAsyncThunk(
  "receptionist/rejectRequest",
  async (
    {
      receptionistId,
      rejectionReason,
    }: { receptionistId: string; rejectionReason: string },
    { rejectWithValue },
  ) => {
    try {
      console.log(
        "🔄 Sending rejection request for ID:",
        receptionistId,
        "Reason:",
        rejectionReason,
      );
      const response = await api.post(
        `/receptionist/onboarding/${receptionistId}/reject`,
        {
          rejectionReason,
        },
      );
      console.log("✅ Rejection response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const receptionistSlice = createSlice({
  name: "receptionist",
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
      })

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
      })
      // Fetch Pending Requests (for Admin)
      .addCase(pendingReceptionistRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(pendingReceptionistRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const data =
          action.payload.pendingRequests ||
          action.payload.onboarding ||
          action.payload.data ||
          action.payload;
        console.log(
          "📋 Pending Receptionist Requests Response:",
          action.payload,
        );
        console.log("📋 Parsed Data:", data);
        state.pendingRequests = Array.isArray(data) ? data : [];
        console.log("📋 State pendingRequests:", state.pendingRequests);
      })
      .addCase(pendingReceptionistRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        console.error(
          "❌ Failed to fetch receptionist requests:",
          action.payload,
        );
      })
      .addCase(approveReceptionistRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(approveReceptionistRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log("✅ Receptionist Approved! Removing ID:", action.meta.arg);
        state.pendingRequests = state.pendingRequests.filter(
          (receptionist) => receptionist.id !== action.meta.arg,
        );
      })
      .addCase(approveReceptionistRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(rejectReceptionistRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(rejectReceptionistRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        console.log(
          "✅ Receptionist Rejected! Removing ID:",
          action.meta.arg.receptionistId,
        );
        state.pendingRequests = state.pendingRequests.filter(
          (receptionist) => receptionist.id !== action.meta.arg.receptionistId,
        );
      })
      .addCase(rejectReceptionistRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetReceptionistState } = receptionistSlice.actions;
export default receptionistSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

interface PharmacyProfile {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  license_number?: string;
  registration_authority?: string;
  registration_issue_date?: string;
  registration_expiry_date?: string;
  years_of_experience?: string | number;
  qualifications?: string;
  pharmacy_college?: string;
  passing_year?: string | number;
  pharmacy_name?: string;
  pharmacy_city?: string;
  pharmacy_address?: string;
  cnic_number?: string;
  status?: string;
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
}

interface PharmacyState {
  profile: PharmacyProfile | null;
  pendingRequests: PharmacyProfile[];
  allRequests: PharmacyProfile[];
  pharmacies: PharmacyProfile[];
  selectedOnboarding: PharmacyProfile | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PharmacyState = {
  profile: null,
  pendingRequests: [],
  allRequests: [],
  pharmacies: [],
  selectedOnboarding: null,
  loading: false,
  error: null,
  success: false,
};

export const submitPharmacyOnboarding = createAsyncThunk(
  "pharmacy/submitOnboarding",
  async (formData: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await api.post("/pharmacy/onboarding/submit", formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const fetchPendingPharmacyRequests = createAsyncThunk(
  "pharmacy/fetchPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacy/onboarding/pending");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const fetchAllPharmacyRequests = createAsyncThunk(
  "pharmacy/fetchAllRequests",
  async (
    params: { status?: string; page?: number; limit?: number } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append("status", params.status);
      if (params?.page) query.append("page", String(params.page));
      if (params?.limit) query.append("limit", String(params.limit));

      const suffix = query.toString() ? `?${query.toString()}` : "";
      const response = await api.get(`/pharmacy/onboarding/all${suffix}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getPharmacyOnboardingDetails = createAsyncThunk(
  "pharmacy/getOnboardingDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pharmacy/onboarding/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const approvePharmacyRequest = createAsyncThunk(
  "pharmacy/approveRequest",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/pharmacy/onboarding/${id}/approve`);
      return { ...response.data, id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const rejectPharmacyRequest = createAsyncThunk(
  "pharmacy/rejectRequest",
  async (
    { id, rejectionReason }: { id: string; rejectionReason: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/pharmacy/onboarding/${id}/reject`, {
        rejectionReason,
      });
      return { ...response.data, id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getAllPharmacies = createAsyncThunk(
  "pharmacy/getAllPharmacies",
  async (city: string | undefined, { rejectWithValue }) => {
    try {
      const suffix = city ? `?city=${encodeURIComponent(city)}` : "";
      const response = await api.get(`/pharmacies${suffix}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getActivePharmacies = createAsyncThunk(
  "pharmacy/getActivePharmacies",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacies/active");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getPharmaciesByCity = createAsyncThunk(
  "pharmacy/getByCity",
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pharmacies/city/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getPharmacyById = createAsyncThunk(
  "pharmacy/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pharmacies/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getPharmacyByUserId = createAsyncThunk(
  "pharmacy/getByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pharmacies/user/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const updatePharmacyProfile = createAsyncThunk(
  "pharmacy/updateProfile",
  async (
    {
      id,
      data,
    }: {
      id: string;
      data: {
        phone?: string;
        pharmacy_name?: string;
        pharmacy_address?: string;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/pharmacies/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const deletePharmacyProfile = createAsyncThunk(
  "pharmacy/deleteProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/pharmacies/${id}`);
      return { ...response.data, id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState,
  reducers: {
    resetPharmacyState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPharmacyOnboarding.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitPharmacyOnboarding.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile =
          action.payload?.data ||
          action.payload?.onboarding ||
          action.payload?.pharmacy ||
          action.payload ||
          null;
      })
      .addCase(submitPharmacyOnboarding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchPendingPharmacyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingPharmacyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const data = action.payload?.data || action.payload?.pendingRequests || [];
        state.pendingRequests = Array.isArray(data) ? data : [];
      })
      .addCase(fetchPendingPharmacyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(fetchAllPharmacyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPharmacyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const data = action.payload?.data || action.payload?.allRequests || [];
        state.allRequests = Array.isArray(data) ? data : [];
      })
      .addCase(fetchAllPharmacyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getPharmacyOnboardingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyOnboardingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selectedOnboarding =
          action.payload?.data || action.payload?.onboarding || null;
      })
      .addCase(getPharmacyOnboardingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(approvePharmacyRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvePharmacyRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pendingRequests = state.pendingRequests.filter(
          (request) => request.id !== action.payload.id,
        );
      })
      .addCase(approvePharmacyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(rejectPharmacyRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectPharmacyRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pendingRequests = state.pendingRequests.filter(
          (request) => request.id !== action.payload.id,
        );
      })
      .addCase(rejectPharmacyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getAllPharmacies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const data = action.payload?.pharmacies || action.payload?.data || [];
        state.pharmacies = Array.isArray(data) ? data : [];
      })
      .addCase(getAllPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getActivePharmacies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivePharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const data = action.payload?.pharmacies || action.payload?.data || [];
        state.pharmacies = Array.isArray(data) ? data : [];
      })
      .addCase(getActivePharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getPharmaciesByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmaciesByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const data = action.payload?.pharmacies || action.payload?.data || [];
        state.pharmacies = Array.isArray(data) ? data : [];
      })
      .addCase(getPharmaciesByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getPharmacyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload?.pharmacy || action.payload?.data || null;
      })
      .addCase(getPharmacyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getPharmacyByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload?.pharmacy || action.payload?.data || null;
      })
      .addCase(getPharmacyByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(updatePharmacyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePharmacyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload?.pharmacy || action.payload?.data || null;
      })
      .addCase(updatePharmacyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(deletePharmacyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePharmacyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pharmacies = state.pharmacies.filter(
          (pharmacy) => pharmacy.id !== action.payload.id,
        );
      })
      .addCase(deletePharmacyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetPharmacyState } = pharmacySlice.actions;
export default pharmacySlice.reducer;

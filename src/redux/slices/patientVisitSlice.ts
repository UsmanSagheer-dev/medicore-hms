import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios";

export interface PatientVisit {
  id?: string;
  tokenNo: string;
  patientName: string;
  fatherName: string;
  age: string;
  gender: string;
  cnic: string;
  phoneNumber: string;
  address: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  roomNo: string;
  consultationFee: string;
  discount?: string;
  date: string;
  time: string;
  isPaid: boolean;
  paymentStatus: "pending" | "paid";
  visitType: "New" | "Follow up" | "Revisit";
  createdAt?: string;
  updatedAt?: string;
}

interface PatientVisitState {
  visits: PatientVisit[];
  currentVisit: PatientVisit | null;
  todayVisits: PatientVisit[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: PatientVisitState = {
  visits: [],
  currentVisit: null,
  todayVisits: [],
  loading: false,
  error: null,
  success: false,
};

// Async Thunks
export const createPatient = createAsyncThunk(
  "patientVisit/createPatient",
  async (
    patientData: {
      fullName: string;
      fatherName: string;
      age: number;
      gender: string;
      cnic: string;
      phoneNumber: string;
      address: string;
      doctorId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/patients/register", patientData);
      console.log("Patient created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const createPatientVisit = createAsyncThunk(
  "patientVisit/create",
  async (visitData: PatientVisit, { rejectWithValue }) => {
    try {
      const payload = {
        visitType: visitData.visitType,
        patientId: (visitData as any).patientId,
        patientName: visitData.patientName,
        fatherName: visitData.fatherName,
        age: visitData.age,
        gender: visitData.gender,
        cnic: visitData.cnic,
        doctorId: (visitData as any).doctorId,
        doctorName: visitData.doctorName,
        specialization: visitData.specialization,
        roomNo: visitData.roomNo,
        consultationFee: parseFloat(visitData.consultationFee.toString()),
        discount: parseFloat(((visitData as any).discount || "0").toString()),
        isPaid: visitData.isPaid,
      };

      const response = await api.post("/visits/generate-token", payload);
      console.log("Patient visit created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getVistByDoctor = createAsyncThunk(
  "patientVisit/getByDoctor",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/visits/doctor/${doctorId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getTodayVisits = createAsyncThunk(
  "patientVisit/getToday",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/visits/today");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getPatientVisitById = createAsyncThunk(
  "patientVisit/getById",
  async (visitId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patient-visits/${visitId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const updatePatientVisit = createAsyncThunk(
  "patientVisit/update",
  async (
    {
      visitId,
      visitData,
    }: { visitId: string; visitData: Partial<PatientVisit> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/patient-visits/${visitId}`, visitData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const deletePatientVisit = createAsyncThunk(
  "patientVisit/delete",
  async (visitId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/patient-visits/${visitId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const updatePaymentStatus = createAsyncThunk(
  "patientVisit/updatePaymentStatus",
  async (
    {
      visitId,
      paymentStatus,
    }: { visitId: string; paymentStatus: "pending" | "paid" },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/patient-visits/${visitId}/payment`, {
        paymentStatus,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const patientVisitSlice = createSlice({
  name: "patientVisit",
  initialState,
  reducers: {
    resetPatientVisitState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentVisit: (state, action: PayloadAction<PatientVisit | null>) => {
      state.currentVisit = action.payload;
    },
    addLocalVisit: (state, action: PayloadAction<PatientVisit>) => {
      state.visits.unshift(action.payload);
      state.todayVisits.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      .addCase(createPatientVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPatientVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.visits.unshift(action.payload.visit);
        state.todayVisits.unshift(action.payload.visit);
      })
      .addCase(createPatientVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      .addCase(getVistByDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVistByDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload;
        state.visits = Array.isArray(data) ? data : [];
      })
      .addCase(getVistByDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getTodayVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodayVisits.fulfilled, (state, action) => {
        state.loading = false;
        const data =
          action.payload?.visits;
        state.todayVisits = Array.isArray(data) ? data : [];
      })
      .addCase(getTodayVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getPatientVisitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientVisitById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVisit = action.payload.visits || action.payload;
      })
      .addCase(getPatientVisitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updatePatientVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePatientVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedVisit = action.payload.visit || action.payload;
        const visitIndex = state.visits.findIndex(
          (v) => v.id === updatedVisit.id,
        );
        if (visitIndex !== -1) {
          state.visits[visitIndex] = updatedVisit;
        }
        if (state.currentVisit?.id === updatedVisit.id) {
          state.currentVisit = updatedVisit;
        }
      })
      .addCase(updatePatientVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      .addCase(deletePatientVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePatientVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.visits = state.visits.filter((v) => v.id !== action.meta.arg);
        state.todayVisits = state.todayVisits.filter(
          (v) => v.id !== action.meta.arg,
        );
        if (state.currentVisit?.id === action.meta.arg) {
          state.currentVisit = null;
        }
      })
      .addCase(deletePatientVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedVisit = action.payload.visit || action.payload;
        const visitIndex = state.visits.findIndex(
          (v) => v.id === updatedVisit.id,
        );
        if (visitIndex !== -1) {
          state.visits[visitIndex] = updatedVisit;
        }
        if (state.currentVisit?.id === updatedVisit.id) {
          state.currentVisit = updatedVisit;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetPatientVisitState, setCurrentVisit, addLocalVisit } =
  patientVisitSlice.actions;
export default patientVisitSlice.reducer;

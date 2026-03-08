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
  mismatchWarning: boolean;
  warningMessage: string | null;
}

const initialState: PatientVisitState = {
  visits: [],
  currentVisit: null,
  todayVisits: [],
  loading: false,
  error: null,
  success: false,
  mismatchWarning: false,
  warningMessage: null,
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
      console.log("Creating patient with data:", patientData);
      const response = await api.post("/patients/register-or-get", patientData);
      console.log("Patient response:", response.data);

      if (response.data.isExisting && !response.data.detailsMatch) {
        return {
          ...response.data,
          mismatchWarning: true,
          warningMessage: `⚠️ This CNIC is already registered with name "${response.data.existingDetails?.fullName}". You entered "${response.data.providedDetails?.fullName}".`,
        };
      }

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
        phoneNumber: visitData.phoneNumber,
        address: visitData.address,
        doctorId: (visitData as any).doctorId,
        doctorName: visitData.doctorName,
        specialization: visitData.specialization,
        roomNo: visitData.roomNo,
        consultationFee: parseFloat(visitData.consultationFee.toString()),
        discount: parseFloat(((visitData as any).discount || "0").toString()),
        isPaid: visitData.isPaid,
        paymentStatus: visitData.paymentStatus,
        date: visitData.date,
        time: visitData.time,
      };
      console.log("Creating patient visit with payload:", payload);

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
      const response = await api.get(`/visits/${visitId}`);
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

export const getPatientByCNIC = createAsyncThunk(
  "patientVisit/getByCNIC",
  async (cnic: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/patients/cnic/${cnic}`);
      console.log("Patient fetched successfully by CNIC:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const getVistiByPatientId = createAsyncThunk(
  "patientVisit/getByPatientId",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/visits/patient/${patientId}`);
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


export const callPatient = createAsyncThunk(
  "patientVisit/callPatient",
  async (visitId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/visits/${visitId}/call`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export interface ConsultationData {
  visitId: string;
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  medicines?: any;
  testRecommendations?: string;
  nextFollowUp?: string;
  notes?: string;
}

export const createConsultation = createAsyncThunk(
  "patientVisit/createConsultation",
  async (consultationData: ConsultationData, { rejectWithValue }) => {
    try {
      const response = await api.post("/consultations", consultationData);
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
      state.mismatchWarning = false;
      state.warningMessage = null;
    },
    clearMismatchWarning: (state) => {
      state.mismatchWarning = false;
      state.warningMessage = null;
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
        state.mismatchWarning = false;
        state.warningMessage = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;

        // Check for CNIC mismatch warning
        if (action.payload?.mismatchWarning) {
          state.mismatchWarning = true;
          state.warningMessage = action.payload.warningMessage;
          state.error = action.payload.warningMessage;
          state.success = false;
        } else {
          state.success = true;
          state.mismatchWarning = false;
          state.warningMessage = null;
        }
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.mismatchWarning = false;
        state.warningMessage = null;
      })

      .addCase(createPatientVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPatientVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const visit =
          action.payload?.data || action.payload?.visit || action.payload;
        console.log("Visit added to state:", visit);
        if (visit && visit.id) {
          state.visits.unshift(visit);
          state.todayVisits.unshift(visit);
        }
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
        const data = action.payload?.visits;
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
      .addCase(getPatientByCNIC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientByCNIC.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVisit = action.payload.patient || action.payload;
      })
      .addCase(getPatientByCNIC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getVistiByPatientId.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getVistiByPatientId.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(getVistiByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      })
      .addCase(callPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(callPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedVisit = action.payload.data || action.payload.visit || action.payload;
        const visitIndex = state.visits.findIndex(
          (v) => v.id === updatedVisit.id,
        );
        if (visitIndex !== -1) {
          state.visits[visitIndex] = updatedVisit;
        }
        const todayIndex = state.todayVisits.findIndex(
          (v) => v.id === updatedVisit.id,
        );
        if (todayIndex !== -1) {
          state.todayVisits[todayIndex] = updatedVisit;
        }
        if (state.currentVisit?.id === updatedVisit.id) {
          state.currentVisit = updatedVisit;
        }
      })
      .addCase(callPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(createConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createConsultation.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const consultation = action.payload.data || action.payload;
        const updatedVisit = consultation.visit;
        if (updatedVisit) {
          const visitIndex = state.visits.findIndex(
            (v) => v.id === updatedVisit.id,
          );
          if (visitIndex !== -1) {
            state.visits[visitIndex] = updatedVisit;
          }
          const todayIndex = state.todayVisits.findIndex(
            (v) => v.id === updatedVisit.id,
          );
          if (todayIndex !== -1) {
            state.todayVisits[todayIndex] = updatedVisit;
          }
          if (state.currentVisit?.id === updatedVisit.id) {
            state.currentVisit = updatedVisit;
          }
        }
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const {
  resetPatientVisitState,
  setCurrentVisit,
  addLocalVisit,
  clearMismatchWarning,
} = patientVisitSlice.actions;
export default patientVisitSlice.reducer;

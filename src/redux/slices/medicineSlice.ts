import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Medicine {
  id: string;
  pharmacyId: string;
  medicine_name: string;
  generic_name: string | null;
  brand_name: string | null;
  strength: string | null;
  dosage_form: string | null;
  category: string | null;
  manufacturer: string | null;
  batch_number: string | null;
  expiry_date: string | null;
  purchase_price: number | null;
  selling_price: number | null;
  stock_quantity: number;       // always stored in base units (e.g. TABLET)
  unit: string | null;          // legacy / display only
  base_unit: string;            // e.g. "TABLET"
  medium_unit: string | null;   // e.g. "STRIP"
  large_unit: string | null;    // e.g. "BOX"
  base_per_medium: number;      // e.g. 12  (tablets per strip)
  medium_per_large: number;     // e.g. 10  (strips per box)
  requires_prescription: boolean;
  storage_condition: string | null;
  description: string | null;
  barcode: string | null;
  sku: string | null;
  reorder_level: number;
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
  batches?: MedicineBatch[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicineBatch {
  id: string;
  medicineId: string;
  pharmacyId: string;
  batch_number: string;
  stock_quantity: number;
  expiry_date: string | null;
  purchase_price: number | null;
  selling_price: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  medicineId: string;
  pharmacyId: string;
  transactionType: "DISPENSED" | "PURCHASE" | "ADJUSTMENT" | "RETURN";
  quantity: number;
  quantity_unit: string | null;
  base_quantity: number | null;
  unit_price: number | null;
  total_amount: number | null;
  batch_breakdown: any;
  doctorId?: string;
  patientName?: string;
  visitId?: string;
  notes?: string;
  createdAt: string;
  medicine: Medicine;
}

export interface SalesReport {
  transactions: Transaction[];
  summary: {
    totalTransactions: number;
    totalQuantity: number;
    totalSales: number;
    avgTransactionValue: number;
  };
}

export interface MedicineStats {
  medicine: Medicine;
  totalQuantitySold: number;
  totalRevenue: number;
  transactionCount: number;
}

interface MedicineState {
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
  stockAlerts: Medicine[];
  salesReport: SalesReport | null;
  medicineStats: MedicineStats[];
  transactions: Transaction[];
  consultation: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  total: number;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

/** Convert base-unit quantity into a human-friendly string.
 *  e.g. 1200 tablets → "100 BOX (1,200 TABLET)"
 *  Falls back to plain "{qty} {base_unit}" if no large/medium unit is defined.
 */
export function formatStock(medicine: Medicine): string {
  const qty = medicine.stock_quantity;
  const base = medicine.base_unit || "UNIT";
  const medium = medicine.medium_unit;
  const large = medicine.large_unit;
  const bpm = medicine.base_per_medium || 1;   // base per medium
  const mpl = medicine.medium_per_large || 1;  // medium per large

  if (large && bpm > 0 && mpl > 0) {
    const basePerLarge = bpm * mpl;
    const boxes = Math.floor(qty / basePerLarge);
    const rem1 = qty % basePerLarge;
    const strips = Math.floor(rem1 / bpm);
    const tablets = rem1 % bpm;

    const parts: string[] = [];
    if (boxes > 0) parts.push(`${boxes} ${large}`);
    if (strips > 0) parts.push(`${strips} ${medium}`);
    if (tablets > 0 || parts.length === 0) parts.push(`${tablets} ${base}`);
    return parts.join(" + ");
  }

  if (medium && bpm > 0) {
    const strips = Math.floor(qty / bpm);
    const tablets = qty % bpm;
    const parts: string[] = [];
    if (strips > 0) parts.push(`${strips} ${medium}`);
    if (tablets > 0 || parts.length === 0) parts.push(`${tablets} ${base}`);
    return parts.join(" + ");
  }

  return `${qty} ${base}`;
}

// ─── Thunks ──────────────────────────────────────────────────────────────────

export const createMedicine = createAsyncThunk(
  "medicine/create",
  async (medicineData: Partial<Medicine> & {
    stock_quantity?: number;
    stock_unit?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post("/pharmacy/medicines", medicineData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getMedicinesByPharmacy = createAsyncThunk(
  "medicine/getByPharmacy",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacy/medicines");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getMedicineById = createAsyncThunk(
  "medicine/getById",
  async (medicineId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pharmacy/medicines/${medicineId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateMedicine = createAsyncThunk(
  "medicine/update",
  async ({ id, updateData }: { id: string; updateData: Partial<Medicine> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/pharmacy/medicines/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateMedicineStock = createAsyncThunk(
  "medicine/updateStock",
  async ({ id, stock_quantity }: { id: string; stock_quantity: number }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/pharmacy/medicines/${id}/stock`, { stock_quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const deleteMedicine = createAsyncThunk(
  "medicine/delete",
  async (medicineId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/pharmacy/medicines/${medicineId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const searchMedicines = createAsyncThunk(
  "medicine/search",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacy/medicines", { params: { q: query } });
      console.log("Search response:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

console.log("search medicine ",searchMedicines);

// ✅ Updated: now includes `unit` so backend can convert BOX/STRIP → TABLET
export const dispenseMedicine = createAsyncThunk(
  "medicine/dispense",
  async (
    data: {
      medicineId: string;
      quantity: number;
      unit?: string;           // ← BOX | STRIP | TABLET
      doctorId?: string;
      patientName?: string;
      visitId?: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/pharmacy/medicines/dispense", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// ✅ New: add a new batch (purchase) for an existing medicine
export const addMedicineBatchStock = createAsyncThunk(
  "medicine/addBatchStock",
  async (
    {
      medicineId,
      batch_number,
      expiry_date,
      quantity,
      unit,
      purchase_price,
      selling_price,
      notes,
    }: {
      medicineId: string;
      batch_number: string;
      expiry_date?: string;
      quantity: number;
      unit?: string;           // ← BOX | STRIP | TABLET
      purchase_price?: number;
      selling_price?: number;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/pharmacy/medicines/${medicineId}/batches`,
        { batch_number, expiry_date, quantity, unit, purchase_price, selling_price, notes }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getStockAlerts = createAsyncThunk(
  "medicine/getStockAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacy/medicines/alerts/stock");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getSalesReport = createAsyncThunk(
  "medicine/getSalesReport",
  async (params: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacy/reports/sales", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getMedicineSalesStats = createAsyncThunk(
  "medicine/getSalesStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/pharmacy/reports/medicine-stats");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getTransactionHistory = createAsyncThunk(
  "medicine/getTransactionHistory",
  async (medicineId: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const params = medicineId ? { medicineId } : {};
      const response = await api.get("/pharmacy/reports/transactions", { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getConsultationByToken = createAsyncThunk(
  "medicine/getConsultationByToken",
  async (tokenNo: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/pharmacy/consultations/token/${tokenNo}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const dispensePrescriptionByToken = createAsyncThunk(
  "medicine/dispensePrescriptionByToken",
  async (
    data: { tokenNo: string; date?: string; medicines?: any[]; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/pharmacy/consultations/dispense", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────────────────────

const initialState: MedicineState = {
  medicines: [],
  selectedMedicine: null,
  stockAlerts: [],
  salesReport: null,
  medicineStats: [],
  transactions: [],
  consultation: null,
  loading: false,
  error: null,
  success: false,
  total: 0,
};

const medicineSlice = createSlice({
  name: "medicine",
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccess: (state) => { state.success = false; },
    clearSelectedMedicine: (state) => { state.selectedMedicine = null; },
    clearConsultation: (state) => { state.consultation = null; },
  },
  extraReducers: (builder) => {

    // ── createMedicine ──────────────────────────────────────────────────────
    builder
      .addCase(createMedicine.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload?.data) {
          state.medicines.unshift(action.payload.data); // newest first
          state.total += 1;
        }
      })
      .addCase(createMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getMedicinesByPharmacy ──────────────────────────────────────────────
    builder
      .addCase(getMedicinesByPharmacy.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getMedicinesByPharmacy.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload?.data || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(getMedicinesByPharmacy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getMedicineById ─────────────────────────────────────────────────────
    builder
      .addCase(getMedicineById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMedicine = action.payload?.data || null;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── updateMedicine ──────────────────────────────────────────────────────
    builder
      .addCase(updateMedicine.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.medicines.findIndex((m) => m.id === updated.id);
          if (idx !== -1) state.medicines[idx] = updated;
          state.selectedMedicine = updated;
        }
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── updateMedicineStock ─────────────────────────────────────────────────
    builder
      .addCase(updateMedicineStock.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateMedicineStock.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updated = action.payload?.data;
        if (updated) {
          const idx = state.medicines.findIndex((m) => m.id === updated.id);
          if (idx !== -1) state.medicines[idx] = updated;
        }
      })
      .addCase(updateMedicineStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── deleteMedicine ──────────────────────────────────────────────────────
    builder
      .addCase(deleteMedicine.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const deletedId = action.payload?.data?.id;
        if (deletedId) {
          state.medicines = state.medicines.filter((m) => m.id !== deletedId);
          state.total = Math.max(0, state.total - 1);
        }
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── searchMedicines ─────────────────────────────────────────────────────
    builder
      .addCase(searchMedicines.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(searchMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload?.data || [];
        state.total = action.payload?.total || 0;
      })
      .addCase(searchMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── dispenseMedicine ────────────────────────────────────────────────────
    builder
      .addCase(dispenseMedicine.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(dispenseMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Backend returns updatedMedicine inside data.medicine
        const updated = action.payload?.data?.medicine;
        if (updated) {
          const idx = state.medicines.findIndex((m) => m.id === updated.id);
          if (idx !== -1) state.medicines[idx] = updated;
        }
      })
      .addCase(dispenseMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── addMedicineBatchStock ───────────────────────────────────────────────
    builder
      .addCase(addMedicineBatchStock.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addMedicineBatchStock.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Backend returns updatedMedicine inside data.updatedMedicine
        const updated = action.payload?.data?.updatedMedicine;
        if (updated) {
          const idx = state.medicines.findIndex((m) => m.id === updated.id);
          if (idx !== -1) state.medicines[idx] = updated;
        }
      })
      .addCase(addMedicineBatchStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getStockAlerts ──────────────────────────────────────────────────────
    builder
      .addCase(getStockAlerts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getStockAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.stockAlerts = action.payload?.data || [];
      })
      .addCase(getStockAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getSalesReport ──────────────────────────────────────────────────────
    builder
      .addCase(getSalesReport.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload?.data || null;
      })
      .addCase(getSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getMedicineSalesStats ───────────────────────────────────────────────
    builder
      .addCase(getMedicineSalesStats.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getMedicineSalesStats.fulfilled, (state, action) => {
        state.loading = false;
        state.medicineStats = action.payload?.data || [];
      })
      .addCase(getMedicineSalesStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getTransactionHistory ───────────────────────────────────────────────
    builder
      .addCase(getTransactionHistory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload?.data || [];
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── getConsultationByToken ──────────────────────────────────────────────
    builder
      .addCase(getConsultationByToken.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getConsultationByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.consultation = action.payload?.data || null;
      })
      .addCase(getConsultationByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── dispensePrescriptionByToken ─────────────────────────────────────────
    builder
      .addCase(dispensePrescriptionByToken.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(dispensePrescriptionByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update each dispensed medicine's stock in the list
        const items: any[] = action.payload?.data?.bill?.items || [];
        items.forEach((item) => {
          const idx = state.medicines.findIndex((m) => m.id === item.medicineId);
          if (idx !== -1) {
            state.medicines[idx] = {
              ...state.medicines[idx],
              stock_quantity: item.newStock,
            };
          }
        });
      })
      .addCase(dispensePrescriptionByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, clearSelectedMedicine, clearConsultation } =
  medicineSlice.actions;
export default medicineSlice.reducer;
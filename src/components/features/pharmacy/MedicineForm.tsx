"use client";

import { useEffect, useState } from "react";
import { X, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createMedicine,
  updateMedicine,
  getMedicineById,
  clearSelectedMedicine,
  clearSuccess,
  clearError,
} from "@/redux/slices/medicineSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface MedicineFormProps {
  isOpen: boolean;
  medicineId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const DOSAGE_FORMS = [
  "Tablet", "Capsule", "Liquid", "Injection",
  "Ointment", "Syrup", "Powder", "Other",
];

const CATEGORIES = [
  "Antibiotics", "Antihistamines", "Pain Relief", "Cold & Cough",
  "Digestive", "Cardiovascular", "Antidiabetic", "Vitamins", "Other",
];

// ✅ All three levels — TABLET is the true smallest unit
const ALL_UNITS = ["TABLET", "CAPSULE", "ML", "STRIP", "VIAL", "SACHET", "PACK", "BOX", "BOTTLE"];

const EMPTY_FORM = {
  medicine_name: "",
  generic_name: "",
  brand_name: "",
  strength: "",
  dosage_form: "",
  category: "",
  manufacturer: "",
  batch_number: "",
  expiry_date: "",
  purchase_price: "",
  selling_price: "",
  // Opening stock
  stock_quantity: "",
  stock_unit: "TABLET",
  // Unit hierarchy — backend stores everything in base_unit
  base_unit: "TABLET",       // smallest: e.g. TABLET
  medium_unit: "STRIP",      // middle:   e.g. STRIP (12 tablets)
  large_unit: "BOX",         // largest:  e.g. BOX   (10 strips)
  base_per_medium: "12",     // 1 STRIP = 12 TABLET
  medium_per_large: "10",    // 1 BOX   = 10 STRIP
  // optional medium/large toggle
  has_medium_unit: true,
  has_large_unit: true,
  requires_prescription: false,
  storage_condition: "",
  description: "",
  barcode: "",
  sku: "",
  reorder_level: "50",       // in base units
  status: "ACTIVE",
};

export default function MedicineForm({
  isOpen,
  medicineId,
  onClose,
  onSuccess,
}: MedicineFormProps) {
  const dispatch = useAppDispatch();
  const { selectedMedicine, loading, error, success } = useAppSelector(
    (state) => state.medicine
  );

  const [formData, setFormData] = useState(EMPTY_FORM);

  // ── Fetch medicine when editing ──────────────────────────────────────────
  useEffect(() => {
    if (medicineId && isOpen) {
      dispatch(getMedicineById(medicineId));
    }
  }, [medicineId, isOpen, dispatch]);

  // ── Populate form from fetched medicine ──────────────────────────────────
  useEffect(() => {
    if (selectedMedicine && medicineId) {
      setFormData({
        medicine_name: selectedMedicine.medicine_name || "",
        generic_name: selectedMedicine.generic_name || "",
        brand_name: selectedMedicine.brand_name || "",
        strength: selectedMedicine.strength || "",
        dosage_form: selectedMedicine.dosage_form || "",
        category: selectedMedicine.category || "",
        manufacturer: selectedMedicine.manufacturer || "",
        batch_number: selectedMedicine.batch_number || "",
        expiry_date: selectedMedicine.expiry_date
          ? new Date(selectedMedicine.expiry_date).toISOString().split("T")[0]
          : "",
        purchase_price: selectedMedicine.purchase_price?.toString() || "",
        selling_price: selectedMedicine.selling_price?.toString() || "",
        // When editing, show stock in base units — user can't change opening stock
        stock_quantity: selectedMedicine.stock_quantity?.toString() || "",
        stock_unit: selectedMedicine.base_unit || "TABLET",
        base_unit: selectedMedicine.base_unit || "TABLET",
        medium_unit: selectedMedicine.medium_unit || "STRIP",
        large_unit: selectedMedicine.large_unit || "BOX",
        base_per_medium: selectedMedicine.base_per_medium?.toString() || "12",
        medium_per_large: selectedMedicine.medium_per_large?.toString() || "10",
        has_medium_unit: !!selectedMedicine.medium_unit,
        has_large_unit: !!selectedMedicine.large_unit,
        requires_prescription: selectedMedicine.requires_prescription,
        storage_condition: selectedMedicine.storage_condition || "",
        description: selectedMedicine.description || "",
        barcode: selectedMedicine.barcode || "",
        sku: selectedMedicine.sku || "",
        reorder_level: selectedMedicine.reorder_level?.toString() || "50",
        status: selectedMedicine.status || "ACTIVE",
      });
    }
  }, [selectedMedicine, medicineId]);

  // ── Close on success ─────────────────────────────────────────────────────
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        onSuccess?.();
        handleClose();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleClose = () => {
    dispatch(clearSelectedMedicine());
    setFormData(EMPTY_FORM);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ── Live conversion preview ──────────────────────────────────────────────
  const conversionPreview = (): string => {
    const qty = Number(formData.stock_quantity);
    if (!qty || qty <= 0) return "";
    const bpm = Number(formData.base_per_medium) || 1;
    const mpl = Number(formData.medium_per_large) || 1;
    let base = qty;
    if (formData.stock_unit === formData.large_unit && formData.has_large_unit) {
      base = qty * bpm * mpl;
    } else if (formData.stock_unit === formData.medium_unit && formData.has_medium_unit) {
      base = qty * bpm;
    }
    return `= ${base.toLocaleString()} ${formData.base_unit} will be stored`;
  };

  // ── Available units for stock_unit dropdown ──────────────────────────────
  const stockUnitOptions = () => {
    const opts = [{ value: formData.base_unit, label: formData.base_unit }];
    if (formData.has_medium_unit && formData.medium_unit)
      opts.push({ value: formData.medium_unit, label: formData.medium_unit });
    if (formData.has_large_unit && formData.large_unit)
      opts.push({ value: formData.large_unit, label: formData.large_unit });
    return opts;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medicine_name || !formData.dosage_form || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    // Build payload — only send medium/large unit if toggled on
    const payload: any = {
      medicine_name: formData.medicine_name,
      generic_name: formData.generic_name || null,
      brand_name: formData.brand_name || null,
      strength: formData.strength || null,
      dosage_form: formData.dosage_form,
      category: formData.category,
      manufacturer: formData.manufacturer || null,
      batch_number: formData.batch_number || null,
      expiry_date: formData.expiry_date || null,
      purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
      selling_price: formData.selling_price ? Number(formData.selling_price) : null,
      base_unit: formData.base_unit,
      medium_unit: formData.has_medium_unit ? formData.medium_unit : null,
      large_unit: formData.has_large_unit ? formData.large_unit : null,
      base_per_medium: formData.has_medium_unit ? Number(formData.base_per_medium) : 1,
      medium_per_large: formData.has_large_unit ? Number(formData.medium_per_large) : 1,
      requires_prescription: formData.requires_prescription,
      storage_condition: formData.storage_condition || null,
      description: formData.description || null,
      barcode: formData.barcode || null,
      sku: formData.sku || null,
      reorder_level: Number(formData.reorder_level) || 50,
      status: formData.status,
    };

    if (!medicineId) {
      // Only send opening stock on create
      payload.stock_quantity = formData.stock_quantity ? Number(formData.stock_quantity) : 0;
      payload.stock_unit = formData.stock_unit;
    }

    if (medicineId) {
      await dispatch(updateMedicine({ id: medicineId, updateData: payload }));
    } else {
      await dispatch(createMedicine(payload));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {medicineId ? "Edit Medicine" : "Add New Medicine"}
          </h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* Alerts */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => dispatch(clearError())} className="underline text-xs">Dismiss</button>
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
              {medicineId ? "Medicine updated successfully!" : "Medicine created successfully!"}
            </div>
          )}

          {/* ── Section 1: Basic Info ─────────────────────────────────── */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Medicine Name *" name="medicine_name" value={formData.medicine_name} onChange={handleChange} placeholder="e.g., Panadol" required />
              <Input label="Generic Name" name="generic_name" value={formData.generic_name} onChange={handleChange} placeholder="e.g., Paracetamol" />
              <Input label="Brand Name" name="brand_name" value={formData.brand_name} onChange={handleChange} placeholder="e.g., GSK" />
              <Input label="Strength" name="strength" value={formData.strength} onChange={handleChange} placeholder="e.g., 500mg" />
              <Select
                label="Dosage Form *"
                name="dosage_form"
                value={formData.dosage_form}
                onChange={handleChange}
                options={DOSAGE_FORMS.map((f) => ({ value: f, label: f }))}
                required
              />
              <Select
                label="Category *"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                required
              />
            </div>
          </section>

          {/* ── Section 2: Unit Hierarchy ─────────────────────────────── */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Unit Configuration</h3>
            <p className="text-xs text-gray-500 mb-4">
              Define how units convert. All stock is stored in the base unit.
            </p>

            {/* Base unit */}
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-3">
              <p className="text-xs font-semibold text-teal-700 mb-3">Base Unit (smallest — stored in DB)</p>
              <Select
                label="Base Unit"
                name="base_unit"
                value={formData.base_unit}
                onChange={(e) => {
                  handleChange(e);
                  setFormData((prev) => ({ ...prev, stock_unit: e.target.value }));
                }}
                options={ALL_UNITS.map((u) => ({ value: u, label: u }))}
              />
            </div>

            {/* Medium unit */}
            <div className="border border-gray-200 rounded-xl p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-700">Medium Unit (e.g. STRIP)</p>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={formData.has_medium_unit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, has_medium_unit: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  Enable
                </label>
              </div>
              {formData.has_medium_unit && (
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Medium Unit"
                    name="medium_unit"
                    value={formData.medium_unit}
                    onChange={handleChange}
                    options={ALL_UNITS.filter((u) => u !== formData.base_unit).map((u) => ({ value: u, label: u }))}
                  />
                  <Input
                    label={`1 ${formData.medium_unit} = ? ${formData.base_unit}`}
                    name="base_per_medium"
                    type="number"
                    min="1"
                    value={formData.base_per_medium}
                    onChange={handleChange}
                    placeholder="e.g., 12"
                  />
                </div>
              )}
            </div>

            {/* Large unit */}
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-700">Large Unit (e.g. BOX)</p>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={formData.has_large_unit}
                    disabled={!formData.has_medium_unit}
                    onChange={(e) => setFormData((prev) => ({ ...prev, has_large_unit: e.target.checked }))}
                    className="w-4 h-4 rounded disabled:opacity-40"
                  />
                  Enable
                </label>
              </div>
              {formData.has_medium_unit && formData.has_large_unit && (
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Large Unit"
                    name="large_unit"
                    value={formData.large_unit}
                    onChange={handleChange}
                    options={ALL_UNITS.filter((u) => u !== formData.base_unit && u !== formData.medium_unit).map((u) => ({ value: u, label: u }))}
                  />
                  <Input
                    label={`1 ${formData.large_unit} = ? ${formData.medium_unit}`}
                    name="medium_per_large"
                    type="number"
                    min="1"
                    value={formData.medium_per_large}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                  />
                </div>
              )}
              {!formData.has_medium_unit && (
                <p className="text-xs text-gray-400">Enable medium unit first</p>
              )}
            </div>

            {/* Live hierarchy preview */}
            {formData.has_medium_unit && (
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-700 mb-1">Conversion preview:</p>
                {formData.has_large_unit && (
                  <p>
                    1 <strong>{formData.large_unit}</strong> = {formData.medium_per_large} {formData.medium_unit}{" "}
                    = {Number(formData.medium_per_large) * Number(formData.base_per_medium)} {formData.base_unit}
                  </p>
                )}
                <p>
                  1 <strong>{formData.medium_unit}</strong> = {formData.base_per_medium} {formData.base_unit}
                </p>
              </div>
            )}
          </section>

          {/* ── Section 3: Pricing ───────────────────────────────────── */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              Pricing <span className="normal-case font-normal text-gray-400">(per {formData.base_unit})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Purchase Price (Rs.)" name="purchase_price" type="number" step="0.01" min="0" value={formData.purchase_price} onChange={handleChange} placeholder="0.00" />
              <Input label="Selling Price (Rs.)" name="selling_price" type="number" step="0.01" min="0" value={formData.selling_price} onChange={handleChange} placeholder="0.00" />
            </div>
          </section>

          {/* ── Section 4: Opening Stock (create only) ───────────────── */}
          {!medicineId && (
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Opening Stock</h3>
              <p className="text-xs text-gray-500 mb-4">
                Entering stock here creates the first batch automatically.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Input
                    label="Quantity"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  <Select
                    label="Unit"
                    name="stock_unit"
                    value={formData.stock_unit}
                    onChange={handleChange}
                    options={stockUnitOptions()}
                  />
                  <Input
                    label={`Reorder Level (${formData.base_unit})`}
                    name="reorder_level"
                    type="number"
                    min="0"
                    value={formData.reorder_level}
                    onChange={handleChange}
                    placeholder="50"
                  />
                </div>
                {conversionPreview() && (
                  <p className="mt-3 text-xs text-amber-700 font-medium">
                    {conversionPreview()}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Reorder level for edit mode */}
          {medicineId && (
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Stock Settings</h3>
              <div className="max-w-xs">
                <Input
                  label={`Reorder Level (${formData.base_unit})`}
                  name="reorder_level"
                  type="number"
                  min="0"
                  value={formData.reorder_level}
                  onChange={handleChange}
                  placeholder="50"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                To add more stock, use the "Add Batch Stock" button in the medicines list.
              </p>
            </section>
          )}

          {/* ── Section 5: Manufacturer & Batch ─────────────────────── */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Manufacturer & Batch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} placeholder="e.g., GSK" />
              <Input label="Storage Condition" name="storage_condition" value={formData.storage_condition} onChange={handleChange} placeholder="e.g., Below 25°C" />
              <Input label="Batch Number" name="batch_number" value={formData.batch_number} onChange={handleChange} placeholder="e.g., BTL-001" />
              <Input label="Expiry Date" name="expiry_date" type="date" value={formData.expiry_date} onChange={handleChange} />
            </div>
          </section>

          {/* ── Section 6: Identifiers ───────────────────────────────── */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Identifiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="SKU" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g., SKU-001" />
              <Input label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} placeholder="e.g., 1234567890" />
            </div>
          </section>

          {/* ── Section 7: Additional ───────────────────────────────── */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Additional</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="requires_prescription"
                  checked={formData.requires_prescription}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Requires Prescription</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Optional description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "INACTIVE", label: "Inactive" },
                  { value: "DISCONTINUED", label: "Discontinued" },
                ]}
              />
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Saving..." : medicineId ? "Update Medicine" : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit, Plus, Search, PackagePlus, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getMedicinesByPharmacy,
  deleteMedicine,
  searchMedicines,
  addMedicineBatchStock,
  clearSuccess,
  clearError,
  formatStock,
  Medicine,
} from "@/redux/slices/medicineSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

// ─── Add Batch Stock Modal ────────────────────────────────────────────────────

interface AddBatchModalProps {
  medicine: Medicine;
  onClose: () => void;
}

function AddBatchModal({ medicine, onClose }: AddBatchModalProps) {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.medicine);

  // Build unit options from the medicine's own unit config
  const unitOptions: string[] = [medicine.base_unit];
  if (medicine.medium_unit) unitOptions.push(medicine.medium_unit);
  if (medicine.large_unit) unitOptions.push(medicine.large_unit);

  const [form, setForm] = useState({
    batch_number: "",
    expiry_date: "",
    quantity: "",
    unit: medicine.base_unit,
    purchase_price: medicine.purchase_price?.toString() || "",
    selling_price: medicine.selling_price?.toString() || "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.batch_number || !form.quantity) return;

    const result = await dispatch(
      addMedicineBatchStock({
        medicineId: medicine.id,
        batch_number: form.batch_number,
        expiry_date: form.expiry_date || undefined,
        quantity: Number(form.quantity),
        unit: form.unit,
        purchase_price: form.purchase_price ? Number(form.purchase_price) : undefined,
        selling_price: form.selling_price ? Number(form.selling_price) : undefined,
        notes: form.notes || undefined,
      })
    );

    if (addMedicineBatchStock.fulfilled.match(result)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Add Batch Stock</h3>
          <p className="text-xs text-gray-500 mt-1">{medicine.medicine_name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
             
              <Input
                type="text"
                required
                value={form.batch_number}
                label=" Batch Number*"
                onChange={(e) => setForm({ ...form, batch_number: e.target.value })}
                placeholder="e.g. BATCH-2025-001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
             
              <Input
                type="number"
                required
                min="1"
                value={form.quantity}
                label=" Quantity*"
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
              <Select
                options={unitOptions.map((u) => ({ value: u, label: u }))}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {unitOptions.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div> */}

            <div>
              
              <Input
                type="number"
                step="0.01"
                min="0"
                label="Purchase Price (Rs.)"
                value={form.purchase_price}
                onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
             
              <Input
                type="number"
                step="0.01"
                min="0"
                label=" Selling Price (Rs.)"
                value={form.selling_price}
                onChange={(e) => setForm({ ...form, selling_price: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-2">
             
              <Input
                type="date"
                label="Expiry Date"
                value={form.expiry_date}
                onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="col-span-2">
             
              <Input
                type="text"
                value={form.notes}
                label="Notes"
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional note"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Unit conversion hint */}
          {form.quantity && Number(form.quantity) > 0 && (
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-xs text-teal-700">
              {(() => {
                const qty = Number(form.quantity);
                const bpm = medicine.base_per_medium || 1;
                const mpl = medicine.medium_per_large || 1;
                let base = qty;
                if (form.unit === medicine.large_unit) base = qty * bpm * mpl;
                else if (form.unit === medicine.medium_unit) base = qty * bpm;
                return `= ${base.toLocaleString()} ${medicine.base_unit} will be added to stock`;
              })()}
            </div>
          )}

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition"
            >
              {loading ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Stock Badge ─────────────────────────────────────────────────────────────

function StockBadge({ medicine }: { medicine: Medicine }) {
  const isLow = medicine.stock_quantity <= medicine.reorder_level;
  const display = formatStock(medicine);

  return (
    <div className="space-y-1">
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          isLow ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {isLow && <AlertTriangle className="w-3 h-3" />}
        {display}
      </span>
      <p className="text-xs text-gray-500">
        Reorder at: {medicine.reorder_level} {medicine.base_unit}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface MedicineListProps {
  onEditMedicine?: (medicineId: string) => void;
  onAddMedicine?: () => void;
}

export default function MedicineList({ onEditMedicine, onAddMedicine }: MedicineListProps) {
  const dispatch = useAppDispatch();
  const { medicines, loading, error, success, total } = useAppSelector(
    (state) => state.medicine
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [batchModalMedicine, setBatchModalMedicine] = useState<Medicine | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMedicinesByPharmacy());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => dispatch(clearSuccess()), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchMedicines(searchQuery));
      } else {
        dispatch(getMedicinesByPharmacy());
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, dispatch]);

  const handleDelete = async (medicineId: string) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      await dispatch(deleteMedicine(medicineId));
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Medicines Inventory</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Stock is tracked in base units ({medicines[0]?.base_unit || "TABLET"})
            </p>
          </div>
          <Button
            onClick={onAddMedicine}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, generic name, brand or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between">
            <span>{error}</span>
            <button onClick={() => dispatch(clearError())} className="underline text-xs">Dismiss</button>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
            Operation completed successfully!
          </div>
        )}

        {/* Loading */}
        {loading && !medicines.length ? (
          <div className="text-center py-12 text-gray-400 text-sm">Loading medicines...</div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No medicines found. Add your first medicine.
          </div>
        ) : (
          <>
            {/* ── Desktop Table ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Medicine</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Units</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Price (Rs.)</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((medicine) => (
                    <>
                      <tr
                        key={medicine.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        {/* Medicine name */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{medicine.medicine_name}</p>
                          <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                          {medicine.dosage_form && (
                            <p className="text-xs text-gray-400">{medicine.dosage_form} {medicine.strength}</p>
                          )}
                        </td>

                        {/* Unit hierarchy */}
                        <td className="px-4 py-3">
                          <div className="text-xs space-y-0.5 text-gray-600">
                            {medicine.large_unit && (
                              <p>
                                <span className="font-medium">{medicine.large_unit}</span>
                                {" = "}{medicine.medium_per_large} {medicine.medium_unit}
                              </p>
                            )}
                            {medicine.medium_unit && (
                              <p>
                                <span className="font-medium">{medicine.medium_unit}</span>
                                {" = "}{medicine.base_per_medium} {medicine.base_unit}
                              </p>
                            )}
                            {!medicine.medium_unit && !medicine.large_unit && (
                              <p className="text-gray-400">Base: {medicine.base_unit}</p>
                            )}
                          </div>
                        </td>

                        {/* Stock with human-readable breakdown */}
                        <td className="px-4 py-3">
                          <StockBadge medicine={medicine} />
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 text-gray-700">
                          <p className="font-medium">
                            Sell: {medicine.selling_price != null ? `Rs. ${medicine.selling_price.toFixed(2)}` : "—"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Buy: {medicine.purchase_price != null ? `Rs. ${medicine.purchase_price.toFixed(2)}` : "—"}
                          </p>
                          <p className="text-xs text-gray-400">per {medicine.base_unit}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              medicine.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-700"
                                : medicine.status === "INACTIVE"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {medicine.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setBatchModalMedicine(medicine)}
                              className="p-2 hover:bg-teal-100 rounded-lg transition"
                              title="Add batch stock"
                            >
                              <PackagePlus className="w-4 h-4 text-teal-600" />
                            </button>
                            <button
                              onClick={() => onEditMedicine?.(medicine.id)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(medicine.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                            <button
                              onClick={() =>
                                setExpandedRow(expandedRow === medicine.id ? null : medicine.id)
                              }
                              className="p-2 hover:bg-gray-100 rounded-lg transition"
                              title="Details"
                            >
                              {expandedRow === medicine.id ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded detail row */}
                      {expandedRow === medicine.id && (
                        <tr key={`${medicine.id}-expanded`} className="bg-gray-50">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600">
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Identifiers</p>
                                <p>Batch: {medicine.batch_number || "—"}</p>
                                <p>Barcode: {medicine.barcode || "—"}</p>
                                <p>SKU: {medicine.sku || "—"}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Storage</p>
                                <p>{medicine.storage_condition || "—"}</p>
                                <p>Rx: {medicine.requires_prescription ? "Required" : "Not required"}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Expiry</p>
                                <p>
                                  {medicine.expiry_date
                                    ? new Date(medicine.expiry_date).toLocaleDateString()
                                    : "—"}
                                </p>
                                <p>Category: {medicine.category || "—"}</p>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-1">Manufacturer</p>
                                <p>{medicine.manufacturer || "—"}</p>
                                <p>{medicine.brand_name || "—"}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile Cards ── */}
            <div className="md:hidden space-y-4">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{medicine.medicine_name}</h3>
                      <p className="text-xs text-gray-500">{medicine.generic_name}</p>
                      {medicine.dosage_form && (
                        <p className="text-xs text-gray-400">{medicine.dosage_form} {medicine.strength}</p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        medicine.status === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {medicine.status}
                    </span>
                  </div>

                  {/* Unit info */}
                  {(medicine.medium_unit || medicine.large_unit) && (
                    <div className="bg-white border border-gray-100 rounded-lg p-2 mb-3 text-xs text-gray-500 space-y-0.5">
                      {medicine.large_unit && (
                        <p>1 {medicine.large_unit} = {medicine.medium_per_large} {medicine.medium_unit} = {(medicine.medium_per_large || 1) * (medicine.base_per_medium || 1)} {medicine.base_unit}</p>
                      )}
                      {medicine.medium_unit && !medicine.large_unit && (
                        <p>1 {medicine.medium_unit} = {medicine.base_per_medium} {medicine.base_unit}</p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Stock</p>
                      <StockBadge medicine={medicine} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Selling Price</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {medicine.selling_price != null
                          ? `Rs. ${medicine.selling_price.toFixed(2)}`
                          : "—"}
                        <span className="text-xs text-gray-400 font-normal"> / {medicine.base_unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setBatchModalMedicine(medicine)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs transition"
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      Add Stock
                    </button>
                    <button
                      onClick={() => onEditMedicine?.(medicine.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(medicine.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-800">{medicines.length}</span> of{" "}
              <span className="font-semibold text-gray-800">{total}</span> medicines
            </div>
          </>
        )}
      </div>

      {/* Add Batch Stock Modal */}
      {batchModalMedicine && (
        <AddBatchModal
          medicine={batchModalMedicine}
          onClose={() => setBatchModalMedicine(null)}
        />
      )}
    </>
  );
}
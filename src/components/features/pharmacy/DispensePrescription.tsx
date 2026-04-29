"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, CheckCircle, Pill, Receipt } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getConsultationByToken,
  dispensePrescriptionByToken,
  clearConsultation,
  clearError,
  clearSuccess,
} from "@/redux/slices/medicineSlice";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface SelectedItem {
  medicineId: string;
  quantity: number;
  unit: string;  // ✅ track which unit user chose (BOX/STRIP/TABLET)
}

export default function DispensePrescription() {
  const dispatch = useAppDispatch();
  const { consultation, loading, error, success } = useAppSelector(
    (state) => state.medicine
  );

  const [tokenNo, setTokenNo] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [dispenseNotes, setDispenseNotes] = useState("");
  const [billResult, setBillResult] = useState<any>(null);

  // ── Search token ─────────────────────────────────────────────────────────
  const handleSearchToken = async () => {
    if (!tokenNo.trim()) return;
    setBillResult(null);
    setSelectedItems([]);
    await dispatch(getConsultationByToken(tokenNo.trim().toUpperCase()));
  };

  // ── Pre-select all prescribed medicines when consultation loads ──────────
  useEffect(() => {
    if (consultation?.consultation?.medicines) {
      const medicines = consultation.consultation.medicines as any[];
      setSelectedItems(
        medicines
          .map((m) => ({
            medicineId: m.medicineId || m.id,
            quantity: Number(m.quantity) || 1,
            unit: m.unit || m.base_unit || "TABLET",
          }))
          .filter((m) => m.medicineId)
      );
    }
  }, [consultation]);

  // ── On success show bill, reset after delay ──────────────────────────────
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 8000); // keep bill visible for 8s
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleToggle = (medicineId: string, checked: boolean, defaultUnit: string) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, { medicineId, quantity: 1, unit: defaultUnit }]);
    } else {
      setSelectedItems((prev) => prev.filter((m) => m.medicineId !== medicineId));
    }
  };

  const handleQuantityChange = (medicineId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev.map((m) => m.medicineId === medicineId ? { ...m, quantity: Math.max(1, quantity) } : m)
    );
  };

  const handleUnitChange = (medicineId: string, unit: string) => {
    setSelectedItems((prev) =>
      prev.map((m) => m.medicineId === medicineId ? { ...m, unit } : m)
    );
  };

  const handleDispense = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one medicine to dispense");
      return;
    }

    // ✅ Send medicineId + quantity + unit to backend
    const medicinesList = selectedItems.map((m) => ({
      medicineId: m.medicineId,
      quantity: m.quantity,
      unit: m.unit,
    }));

    const result = await dispatch(
      dispensePrescriptionByToken({
        tokenNo,
        medicines: medicinesList,
        notes: dispenseNotes || undefined,
      })
    );

    if (dispensePrescriptionByToken.fulfilled.match(result)) {
      setBillResult(result.payload?.data?.bill || null);
    }
  };

  const handleReset = () => {
    setTokenNo("");
    setSelectedItems([]);
    setDispenseNotes("");
    setBillResult(null);
    dispatch(clearConsultation());
    dispatch(clearSuccess());
  };

  // ── Build available unit options for a medicine ──────────────────────────
  const getUnitOptions = (medicine: any): { value: string; label: string }[] => {
    const opts: { value: string; label: string }[] = [];
    if (medicine.base_unit) opts.push({ value: medicine.base_unit, label: medicine.base_unit });
    if (medicine.medium_unit) opts.push({ value: medicine.medium_unit, label: medicine.medium_unit });
    if (medicine.large_unit) opts.push({ value: medicine.large_unit, label: medicine.large_unit });
    if (opts.length === 0) opts.push({ value: "TABLET", label: "TABLET" });
    return opts;
  };

  // ── Patient display name (backend sends fullName) ────────────────────────
  const patientName = consultation?.patient?.fullName
    || consultation?.patient?.name
    || consultation?.patientName
    || "N/A";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Pill className="w-5 h-5 text-teal-600" />
        Dispense by Token
      </h2>

      {/* ── Token Search ─────────────────────────────────────────────── */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Patient Token Number
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={tokenNo}
            onChange={(e) => setTokenNo(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSearchToken()}
            placeholder="e.g., T001"
            className="flex-1 px-4 py-2 border placeholder:caret-black text-black border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
          />
          <Button
            onClick={handleSearchToken}
            disabled={!tokenNo.trim() || loading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </span>
          <button onClick={() => dispatch(clearError())} className="underline text-xs ml-4">Dismiss</button>
        </div>
      )}

      {/* ── Bill Result (after successful dispense) ───────────────────── */}
      {success && billResult && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-emerald-800">Dispensed Successfully</h3>
          </div>

          <div className="space-y-2 mb-4">
            {billResult.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2 border border-emerald-100">
                <div>
                  <p className="font-medium text-gray-900">{item.medicineName}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} {item.quantityUnit}
                    {item.baseQuantity !== item.quantity && ` (${item.baseQuantity} ${item.quantityUnit?.split("_")[0] || "base"})`}
                    {" · "} Stock left: {item.newStock}
                  </p>
                </div>
                <p className="font-bold text-emerald-700">Rs. {item.lineTotal?.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-emerald-200 pt-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">Total Bill</span>
            <span className="text-xl font-black text-emerald-700">Rs. {billResult.totalBill?.toFixed(2)}</span>
          </div>

          <button onClick={handleReset} className="mt-4 w-full py-2 bg-white border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition">
            New Patient
          </button>
        </div>
      )}

      {/* ── Consultation Details ──────────────────────────────────────── */}
      {consultation && !billResult && (
        <>
          {/* Patient card */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Patient Details</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-semibold text-gray-900">{patientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Token</p>
                <p className="font-semibold text-gray-900">{consultation.tokenNo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">{consultation.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  consultation.visitStatus === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {consultation.visitStatus}
                </span>
              </div>
            </div>
            {consultation.consultation?.diagnosis && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-gray-500">Diagnosis</p>
                <p className="text-sm text-gray-800">{consultation.consultation.diagnosis}</p>
              </div>
            )}
          </div>

          {/* Medicine list */}
          {Array.isArray(consultation.consultation?.medicines) &&
          consultation.consultation.medicines.length > 0 ? (
            <>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Prescribed Medicines
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({selectedItems.length}/{consultation.consultation.medicines.length} selected)
                </span>
              </h3>

              <div className="space-y-3 mb-5">
                {consultation.consultation.medicines.map((med: any, idx: number) => {
                  const medicineId = med.medicineId || med.id;
                  const selected = selectedItems.find((s) => s.medicineId === medicineId);
                  const isSelected = !!selected;
                  const unitOptions = getUnitOptions(med);
                  const defaultUnit = med.unit || med.base_unit || "TABLET";

                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl p-4 transition ${
                        isSelected ? "border-teal-300 bg-teal-50" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggle(medicineId, e.target.checked, defaultUnit)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 accent-teal-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              {med.name || med.medicine_name || `Medicine ${idx + 1}`}
                            </p>
                            {med.requires_prescription && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Rx</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            Prescribed: <strong>{med.quantity || "—"} {med.unit || med.base_unit || ""}</strong>
                            {med.dosage_instructions && ` · ${med.dosage_instructions}`}
                          </p>

                          {isSelected && (
                            <div className="flex flex-wrap gap-3 mt-3">
                              {/* Quantity */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={selected?.quantity || 1}
                                  onChange={(e) => handleQuantityChange(medicineId, Number(e.target.value))}
                                  className="w-24 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                              </div>

                              {/* Unit — ✅ allows BOX/STRIP/TABLET selection */}
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                                <select
                                  value={selected?.unit || defaultUnit}
                                  onChange={(e) => handleUnitChange(medicineId, e.target.value)}
                                  className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                  {unitOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>

                              {/* Unit conversion hint */}
                              {selected && (med.base_per_medium || med.medium_per_large) && (
                                <div className="flex items-end">
                                  <span className="text-xs text-teal-600 bg-teal-50 border border-teal-200 rounded px-2 py-1.5">
                                    {(() => {
                                      const qty = selected.quantity;
                                      const bpm = Number(med.base_per_medium) || 1;
                                      const mpl = Number(med.medium_per_large) || 1;
                                      let base = qty;
                                      if (selected.unit === med.large_unit) base = qty * bpm * mpl;
                                      else if (selected.unit === med.medium_unit) base = qty * bpm;
                                      return `= ${base} ${med.base_unit || "TABLET"}`;
                                    })()}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Dispense Notes <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={dispenseNotes}
                  onChange={(e) => setDispenseNotes(e.target.value)}
                  rows={2}
                  placeholder="Special instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleDispense}
                  disabled={selectedItems.length === 0 || loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  {loading ? "Dispensing..." : `Dispense ${selectedItems.length} Medicine${selectedItems.length !== 1 ? "s" : ""}`}
                </Button>
                <Button
                  onClick={handleReset}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg font-medium text-sm"
                >
                  Reset
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-400 text-sm">
              No medicines prescribed for this consultation.
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!consultation && !loading && !error && !billResult && (
        <div className="text-center py-12 text-gray-400">
          <Pill className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Enter a token number to fetch the prescription</p>
        </div>
      )}

      {loading && !consultation && (
        <div className="text-center py-12 text-gray-400 text-sm">Searching...</div>
      )}
    </div>
  );
}
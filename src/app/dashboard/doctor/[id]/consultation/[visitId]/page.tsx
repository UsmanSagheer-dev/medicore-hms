
"use client";

import { useParams } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Stethoscope,
  Pill,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  Download,
  Phone,
  MapPin,
  Cross,
} from "lucide-react";
import { useConsultationPage } from "@/hooks/useConsultationPage";
import Input from "@/components/ui/Input";

const ConsultationPage = () => {
  const params = useParams();
  const doctorId = params.id as string;
  const visitId = params.visitId as string;
  const hook = useConsultationPage(doctorId, visitId);

  if (hook.loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading patient details...</div>
      </div>
    );
  }

  if (hook.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{hook.error}</div>
      </div>
    );
  }

  const visit = hook.currentVisit as any;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={hook.handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-poppins">
                Consultation
              </h1>
              <p className="text-sm text-gray-500 font-poppins">
                {visit?.patientName} • Token #
                {String(visit?.tokenNo || "").padStart(3, "0")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="font-poppins">IN PROGRESS</span>
          </div>
        </div>
      </div>

      {/* Content - Two Column Layout */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - FORM */}
          <div className="space-y-6">
            {/* Symptoms Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900 font-poppins">
                  Add Symptoms
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
                    Symptom
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={hook.newSymptom}
                      onChange={(e) => hook.setNewSymptom(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && hook.handleAddSymptom()
                      }
                      placeholder="e.g., Fever, Headache, Cough..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-poppins"
                    />
                    <button
                      onClick={hook.handleAddSymptom}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm font-poppins"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {hook.symptoms.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-700 font-poppins">
                    Added Symptoms ({hook.symptoms.length})
                  </p>
                  {hook.symptoms.map((symptom, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <p className="text-sm font-semibold text-gray-900 font-poppins flex-1">
                        {symptom}
                      </p>
                      <button
                        onClick={() => hook.handleRemoveSymptom(index)}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Diagnosis Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900 font-poppins">
                  Add Diagnosis
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
                    Diagnosis
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={hook.newDiagnosis}
                      onChange={(e) => hook.setNewDiagnosis(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && hook.handleAddDiagnosis()
                      }
                      placeholder="e.g., Common Cold, Hypertension..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm font-poppins"
                    />
                    <button
                      onClick={hook.handleAddDiagnosis}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm font-poppins"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {hook.diagnoses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-700 font-poppins">
                    Added Diagnoses ({hook.diagnoses.length})
                  </p>
                  {hook.diagnoses.map((diagnosis, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100"
                    >
                      <p className="text-sm font-semibold text-gray-900 font-poppins flex-1">
                        {diagnosis}
                      </p>
                      <button
                        onClick={() => hook.handleRemoveDiagnosis(index)}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Medicines Card */}
            {/* ─── Add Medicines Card — replace the existing one in ConsultationPage.tsx ─── */}

<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
  <div className="flex items-center gap-2 mb-4">
    <Pill className="w-5 h-5 text-emerald-600" />
    <h3 className="font-bold text-gray-900 font-poppins">Add Medicines</h3>
  </div>

  <div className="space-y-3">

    {/* ── Medicine Name + Search Dropdown ── */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
        Medicine Name
      </label>
      <div className="relative">
        <Input
          type="text"
          value={hook.searchQuery}
          onChange={(e) => hook.handleMedicineSearch(e.target.value)}
         onFocus={() => hook.searchResults.length > 0 && hook.handleMedicineSearch(hook.searchQuery)}
          placeholder="Type to search pharmacy medicines..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-poppins"
        />

        {/* Loading indicator */}
        {hook.searchLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Dropdown results */}
        {hook.showDropdown && hook.searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-y-auto">
            {hook.searchResults.map((med: any) => (
              <button
                key={med.id}
                type="button"
                onClick={() => hook.handleSelectPharmacyMedicine(med)}
                className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 font-poppins">
                      {med.medicine_name}
                    </p>
                    <p className="text-xs text-gray-500 font-poppins">
                      {[med.generic_name, med.strength, med.dosage_form]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-emerald-700 font-poppins">
                      Stock: {med.stock_quantity} {med.base_unit}
                    </p>
                    {med.selling_price && (
                      <p className="text-xs text-gray-400 font-poppins">
                        Rs. {med.selling_price}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {hook.showDropdown && !hook.searchLoading && hook.searchResults.length === 0 && hook.searchQuery.trim() && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
            <p className="px-4 py-3 text-sm text-gray-400 font-poppins">
              No medicines found in pharmacy
            </p>
          </div>
        )}
      </div>

      {/* Selected medicine confirmation badge */}
      {hook.newMedicine.medicineId && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-xs text-emerald-700 font-medium font-poppins">
            Linked to pharmacy: {hook.newMedicine.name}
          </p>
        </div>
      )}

      {/* Warning if name typed but no selection */}
    {hook.showDropdown && hook.searchResults.length > 0 && !hook.newMedicine.medicineId && (
  <p className="mt-1 text-xs text-amber-600 font-poppins">
    Please select from dropdown — pharmacy needs the medicine ID to dispense
  </p>
)}
    </div>

    {/* ── Dosage ── */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
        Dosage
      </label>
      <Input
        type="text"
        value={hook.newMedicine.dosage}
        onChange={(e) => hook.setNewMedicine({ ...hook.newMedicine, dosage: e.target.value })}
        placeholder="e.g., 500mg"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-poppins"
      />
    </div>

    {/* ── Frequency ── */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
        Frequency
      </label>
      <Input
        type="text"
        value={hook.newMedicine.frequency}
        onChange={(e) => hook.setNewMedicine({ ...hook.newMedicine, frequency: e.target.value })}
        placeholder="e.g., 3 times daily"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-poppins"
      />
    </div>

    {/* ── Duration ── */}
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
        Duration
      </label>
      <Input
        type="text"
        value={hook.newMedicine.duration}
        onChange={(e) => hook.setNewMedicine({ ...hook.newMedicine, duration: e.target.value })}
        placeholder="e.g., 5 days"
        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-poppins"
      />
    </div>

    {/* ── Quantity + Unit ── */}
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
          Quantity
        </label>
        <Input
          type="number"
          min="1"
          value={hook.newMedicine.quantity}
          onChange={(e) =>
            hook.setNewMedicine({ ...hook.newMedicine, quantity: Number(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-poppins"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-poppins">
          Unit
        </label>
        <Input
          type="text"
          value={hook.newMedicine.unit}
          onChange={(e) =>
            hook.setNewMedicine({ ...hook.newMedicine, unit: e.target.value.toUpperCase() })
          }
          placeholder="TABLET"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm font-poppins uppercase"
        />
      </div>
    </div>

    {/* ── Add Button ── */}
    <button
      onClick={hook.handleAddMedicine}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors text-sm mt-2 font-poppins"
    >
      <Plus className="w-4 h-4" />
      Add Medicine
    </button>
  </div>

  {/* ── Added medicines list ── */}
  {hook.medicines.length > 0 && (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
      <p className="text-xs font-semibold text-gray-700 font-poppins">
        Added Medicines ({hook.medicines.length})
      </p>
      {hook.medicines.map((medicine) => (
        <div
          key={medicine.id}
          className="flex items-start justify-between gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 font-poppins">
                {medicine.name}
              </p>
              {/* Green dot = linked to pharmacy, red = not linked */}
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  medicine.medicineId ? "bg-emerald-500" : "bg-red-400"
                }`}
                title={medicine.medicineId ? "Linked to pharmacy" : "Not linked — cannot dispense"}
              />
            </div>
            <p className="text-xs text-gray-600 font-poppins">
              {medicine.dosage} · {medicine.frequency} · {medicine.duration}
              {medicine.quantity && ` · Qty: ${medicine.quantity} ${medicine.unit || ""}`}
            </p>
          </div>
          <button
            onClick={() => hook.handleRemoveMedicine(medicine.id)}
            className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )}
</div>

            {/* Next Follow-up Date */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900 font-poppins">
                  Next Follow-up
                </h3>
              </div>
              <Input
                type="date"
                name="nextFollowUp"
                value={hook.formData.nextFollowUp}
                onChange={hook.handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm font-poppins"
              />
            </div>

            {/* Test Recommendations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900 font-poppins">
                  Test Recommendations
                </h3>
              </div>
              <textarea
                name="testRecommendations"
                value={hook.formData.testRecommendations}
                onChange={hook.handleInputChange}
                placeholder="e.g., Blood Test, X-Ray, Ultrasound..."
                className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none text-sm font-poppins"
              />
            </div>
          </div>

          {/* RIGHT COLUMN - PRESCRIPTION PREVIEW */}
          <div className="sticky top-6">
            {/* Live Preview */}
            <div
              className="bg-white shadow-lg overflow-hidden"
              style={{ height: "fit-content" }}
            >
              {/* Prescription Header */}
              <div
                className="relative overflow-hidden"
                style={{ backgroundColor: "#fff", height: "118px" }}
              >
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{ height: "8px", backgroundColor: "#7bb534", zIndex: 3 }}
                />
                <div
                  className="absolute left-0 top-0 flex flex-col justify-center px-5"
                  style={{
                    backgroundColor: "#7bb534",
                    width: "52%",
                    height: "100%",
                    clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)",
                    zIndex: 2,
                  }}
                >
                  <p className="font-bold text-white text-lg leading-tight font-poppins">
                    Dr. {hook.doctorUser?.doctor?.full_name || "Dr. [Your Name]"}
                  </p>
                  <p className="text-xs text-white opacity-90 mt-0.5 font-poppins">
                    {hook.doctorUser?.doctor?.specialization || "Specialist Doctor"}
                  </p>
                  <p className="text-xs text-white opacity-80 mt-1 font-poppins">
                    Qualification:{" "}
                    {hook.doctorUser?.doctor?.qualifications || "---"}
                  </p>
                </div>
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 5,
                    backgroundColor: "#7bb534",
                    borderRadius: "50%",
                    width: "52px",
                    height: "52px",
                    border: "3px solid white",
                  }}
                >
                 <Cross/>
                </div>
                <div
                  className="absolute right-0 top-1 flex flex-col justify-end px-6"
                  style={{ width: "32%", height: "100%", zIndex: 1 }}
                >
                  <p
                    className="font-bold text-sm font-poppins"
                    style={{ color: "#7bb534" }}
                  >
                    WHEN PATIENTS VISIT
                  </p>
                  <p className="text-xs text-gray-700 mt-1 font-poppins">
                    MORNING:- 8AM – 11:30AM
                  </p>
                  <p className="text-xs text-gray-700 font-poppins">
                    NOON:- 3PM – 9PM
                  </p>
                  <p className="text-xs text-gray-700 font-poppins">
                    SUNDAY OFF DAY
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    your webpage name here
                  </p>
                  <p className="text-xs text-gray-400">your mail name here</p>
                </div>
              </div>

              {/* Patient Info */}
              <div
                className="p-6 space-y-4 border-t-4 mt-2 border-gray-900"
                style={{ backgroundColor: "#e7efda" }}
              >
                <div className="flex justify-between text-sm w-full">
                  <div className="flex justify-start items-center w-full">
                    <span className="font-bold text-gray-700 text-sm font-poppins">
                      S. No.
                    </span>
                    <div className="border-b-2 border-gray-400 w-fit">
                      <p className="text-gray-600 font-semibold ml-1 font-poppins">
                        #{String(visit?.tokenNo || "").padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-fit">
                    <span className="font-bold text-gray-700 font-poppins">
                      Date:
                    </span>
                    <div className="border-b-2 border-gray-400">
                      <p className="text-gray-700 text-sm font-poppins">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-start items-center gap-3">
                  <label className="font-bold text-gray-700 text-nowrap text-sm font-poppins">
                    Patient Name:
                  </label>
                  <div className="border-b-2 border-gray-400 w-full">
                    <p className="text-gray-700 text-sm font-poppins">
                      {visit?.patientName || "___________________________"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 text-xs gap-2">
                  <div className="flex justify-center items-center">
                    <label className="font-poppins font-bold text-sm text-gray-700">
                      Age:
                    </label>
                    <div className="border-b-2 border-gray-400 w-full">
                      <p className="font-poppins text-gray-700">
                        {visit?.age || "---"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <label className="font-poppins font-bold text-sm text-gray-700">
                      Gender:
                    </label>
                    <div className="border-b-2 border-gray-400 w-full">
                      <p className="font-poppins text-gray-700 ml-2">
                        {visit?.gender || "---"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="font-poppins font-bold text-sm text-gray-700 text-nowrap">
                      Visit Type:
                    </label>
                    <div className="border-b-2 border-gray-400 w-full">
                      <p className="font-poppins text-gray-700 ml-2">
                        {visit?.visitType || "New"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chief Complaint + Medicines */}
              <div className="flex w-full h-150 border-y border-gray-900">
                <div className="border-r-2 border-gray-900 w-[35%] flex flex-col h-full">
                  <div className="flex-1 flex flex-col p-6 border-b">
                    <p className="text-sm font-bold text-gray-700 uppercase mb-3 font-poppins">
                      Chief Complaint
                    </p>
                    {hook.symptoms.length > 0 ? (
                      <div className="space-y-1 flex-1">
                        {hook.symptoms.map((symptom: string, index: number) => (
                          <p
                            key={index}
                            className="text-sm text-gray-600 p-1 font-poppins"
                          >
                            • {symptom}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No symptoms added
                      </p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-6">
                    <p className="text-sm font-bold text-gray-700 uppercase mb-3 px-2 py-1 rounded w-fit font-poppins">
                      Diagnosis
                    </p>
                    {hook.diagnoses.length > 0 ? (
                      <div className="space-y-1 flex-1">
                        {hook.diagnoses.map((diagnosis: string, index: number) => (
                          <p
                            key={index}
                            className="text-sm text-gray-600 p-1 font-poppins"
                          >
                            • {diagnosis}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No diagnosis added
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-4 border-gray-300 w-[65%]">
                  <p className="text-3xl font-bold text-gray-700 mb-3">℞</p>
                  {hook.medicines.length > 0 ? (
                    <div className="space-y-2">
                      {hook.medicines.map((medicine: any, index: number) => (
                        <div key={medicine.id} className="flex gap-3 text-sm">
                          <span className="font-bold text-gray-700 w-6 font-poppins">
                            {index + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 font-poppins">
                              {medicine.name}
                            </p>
                            <p className="text-xs text-gray-600 font-poppins">
                              {medicine.dosage} - {medicine.frequency} - {medicine.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No medicines added yet
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Signature */}
              <div className="pt-6 pb-2 px-6 w-full">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-center flex w-full items-center">
                    <p className="text-xs font-bold text-gray-700 text-nowrap uppercase font-poppins">
                      Doctor Signature:
                    </p>
                    <div className="border border-gray-800 w-full" />
                  </div>
                  <div className="flex items-center justify-start gap-2 w-full">
                    <p className="text-xs font-bold text-gray-700 uppercase font-poppins">
                      Next Follow-up:
                    </p>
                    {hook.formData.nextFollowUp ? (
                      <p
                        className="text-sm font-semibold border-b-2 border-gray-700 font-poppins"
                        style={{ color: "#1e3a8a" }}
                      >
                        {new Date(
                          hook.formData.nextFollowUp,
                        ).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 italic">
                        No Follow-up Needed
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Contact */}
              <div className="bg-gray-50 border-t border-gray-200 pt-4 px-6 pb-2">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <div className="ml-2">
                      <p className="text-gray-600 font-poppins">
                        {hook.doctorUser?.doctor?.phone || "+92 XXX-XXXXXXX"}
                      </p>
                      <p className="text-gray-600 font-poppins">
                        {hook.doctorUser?.doctor?.email || "doctor@clinic.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <p className="text-gray-600 font-poppins">
                      {hook.doctorUser?.doctor?.clinic_city ||
                        "123 Medical Plaza, Healthcare City"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              {hook.saveMessage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium font-poppins">
                  <CheckCircle className="w-4 h-4" />
                  {hook.saveMessage}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={hook.generatePDF}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors text-sm font-poppins"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={hook.handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-sm font-poppins"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={hook.handleComplete}
                  disabled={hook.isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed font-poppins"
                >
                  <CheckCircle className="w-4 h-4" />
                  {hook.isSubmitting ? "Completing..." : "Complete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
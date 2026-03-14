"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getVistByDoctor,
  createConsultation,
} from "@/redux/slices/patientVisitSlice";
import { generatePrescriptionPDF } from "@/lib/generatePrescriptionPDF";
import {
  ArrowLeft,
  User,
  Clock,
  FileText,
  Stethoscope,
  Pill,
  ClipboardList,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  Download,
} from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const ConsultationPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const doctorId = params.id as string;
  const visitId = params.visitId as string;

  const { visits, loading, error } = useAppSelector(
    (state) => state.patientVisit,
  );
  const { user: doctorUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log("Doctor User Data:", doctorUser);
  }, [doctorUser]);

  // Find visit from visits array
  const currentVisit = useMemo(() => {
    return visits.find((v) => v.id === visitId);
  }, [visits, visitId]);

  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    notes: "",
    testRecommendations: "",
    nextFollowUp: "",
  });

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    // If visit not found in state, fetch visits for this doctor
    if (!currentVisit && doctorId) {
      dispatch(getVistByDoctor(doctorId));
    }
  }, [dispatch, doctorId, currentVisit]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`consultation_draft_${visitId}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const draftData = draft.formData || draft;

        console.log("📂 Loading Draft from localStorage:", draft);

        // Ensure all required fields exist
        const mergedFormData = {
          symptoms: "",
          diagnosis: "",
          notes: "",
          testRecommendations: "",
          nextFollowUp: "",
          ...draftData,
        };

        setFormData(mergedFormData);
        setMedicines(draft.medicines || []);
        console.log("✅ Draft Loaded Successfully");
      } catch (e) {
        console.error("❌ Error loading draft:", e);
      }
    }
  }, [visitId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMedicine = () => {
    if (!newMedicine.name.trim()) {
      alert("Please enter medicine name");
      return;
    }
    const medicine: Medicine = {
      id: Date.now().toString(),
      ...newMedicine,
    };
    console.log("💊 Medicine Added:", medicine);
    setMedicines([...medicines, medicine]);
    setNewMedicine({ name: "", dosage: "", frequency: "", duration: "" });
  };

  const handleRemoveMedicine = (id: string) => {
    console.log("🗑️ Medicine Removed, ID:", id);
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const handleSave = () => {
    // Save to localStorage as draft
    const cleanedFormData = {
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      notes: formData.notes,
      testRecommendations: formData.testRecommendations,
      nextFollowUp: formData.nextFollowUp,
    };
    const draftData = { formData: cleanedFormData, medicines };

    console.log("📝 Saving Draft...");
    console.log("Draft Data:", draftData);

    localStorage.setItem(
      `consultation_draft_${visitId}`,
      JSON.stringify(draftData),
    );
    setSaveMessage("Draft saved successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      const prescriptionText = medicines
        .map((m) => `${m.name} - ${m.dosage} - ${m.frequency} - ${m.duration}`)
        .join("\n");

      console.log("=== CONSULTATION COMPLETE ===");
      console.log("Visit ID:", visitId);
      console.log("Symptoms:", formData.symptoms);
      console.log("Diagnosis:", formData.diagnosis);
      console.log("Notes:", formData.notes);
      console.log("Test Recommendations:", formData.testRecommendations);
      console.log("Next Follow-up:", formData.nextFollowUp);
      console.log("Total Medicines:", medicines.length);
      console.log("Medicines:", medicines);
      console.log("Prescription Text:", prescriptionText);

      const consultationPayload = {
        visitId,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        prescription: prescriptionText,
        medicines: medicines,
        testRecommendations: formData.testRecommendations,
        nextFollowUp: formData.nextFollowUp
          ? new Date(formData.nextFollowUp).toISOString()
          : undefined,
        notes: formData.notes,
      };

      console.log("Sending Consultation Data:", consultationPayload);
      console.log("=============================");

      await dispatch(createConsultation(consultationPayload)).unwrap();

      console.log("✅ Consultation saved successfully!");

      // Generate PDF before clearing draft
      await generatePrescriptionPDF({
        elementRef: prescriptionRef,
        patientName: visit?.patientName,
      });

      localStorage.removeItem(`consultation_draft_${visitId}`);
      router.push(`/dashboard/doctor/${doctorId}`);
    } catch (error) {
      console.error("❌ Error completing consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => {
    await generatePrescriptionPDF({
      elementRef: prescriptionRef,
      patientName: visit?.patientName,
    });
  };

  const handleBack = () => {
    // Auto-save draft when going back
    const cleanedFormData = {
      symptoms: formData.symptoms,
      diagnosis: formData.diagnosis,
      notes: formData.notes,
      testRecommendations: formData.testRecommendations,
      nextFollowUp: formData.nextFollowUp,
    };
    const draftData = { formData: cleanedFormData, medicines };
    localStorage.setItem(
      `consultation_draft_${visitId}`,
      JSON.stringify(draftData),
    );
    router.push(`/dashboard/doctor/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading patient details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const visit = currentVisit as any;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Consultation</h1>
              <p className="text-sm text-gray-500">
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
            IN PROGRESS
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
                <h3 className="font-bold text-gray-900">Symptoms</h3>
              </div>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Enter patient symptoms..."
                className="w-full  p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
              />
            </div>

            {/* Diagnosis Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Diagnosis</h3>
              </div>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis..."
                className="w-full  p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-sm"
              />
            </div>

            {/* Add Medicines Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900">Add Medicines</h3>
              </div>

              <div className="space-y-3">
                {/* Medicine Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Medicine Name
                  </label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, name: e.target.value })
                    }
                    placeholder="e.g., Paracetamol"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newMedicine.dosage}
                    onChange={(e) =>
                      setNewMedicine({ ...newMedicine, dosage: e.target.value })
                    }
                    placeholder="e.g., 500mg"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={newMedicine.frequency}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        frequency: e.target.value,
                      })
                    }
                    placeholder="e.g., 3 times daily"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newMedicine.duration}
                    onChange={(e) =>
                      setNewMedicine({
                        ...newMedicine,
                        duration: e.target.value,
                      })
                    }
                    placeholder="e.g., 5 days"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                  />
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddMedicine}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors text-sm mt-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Medicine
                </button>
              </div>

              {/* Medicines List */}
              {medicines.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <p className="text-xs font-semibold text-gray-700">
                    Added Medicines ({medicines.length})
                  </p>
                  {medicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className="flex items-start justify-between gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {medicine.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {medicine.dosage} • {medicine.frequency} •{" "}
                          {medicine.duration}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveMedicine(medicine.id)}
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
                <h3 className="font-bold text-gray-900">Next Follow-up</h3>
              </div>
              <input
                type="date"
                name="nextFollowUp"
                value={formData.nextFollowUp}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
              />
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Additional Notes</h3>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-sm"
              />
            </div>

            {/* Test Recommendations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900">
                  Test Recommendations
                </h3>
              </div>
              <textarea
                name="testRecommendations"
                value={formData.testRecommendations}
                onChange={handleInputChange}
                placeholder="e.g., Blood Test, X-Ray, Ultrasound..."
                className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none text-sm"
              />
            </div>
          </div>

          {/* RIGHT COLUMN - PRESCRIPTION SHEET PREVIEW */}
          <div className="sticky top-6">
            <div
              ref={prescriptionRef}
              className="bg-white shadow-lg overflow-hidden"
              style={{ height: "fit-content" }}
            >
              {/* Prescription Header */}
              <div
                className="relative  overflow-hidden"
                style={{ backgroundColor: "#fff", height: "118px" }}
              >
                {/* Dark diagonal strips at top - absolute positioned */}
                <div
                  className="absolute top-0 left-0 w-full"
                  style={{
                    height: "8px",
                    backgroundColor: "#7bb534",
                    zIndex: 3,
                  }}
                />

                {/* Green left section */}
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
                  <p className="font-bold text-white text-lg leading-tight">
                    Dr. {doctorUser?.doctor?.full_name || "Dr. [Your Name]"}
                  </p>
                  <p className="text-xs text-white opacity-90 mt-0.5">
                    {doctorUser?.doctor?.specialization || "Specialist Doctor"}
                  </p>
                  <p className="text-xs text-white opacity-80 mt-1">
                    Qualification: {doctorUser?.doctor?.qualifications || "---"}
                  </p>
                </div>

                {/* Shield icon - center */}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    width="28"
                    height="28"
                  >
                    <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" />
                    <path
                      d="M11 13H9v-2h2V9h2v2h2v2h-2v2h-2v-2z"
                      fill="white"
                    />
                  </svg>
                </div>

                {/* Right section - timing info */}
                <div
                  className="absolute right-0 top-1 flex flex-col justify-end px-6"
                  style={{
                    width: "32%",
                    height: "100%",
                    zIndex: 1,
                  }}
                >
                  <p className="font-bold text-sm" style={{ color: "#7bb534" }}>
                    WHEN PATIENTS VISIT
                  </p>
                  <p className="text-xs text-gray-700 mt-1">
                    MORNING:- 8AM – 11:30AM
                  </p>
                  <p className="text-xs text-gray-700">NOON:- 3PM – 9PM</p>
                  <p className="text-xs text-gray-700">SUNDAY OFF DAY</p>
                  <p className="text-xs text-gray-400 mt-1">
                    your webpage name here
                  </p>
                  <p className="text-xs text-gray-400">your mail name here</p>
                </div>
              </div>
              {/* patient styling and data */}
              <div className="p-6 space-y-4 border-t-4 mt-2 border-gray-900 bg-[#e7efda]">
                {/* Header Row */}
                <div className="flex justify-between  text-sm w-full">
                  <div className="flex justify-start items-center w-full">
                    <span className="font-bold text-gray-700 text-sm">S. No.</span>
                    <div className="border-b-2 border-gray-400 w-fit ">
                      <p className="text-gray-900 font-semibold">
                        #{String(visit?.tokenNo || "").padStart(3, "0")}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-fit">
                    <span className="font-bold text-gray-700">Date:</span>
                    <div className="border-b-2 border-gray-400">
                      <p className="text-gray-900 text-sm">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Patient Name */}
                <div className="flex w-full justify-start items-center gap-3">
                  <label className="font-bold text-gray-700 text-nowrap text-sm">
                    Patient Name:
                  </label>
                  <div className="border-b-2 border-gray-400  w-full">
                    <p className="font-semibold text-gray-900 text-sm">
                      {visit?.patientName || "___________________________"}
                    </p>
                  </div>
                </div>

                {/* Patient Details Row */}
                <div className="grid grid-cols-3  text-xs gap-2">
                  <div className="flex justify-center items-center">
                    <label className="font-bold text-sm text-gray-700">
                      Age:
                    </label>
                    <div className="border-b-2 border-gray-400 w-full">
                      <p className="text-gray-900">{visit?.age || "---"}</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <label className="font-bold text-sm text-gray-700">
                      Gender:
                    </label>
                    <div className="border-b-2 border-gray-400 w-full">
                      <p className="text-gray-900">{visit?.gender || "---"}</p>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <label className="font-bold text-sm text-gray-700 text-nowrap ">
                      Visit Type:
                    </label>
                    <div className="border-b-2 border-gray-400 w-full">
                      <p className="text-gray-900">{visit?.visitType || "New"}</p>
                    </div>
                  </div>
                </div>


              </div>

              {/* Chief Complaint & Diagnosis */}
              <div className="p-6 space-y-4 border-b-2 border-gray-300">
                {formData.symptoms && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                      Chief Complaint
                    </p>
                    <p
                      className="text-sm text-gray-800 p-2 rounded border border-gray-200"
                      style={{ backgroundColor: "#f9fafb" }}
                    >
                      {formData.symptoms}
                    </p>
                  </div>
                )}
                {formData.diagnosis && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                      Diagnosis
                    </p>
                    <p
                      className="text-sm text-gray-800 p-2 rounded border border-gray-200"
                      style={{ backgroundColor: "#f9fafb" }}
                    >
                      {formData.diagnosis}
                    </p>
                  </div>
                )}
              </div>

              {/* Medicines/Prescription */}
              <div className="p-6 border-b-2 border-gray-300">
                <p className="text-xs font-bold text-gray-700 uppercase mb-3">
                  Medicines
                </p>
                {medicines.length > 0 ? (
                  <div className="space-y-2">
                    {medicines.map((medicine, index) => (
                      <div key={medicine.id} className="flex gap-3 text-sm">
                        <span className="font-bold text-gray-700 w-6">
                          {index + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {medicine.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {medicine.dosage} - {medicine.frequency} -{" "}
                            {medicine.duration}
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

              {/* Test Recommendations */}
              {formData.testRecommendations && (
                <div className="p-6 border-b-2 border-gray-300">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                    Test Recommendations
                  </p>
                  <p
                    className="text-sm text-gray-800 p-2 rounded border border-gray-200"
                    style={{ backgroundColor: "#fef2f2" }}
                  >
                    {formData.testRecommendations}
                  </p>
                </div>
              )}

              {/* Follow-up Date */}
              {formData.nextFollowUp && (
                <div
                  className="p-6 border-b-2 border-gray-300"
                  style={{ backgroundColor: "#f0f9ff" }}
                >
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                    Next Follow-up
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "#1e3a8a" }}
                  >
                    {new Date(formData.nextFollowUp).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Additional Notes */}
              {formData.notes && (
                <div className="p-6 border-b-2 border-gray-300">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                    Additional Notes
                  </p>
                  <p
                    className="text-sm text-gray-800 p-2 rounded border border-gray-200"
                    style={{ backgroundColor: "#f9fafb" }}
                  >
                    {formData.notes}
                  </p>
                </div>
              )}

              {/* Footer Signature Area */}
              <div className="p-6 pt-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="h-16 border-t-2 border-gray-800 mb-1" />
                    <p className="text-xs font-bold text-gray-700">
                      Doctor Signature
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-2">
                      {formData.nextFollowUp
                        ? new Date(formData.nextFollowUp).toLocaleDateString()
                        : ""}
                    </p>
                    <p className="text-xs font-semibold text-gray-700">Date</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              {saveMessage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {saveMessage}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={generatePDF}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-semibold transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? "Completing..." : "Complete"}
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

"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getVistByDoctor, createConsultation } from "@/redux/slices/patientVisitSlice";
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
} from "lucide-react";

const ConsultationPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const doctorId = params.id as string;
  const visitId = params.visitId as string;

  const { visits, loading, error } = useAppSelector(
    (state) => state.patientVisit
  );

  // Find visit from visits array
  const currentVisit = useMemo(() => {
    return visits.find((v) => v.id === visitId);
  }, [visits, visitId]);

  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    prescription: "",
    notes: "",
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
        setFormData(draft);
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, [visitId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Save to localStorage as draft
    localStorage.setItem(`consultation_draft_${visitId}`, JSON.stringify(formData));
    setSaveMessage("Draft saved successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      await dispatch(
        createConsultation({
          visitId,
          symptoms: formData.symptoms,
          diagnosis: formData.diagnosis,
          prescription: formData.prescription,
          notes: formData.notes,
        })
      ).unwrap();
      localStorage.removeItem(`consultation_draft_${visitId}`);
      router.push(`/dashboard/doctor/${doctorId}`);
    } catch (error) {
      console.error("Error completing consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Auto-save draft when going back
    localStorage.setItem(`consultation_draft_${visitId}`, JSON.stringify(formData));
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
    <div className="h-full flex flex-col overflow-hidden">
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
                Patient consultation in progress
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

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  {visit?.patientName || "Patient"}
                </h2>
                <p className="text-sm text-gray-500">
                  Token #{String(visit?.tokenNo || "").padStart(3, "0")}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Age</span>
                <span className="font-medium text-gray-900">
                  {visit?.age || "--"} years
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium text-gray-900">
                  {visit?.gender || "--"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-900">
                  {visit?.phoneNumber || "--"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Visit Type</span>
                <span
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    visit?.visitType === "New"
                      ? "bg-blue-100 text-blue-700"
                      : visit?.visitType === "Follow up"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {visit?.visitType || "New"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {visit?.time || "--:--"}
                </span>
              </div>
            </div>
          </div>

          {/* Consultation Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symptoms */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-900">Symptoms</h3>
              </div>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="Enter patient symptoms..."
                className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* Diagnosis */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-gray-900">Diagnosis</h3>
              </div>
              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="Enter diagnosis..."
                className="w-full h-24 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              />
            </div>

            {/* Prescription */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-gray-900">Prescription</h3>
              </div>
              <textarea
                name="prescription"
                value={formData.prescription}
                onChange={handleInputChange}
                placeholder="Enter prescription details..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              />
            </div>

            {/* Additional Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-gray-900">Additional Notes</h3>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4">
              {/* Save Message Toast */}
              {saveMessage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  {saveMessage}
                </div>
              )}
              {!saveMessage && <div />}
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isSubmitting ? "Completing..." : "Complete Consultation"}
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

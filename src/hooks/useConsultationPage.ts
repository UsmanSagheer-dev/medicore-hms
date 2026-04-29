"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createConsultation,
  getVistByDoctor,
} from "@/redux/slices/patientVisitSlice";
import { searchMedicines } from "@/redux/slices/medicineSlice";
import { generatePrescriptionPDF } from "@/lib/generatePrescriptionPDF";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Medicine {
  id: string;           // local list ID (Date.now string)
  medicineId?: string;  // ← pharmacy DB ID — required for dispensing
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity?: number;
  unit?: string;
}

interface FormData {
  notes: string;
  testRecommendations: string;
  nextFollowUp: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useConsultationPage = (doctorId: string, visitId: string) => {
  const router   = useRouter();
  const dispatch = useAppDispatch();

  const { visits, loading, error, latestConsultation } = useAppSelector(
    (state) => state.patientVisit,
  );
  const { user: doctorUser } = useAppSelector((state) => state.auth);

  // pharmacy medicines from redux (populated by searchMedicines thunk)
  const { medicines: pharmacyMedicines } = useAppSelector(
    (state) => state.medicine,
  );

  const currentVisit = useMemo(
    () => visits.find((v) => v.id === visitId),
    [visits, visitId],
  );

  // ── Form state ──────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState<FormData>({
    notes: "",
    testRecommendations: "",
    nextFollowUp: "",
  });

  const [symptoms,     setSymptoms]     = useState<string[]>([]);
  const [newSymptom,   setNewSymptom]   = useState("");
  const [diagnoses,    setDiagnoses]    = useState<string[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [medicines,    setMedicines]    = useState<Medicine[]>([]);

  const [newMedicine, setNewMedicine] = useState({
    name:      "",
    dosage:    "",
    frequency: "",
    duration:  "",
    quantity:  1,
    unit:      "",
    // internal — tracks which pharmacy medicine was selected
    medicineId:   "",
    selectedName: "",   // display name from DB
  });

  // ── Medicine search state ───────────────────────────────────────────────────
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchResults,  setSearchResults]  = useState<any[]>([]);
  const [showDropdown,   setShowDropdown]   = useState(false);
  const [searchLoading,  setSearchLoading]  = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // ── Misc ────────────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage,  setSaveMessage]  = useState<string | null>(null);

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!currentVisit && doctorId) {
      dispatch(getVistByDoctor(doctorId));
    }
  }, [dispatch, doctorId, currentVisit]);

  // Load draft from localStorage
  useEffect(() => {
    if (!visitId) return;
    const savedDraft = localStorage.getItem(`consultation_draft_${visitId}`);
    if (!savedDraft) return;
    try {
      const draft = JSON.parse(savedDraft);
      setFormData({ notes: "", testRecommendations: "", nextFollowUp: "", ...(draft.formData || draft) });
      setSymptoms(draft.symptoms   || []);
      setDiagnoses(draft.diagnoses || []);
      setMedicines(draft.medicines || []);
    } catch (e) {
      console.error("Error loading draft:", e);
    }
  }, [visitId]);

  // Pre-fill data for FOLLOWUP visits
  useEffect(() => {
    if (!currentVisit || currentVisit.visitType !== "FOLLOWUP" || !latestConsultation) return;
    if (localStorage.getItem(`consultation_draft_${visitId}`)) return;

    if (latestConsultation.symptoms) {
      setSymptoms(latestConsultation.symptoms.split(",").map((s: string) => s.trim()).filter(Boolean));
    }
    if (latestConsultation.diagnosis) {
      setDiagnoses(latestConsultation.diagnosis.split(",").map((d: string) => d.trim()).filter(Boolean));
    }
    if (Array.isArray(latestConsultation.medicines)) {
      setMedicines(
        latestConsultation.medicines.map((m: any) => ({
          id:         Date.now().toString() + Math.random(),
          medicineId: m.medicineId || m.id || "",
          name:       m.name      || "",
          dosage:     m.dosage    || "",
          frequency:  m.frequency || "",
          duration:   m.duration  || "",
          quantity:   m.quantity  || 1,
          unit:       m.unit      || "",
        })),
      );
    }
    const latestFollowUp = latestConsultation.nextFollowUp;
    if (latestFollowUp) {
      try {
        setFormData((p) => ({
          ...p,
          nextFollowUp: new Date(latestFollowUp).toISOString().split("T")[0],
        }));
      } catch {}
    }
    const latestTestRecommendations = latestConsultation.testRecommendations || "";
    if (latestTestRecommendations) {
      setFormData((p) => ({ ...p, testRecommendations: latestTestRecommendations }));
    }
    const latestNotes = latestConsultation.notes || "";
    if (latestNotes) {
      setFormData((p) => ({ ...p, notes: latestNotes }));
    }
  }, [currentVisit, latestConsultation, visitId]);

  // ── Medicine search — debounced ─────────────────────────────────────────────

  const handleMedicineSearch = (query: string) => {
    setSearchQuery(query);
    setNewMedicine((prev) => ({ ...prev, name: query, medicineId: "", selectedName: "" }));

    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setSearchLoading(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        const result = await dispatch(searchMedicines(query)).unwrap();
        const list = result?.data || [];
        setSearchResults(list);
        setShowDropdown(list.length > 0);
      } catch {
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
  };

  // Doctor picks a medicine from dropdown
  const handleSelectPharmacyMedicine = (med: any) => {
    setSearchQuery(med.medicine_name);
    setNewMedicine((prev) => ({
      ...prev,
      name:         med.medicine_name,
      medicineId:   med.id,
      selectedName: med.medicine_name,
      unit:         med.base_unit || "TABLET",
      dosage:       prev.dosage || (med.strength || ""),
    }));
    setShowDropdown(false);
  };

  const handleCloseDropdown = () => setShowDropdown(false);

  // ── CRUD handlers ───────────────────────────────────────────────────────────

  const handleAddMedicine = () => {
    if (!newMedicine.name.trim()) {
      toast.error("Please enter medicine name");
      return;
    }
    if (!newMedicine.medicineId) {
      toast.error("Please select a medicine from the dropdown so it can be dispensed at the pharmacy");
      return;
    }

    const medicine: Medicine = {
      id:         Date.now().toString(),
      medicineId: newMedicine.medicineId,
      name:       newMedicine.name,
      dosage:     newMedicine.dosage,
      frequency:  newMedicine.frequency,
      duration:   newMedicine.duration,
      quantity:   newMedicine.quantity || 1,
      unit:       newMedicine.unit     || "TABLET",
    };

    setMedicines((prev) => [...prev, medicine]);
    setNewMedicine({ name: "", dosage: "", frequency: "", duration: "", quantity: 1, unit: "", medicineId: "", selectedName: "" });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRemoveMedicine = (id: string) =>
    setMedicines((prev) => prev.filter((m) => m.id !== id));

  const handleAddSymptom = () => {
    if (!newSymptom.trim()) { toast.error("Please enter a symptom"); return; }
    setSymptoms((prev) => [...prev, newSymptom]);
    setNewSymptom("");
  };

  const handleRemoveSymptom = (index: number) =>
    setSymptoms((prev) => prev.filter((_, i) => i !== index));

  const handleAddDiagnosis = () => {
    if (!newDiagnosis.trim()) { toast.error("Please enter a diagnosis"); return; }
    setDiagnoses((prev) => [...prev, newDiagnosis]);
    setNewDiagnosis("");
  };

  const handleRemoveDiagnosis = (index: number) =>
    setDiagnoses((prev) => prev.filter((_, i) => i !== index));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Save / complete ─────────────────────────────────────────────────────────

  const saveDraftToStorage = () => {
    localStorage.setItem(
      `consultation_draft_${visitId}`,
      JSON.stringify({ formData, symptoms, diagnoses, medicines }),
    );
  };

  const handleSave = () => {
    saveDraftToStorage();
    setSaveMessage("Draft saved successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const visit = currentVisit as any;

  const getPDFParams = () => ({
    patientName:           visit?.patientName,
    tokenNo:               visit?.tokenNo,
    age:                   visit?.age,
    gender:                visit?.gender,
    visitType:             visit?.visitType,
    symptoms,
    diagnoses,
    medicines,
    nextFollowUp:          formData.nextFollowUp,
    testRecommendations:   formData.testRecommendations,
    doctorName:            doctorUser?.doctor?.full_name,
    doctorSpecialization:  doctorUser?.doctor?.specialization,
    doctorQualifications:  doctorUser?.doctor?.qualifications,
    doctorPhone:           doctorUser?.doctor?.phone,
    doctorEmail:           doctorUser?.doctor?.email,
    clinicAddress:         doctorUser?.doctor?.clinic_address,
  });

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);

      const prescriptionText = medicines
        .map((m) => `${m.name} - ${m.dosage} - ${m.frequency} - ${m.duration}`)
        .join("\n");

      // medicines array mein medicineId bhi save hoti hai
      // backend consultation.medicines mein yeh object store hoga
      const consultationPayload = {
        visitId,
        symptoms:             symptoms.join(","),
        diagnosis:            diagnoses.join(","),
        prescription:         prescriptionText,
        medicines:            medicines.map((m) => ({
          medicineId: m.medicineId,   // ← pharmacy DB ID
          id:         m.medicineId,   // backward compat
          name:       m.name,
          dosage:     m.dosage,
          frequency:  m.frequency,
          duration:   m.duration,
          quantity:   m.quantity || 1,
          unit:       m.unit    || "TABLET",
        })),
        testRecommendations: formData.testRecommendations,
        nextFollowUp:        formData.nextFollowUp
          ? new Date(formData.nextFollowUp).toISOString()
          : undefined,
        notes: formData.notes,
      };

      await dispatch(createConsultation(consultationPayload)).unwrap();
      await generatePrescriptionPDF(getPDFParams());

      localStorage.removeItem(`consultation_draft_${visitId}`);
      router.push(`/dashboard/doctor/${doctorId}`);
    } catch (submitError) {
      console.error("Error completing consultation:", submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => generatePrescriptionPDF(getPDFParams());

  const handleBack = () => {
    saveDraftToStorage();
    router.push(`/dashboard/doctor/${doctorId}`);
  };

  // ── Return ──────────────────────────────────────────────────────────────────

  return {
    doctorUser,
    currentVisit,
    loading,
    error,
    latestConsultation,
    formData,
    symptoms,
    newSymptom,
    diagnoses,
    newDiagnosis,
    medicines,
    newMedicine,
    isSubmitting,
    saveMessage,
    // medicine search
    searchQuery,
    searchResults,
    showDropdown,
    searchLoading,
    setNewSymptom,
    setNewDiagnosis,
    setNewMedicine,
    handleInputChange,
    handleMedicineSearch,
    handleSelectPharmacyMedicine,
    handleCloseDropdown,
    handleAddMedicine,
    handleRemoveMedicine,
    handleAddSymptom,
    handleRemoveSymptom,
    handleAddDiagnosis,
    handleRemoveDiagnosis,
    handleSave,
    handleComplete,
    generatePDF,
    handleBack,
  };
};
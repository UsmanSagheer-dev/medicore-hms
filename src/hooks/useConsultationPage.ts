import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createConsultation,
  getVistByDoctor,
} from "@/redux/slices/patientVisitSlice";
import { generatePrescriptionPDF } from "@/lib/generatePrescriptionPDF";

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface FormData {
  notes: string;
  testRecommendations: string;
  nextFollowUp: string;
}

export const useConsultationPage = (doctorId: string, visitId: string) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { visits, loading, error } = useAppSelector(
    (state) => state.patientVisit,
  );
  const { user: doctorUser } = useAppSelector((state) => state.auth);

  const currentVisit = useMemo(() => {
    return visits.find((v) => v.id === visitId);
  }, [visits, visitId]);

  const [formData, setFormData] = useState<FormData>({
    notes: "",
    testRecommendations: "",
    nextFollowUp: "",
  });

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState("");

  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState("");

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
    if (!currentVisit && doctorId) {
      dispatch(getVistByDoctor(doctorId));
    }
  }, [dispatch, doctorId, currentVisit]);

  useEffect(() => {
    if (!visitId) return;

    const savedDraft = localStorage.getItem(`consultation_draft_${visitId}`);
    if (!savedDraft) return;

    try {
      const draft = JSON.parse(savedDraft);
      const draftData = draft.formData || draft;
      const mergedFormData = {
        notes: "",
        testRecommendations: "",
        nextFollowUp: "",
        ...draftData,
      };

      setFormData(mergedFormData);
      setSymptoms(draft.symptoms || []);
      setDiagnoses(draft.diagnoses || []);
      setMedicines(draft.medicines || []);
    } catch (loadError) {
      console.error("❌ Error loading draft:", loadError);
    }
  }, [visitId]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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

    setMedicines((prev) => [...prev, medicine]);
    setNewMedicine({ name: "", dosage: "", frequency: "", duration: "" });
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
  };

  const handleAddSymptom = () => {
    if (!newSymptom.trim()) {
      alert("Please enter a symptom");
      return;
    }

    setSymptoms((prev) => [...prev, newSymptom]);
    setNewSymptom("");
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDiagnosis = () => {
    if (!newDiagnosis.trim()) {
      alert("Please enter a diagnosis");
      return;
    }

    setDiagnoses((prev) => [...prev, newDiagnosis]);
    setNewDiagnosis("");
  };

  const handleRemoveDiagnosis = (index: number) => {
    setDiagnoses((prev) => prev.filter((_, i) => i !== index));
  };

  const saveDraftToStorage = () => {
    const draftData = { formData, symptoms, diagnoses, medicines };
    localStorage.setItem(
      `consultation_draft_${visitId}`,
      JSON.stringify(draftData),
    );
  };

  const handleSave = () => {
    saveDraftToStorage();
    setSaveMessage("Draft saved successfully!");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const visit = currentVisit as any;

  const getPDFParams = () => ({
    patientName: visit?.patientName,
    tokenNo: visit?.tokenNo,
    age: visit?.age,
    gender: visit?.gender,
    visitType: visit?.visitType,
    symptoms,
    diagnoses,
    medicines,
    nextFollowUp: formData.nextFollowUp,
    testRecommendations: formData.testRecommendations,
    doctorName: doctorUser?.doctor?.full_name,
    doctorSpecialization: doctorUser?.doctor?.specialization,
    doctorQualifications: doctorUser?.doctor?.qualifications,
    doctorPhone: doctorUser?.doctor?.phone,
    doctorEmail: doctorUser?.doctor?.email,
    clinicAddress: doctorUser?.doctor?.clinic_address,
  });

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);

      const prescriptionText = medicines
        .map((medicine) => {
          return `${medicine.name} - ${medicine.dosage} - ${medicine.frequency} - ${medicine.duration}`;
        })
        .join("\n");

      const consultationPayload = {
        visitId,
        symptoms: symptoms.join(","),
        diagnosis: diagnoses.join(","),
        prescription: prescriptionText,
        medicines,
        testRecommendations: formData.testRecommendations,
        nextFollowUp: formData.nextFollowUp
          ? new Date(formData.nextFollowUp).toISOString()
          : undefined,
        notes: formData.notes,
      };

      await dispatch(createConsultation(consultationPayload)).unwrap();
      await generatePrescriptionPDF(getPDFParams());

      localStorage.removeItem(`consultation_draft_${visitId}`);
      router.push(`/dashboard/doctor/${doctorId}`);
    } catch (submitError) {
      console.error("❌ Error completing consultation:", submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => {
    await generatePrescriptionPDF(getPDFParams());
  };

  const handleBack = () => {
    saveDraftToStorage();
    router.push(`/dashboard/doctor/${doctorId}`);
  };

  return {
    doctorUser,
    currentVisit,
    loading,
    error,
    formData,
    symptoms,
    newSymptom,
    diagnoses,
    newDiagnosis,
    medicines,
    newMedicine,
    isSubmitting,
    saveMessage,
    setNewSymptom,
    setNewDiagnosis,
    setNewMedicine,
    handleInputChange,
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

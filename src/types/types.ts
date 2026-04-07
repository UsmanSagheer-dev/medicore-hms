export interface DoctorToken {
  id: string;
  patientName: string;
  tokenNumber: string;
  time: string;
  status: string;
  visitType: "New" | "Follow up" | "Revisit";
}


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

export interface LatestConsultation {
  id?: string;
  patientId?: string;
  nextFollowUp?: string;
  visitType?: "New" | "Follow up" | "Revisit";
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  medicines?: any;
  testRecommendations?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientVisitState {
  
  visits: PatientVisit[];
  currentVisit: PatientVisit | null;
  todayVisits: PatientVisit[];
  latestConsultation: LatestConsultation | null;
  endDoctorDay: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
  mismatchWarning: boolean;
  warningMessage: string | null;
}
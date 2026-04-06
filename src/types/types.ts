export interface DoctorToken {
  id: string;
  patientName: string;
  tokenNumber: string;
  time: string;
  status: string;
  visitType: "New" | "Follow up" | "Revisit";
}
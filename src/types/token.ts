export interface TokenData {
  tokenNo: string;
  patientName: string;
  fatherName: string;
  age: string;
  gender: string;
  cnic: string;
  doctorName: string;
  specialization: string;
  roomNo: string;
  date: string;
  time: string;
  fee: string;
  isPaid: boolean;
  type?: string;
  visitType: "New" | "Follow up" | "Revisit";
}

import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  callPatient,
  getLatestConsultation,
} from "@/redux/slices/patientVisitSlice";

export interface DoctorToken {
  id: string;
  patientId?: string;
  patientName: string;
  tokenNumber: string;
  time: string;
  status: string;
  visitType: "NEW" | "FOLLOWUP" | "REVISIT";
}

export const useDoctorTokenCard = (token: DoctorToken) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const doctorId = params.id as string;
  const { loading } = useAppSelector((state) => state.patientVisit);

  const handleCallPatient = async () => {
    if (token.status === "WAITING") {
      try {
        await dispatch(callPatient(token.id)).unwrap();
      } catch (error) {
        console.error("Error calling patient:", error);
        return;
      }
    }

    if (token.visitType === "FOLLOWUP" && token.patientId) {
      try {
        await dispatch(getLatestConsultation(token.patientId)).unwrap();
      } catch (error) {
        console.warn("Could not fetch latest consultation:", error);
        // Don't return here - let them proceed even if fetching consultation fails
      }
    }

    router.push(`/dashboard/doctor/${doctorId}/consultation/${token.id}`);
  };

  const handleResumeConsultation = () => {
    router.push(`/dashboard/doctor/${doctorId}/consultation/${token.id}`);
  };

  const getVisitTypeStyles = (type: string) => {
    switch (type) {
      case "New":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Follow up":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Revisit":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return {
    loading,
    handleCallPatient,
    handleResumeConsultation,
    getVisitTypeStyles,
  };
};

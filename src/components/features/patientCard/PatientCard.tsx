import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  callPatient,
  deletePatientVisit,
} from "@/redux/slices/patientVisitSlice";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Patient = {
  id?: string;
  tokenNo?: string | number;
  status?: "WAITING" | "INPROGRESS" | "COMPLETED" | string;
  patientName?: string;
  fatherName?: string;
  age?: number | string;
  gender?: string;
  cnic?: string;
  phoneNumber?: string;
  address?: string;
  visitType?: string;
  date?: string;
  time?: string;
};

const PatientCard = ({ patient }: { patient: Patient }) => {
  const router = useRouter();
  const token = patient?.tokenNo ?? "token no";
  const patientId = patient?.id;
  const status = patient?.status;
  const params = useParams();
  const doctorId = params.id as string;
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.patientVisit);
  const nameInitial =
    patient?.patientName?.substring(0, 2)?.toUpperCase() || "P";
  const ageText = patient?.age;
  const dateTimeText =
    patient?.date || patient?.time
      ? `${patient?.date ?? ""}${patient?.date && patient?.time ? " " : ""}${patient?.time ?? ""}`
      : "date and time";

  const handleCallPatient = async () => {
    if (!patientId) return;

    if (status === "COMPLETED") return;

    if (status === "WAITING") {
      try {
        await dispatch(callPatient(patientId)).unwrap();
      } catch (error) {
        console.error("Error calling patient:", error);
        return;
      }
    }

    try {
      router.push(`/dashboard/doctor/${doctorId}/consultation/${patientId}`);
    } catch (error) {
      console.error("Error navigating to consultation:", error);
    }
  };

  const handleCancel = async () => {
    if (!patientId) return;

    try {
      await dispatch(deletePatientVisit(patientId)).unwrap();
      router.push(`/dashboard/doctor/${doctorId}/patients`);
    } catch (error) {
      console.error("Error deleting patient visit:", error);
    }
  };

  const isCompleted = status === "COMPLETED";

  const actionLabel =
    status === "INPROGRESS"
      ? "Resume"
      : status === "COMPLETED"
        ? "Completed"
        : loading
          ? "Calling..."
          : "Call Patient";

  return (
    <div className="flex w-full max-w-90 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
      <div className="bg-linear-to-r from-slate-950 via-slate-800 to-slate-950 px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-300">
              Token No
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {token}
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-lg font-semibold text-white shadow-inner">
            {nameInitial}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 px-5 py-5">
        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Patient
            </p>
            <p className="mt-1 text-2xl font-semibold leading-tight text-slate-900">
              {patient?.patientName ?? "Patient Name"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm sm:text-base">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Age
            </p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {ageText ?? "-"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Date & Time
            </p>
            <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">
              {dateTimeText}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
          {!isCompleted && (
            <button
              type="button"
              onClick={handleCancel}
              className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99]"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleCallPatient}
            disabled={!patientId || loading || isCompleted}
            className={`h-12 rounded-xl bg-slate-950 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] ${isCompleted ? "col-span-2" : ""}`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientCard;

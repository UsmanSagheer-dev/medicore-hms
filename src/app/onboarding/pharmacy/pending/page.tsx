"use client";

import {
  useEffect,
  useRef,
} from "react";
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Mail,
  Pill,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import { getPharmacyByUserId } from "@/redux/slices/pharmacySlice";

export default function PharmacyPendingApproval() {
  const dispatch = useAppDispatch() as AppDispatch;
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    const verifyApproval = async () => {
      if (!user?.id || hasCheckedRef.current) return;
      hasCheckedRef.current = true;

      try {
        const result = await dispatch(getPharmacyByUserId(user.id)).unwrap();
        if (result?.success) {
          router.replace("/dashboard/pharmacy");
        }
      } catch {
        // Keep user on pending page when profile is not approved/available yet.
      }
    };

    verifyApproval();
  }, [dispatch, router, user?.id]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth/login");
  };

  return (
    <div className="rounded-4xl bg-linear-to-br from-slate-900 via-teal-900 to-slate-900 flex items-center justify-center p-2">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-teal-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-8 border border-teal-400/30">
            <Clock className="w-10 h-10 text-teal-400" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Pharmacy <span className="text-teal-400">Under Review</span>
          </h1>

          <div className="space-y-6 max-w-lg mx-auto mb-10">
            <p className="text-white/80 text-lg leading-relaxed">
              Thank you for joining <span className="font-bold text-teal-400">MediCore</span>.
              Your pharmacy onboarding profile has been submitted successfully and is
              now under review by our admin team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 hover:bg-white/10 transition-colors">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Credentials Review
                  </h3>
                  <p className="text-white/60 text-xs">Validating license and profile</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-teal-400 mt-1 shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Application Received
                  </h3>
                  <p className="text-white/60 text-xs">Successfully submitted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-500/10 border border-teal-400/30 rounded-2xl p-6 mb-2 w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-teal-300 uppercase tracking-wider text-xs">
                What Happens Next?
              </span>
            </div>
            <p className="text-sm text-teal-200 leading-relaxed">
              Our admin team will verify your documents and professional details.
              This usually takes 12-24 business hours. Once approved, your pharmacy
              profile will be activated.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2 flex items-center justify-center gap-2">
              <Pill className="w-4 h-4 text-teal-300" />
              <p className="text-white/70 text-sm">
                Your account will stay locked until admin approval is completed.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-white/60 hover:text-teal-400 transition-colors font-semibold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

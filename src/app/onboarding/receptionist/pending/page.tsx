"use client";

import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";

export default function ReceptionistPendingApproval() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-400/30">
            <Clock className="w-10 h-10 text-blue-400" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Onboarding <span className="text-blue-400">Under Review</span>
          </h1>

          <div className="space-y-6 max-w-lg mx-auto mb-10">
            <p className="text-white/80 text-lg leading-relaxed">
              Thank you for joining{" "}
              <span className="font-bold text-blue-400">MediCore</span> as a
              receptionist. Your onboarding application has been submitted
              successfully and is currently under review by our admin team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 hover:bg-white/10 transition-colors">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Form Verification
                  </h3>
                  <p className="text-white/60 text-xs">Checking your details</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Data Received
                  </h3>
                  <p className="text-white/60 text-xs">
                    Successfully submitted
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-6 mb-8 w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-blue-300 uppercase tracking-wider text-xs">
                What Happens Next?
              </span>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Our admin team will review your application and verify all the
              information you provided. This typically takes 12-24 business
              hours. Once approved, you'll receive a notification and can log in
              to your receptionist dashboard.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white/70 text-sm">
                <span className="text-blue-400 font-semibold">Note:</span> You
                won't be able to log in until your onboarding is approved by the
                admin.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-white/60 hover:text-blue-400 transition-colors font-semibold group"
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

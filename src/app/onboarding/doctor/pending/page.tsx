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

export default function PendingApproval() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth/login");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/30">
            <Clock className="w-10 h-10 text-indigo-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Registration <span className="text-indigo-400">Pending Approval</span>
          </h1>

          <div className="space-y-6 max-w-lg mx-auto mb-10">
            <p className="text-white/60 text-lg leading-relaxed">
              Thank you for joining{" "}
              <span className="font-bold text-indigo-400">MediCore</span>. Your
              professional profile has been submitted successfully and is
              currently under review by our admin team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mt-1" />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Security Check
                  </h3>
                  <p className="text-white/50 text-xs">Verifying credentials</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 mt-1" />
                <div>
                  <h3 className="text-white font-bold text-sm">
                    Profile Submission
                  </h3>
                  <p className="text-white/50 text-xs">Successfully received</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8 w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-indigo-300 uppercase tracking-wider text-xs">
                What's Next?
              </span>
            </div>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              We will notify you once your account is approved. This typically
              takes 12-24 business hours. After approval, you will be able to
              access your full dashboard.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-white/60 hover:text-indigo-400 transition-colors font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

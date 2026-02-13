"use client";

import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Mail,
} from "lucide-react";
import Link from "next/link";

export default function PendingApproval() {
  return (
    <div className=" flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-gray-200 p-12 rounded-3xl shadow-xl text-center relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Registration <span className="text-blue-600">Pending Approval</span>
          </h1>

          <div className="space-y-6 max-w-lg mx-auto mb-10">
            <p className="text-gray-600 text-lg leading-relaxed">
              Thank you for joining{" "}
              <span className="font-bold text-blue-600">MediCore</span>. Your
              professional profile has been submitted successfully and is
              currently under review by our admin team.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 font-bold text-sm">
                    Security Check
                  </h3>
                  <p className="text-gray-500 text-xs">Verifying credentials</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-gray-900 font-bold text-sm">
                    Profile Submission
                  </h3>
                  <p className="text-gray-500 text-xs">Successfully received</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 w-full">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-700 uppercase tracking-wider text-xs">
                What's Next?
              </span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              We will notify you once your account is approved. This typically
              takes 12-24 business hours. After approval, you will be able to
              access your full dashboard.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

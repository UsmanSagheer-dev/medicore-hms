"use client";

import { useState } from "react";
import { Bell, Shield, Lock, Save } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function PharmacySettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [sessionProtection, setSessionProtection] = useState(true);

  const saveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm max-w-4xl">
          <h1 className="text-2xl font-black text-gray-900">Pharmacy Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure account alerts and security preferences.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Email Notifications</p>
                  <p className="text-xs text-gray-500">
                    Receive updates about profile changes and approvals.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Security Alerts</p>
                  <p className="text-xs text-gray-500">
                    Notify on login attempts and suspicious activity.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={securityAlerts}
                onChange={(e) => setSecurityAlerts(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Session Protection</p>
                  <p className="text-xs text-gray-500">
                    Auto-protect session on inactivity.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sessionProtection}
                onChange={(e) => setSessionProtection(e.target.checked)}
                className="w-5 h-5"
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 inline-flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

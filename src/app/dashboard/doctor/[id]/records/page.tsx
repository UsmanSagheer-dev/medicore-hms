"use client";
import Sidebar from "@/components/layout/Sidebar";
import { FileText } from "lucide-react";

const RecordsPage = () => {
  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-50 flex items-center justify-center">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical Records</h1>
          <p className="text-gray-500 text-lg mb-4">Coming Soon</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Under Development
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;

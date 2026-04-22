"use client";

import React from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import ScheduleManagement from "@/components/features/doctor/ScheduleManagement";

export default function SchedulePage() {
  const params = useParams();
  const doctorId = params.id as string;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <ScheduleManagement doctorId={doctorId} />
      </div>
    </div>
  );
}

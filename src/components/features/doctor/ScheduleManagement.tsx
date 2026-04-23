"use client";

import { Save } from "lucide-react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useSchedule } from "@/hooks/useSchedule";

export default function ScheduleManagement({ doctorId }: { doctorId: string }) {
  const {
    schedule,
    loading,
    activeDaysCount,
    toggleDay,
    changeTime,
    saveSchedule,
  } = useSchedule(doctorId);

  const handleSave = async () => {
    try {
      await saveSchedule();
      toast.success("Schedule updated");
    } catch (err: any) {
      toast.error(err.message || "Error");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-bold text-black font-poppins">Schedule</h1>

        <Button onClick={handleSave} isLoading={loading}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(schedule).map(([key, d]) => (
          <div key={key} className="border p-4 rounded-lg">
            <div className="flex justify-between">
              <label className="flex gap-2 text-black">
                <input
                  type="checkbox"
                  checked={d.isActive}
                  onChange={() => toggleDay(key)}
                />
                {d.dayName}
              </label>

              {d.isActive && <span className="text-green-600 text-xs">ACTIVE</span>}
            </div>

            {d.isActive && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Input
                  type="time"
                  value={d.startTime}
                  onChange={(e) =>
                    changeTime(key, "startTime", e.target.value)
                  }
                />
                <Input
                  type="time"
                  value={d.endTime}
                  onChange={(e) =>
                    changeTime(key, "endTime", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm">
        Active Days: <b>{activeDaysCount}</b>
      </p>
    </div>
  );
}
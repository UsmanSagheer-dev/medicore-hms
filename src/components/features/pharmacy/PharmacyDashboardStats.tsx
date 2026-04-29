"use client";

import { useEffect } from "react";
import { Package, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  getMedicinesByPharmacy,
  getStockAlerts,
  getMedicineSalesStats,
} from "@/redux/slices/medicineSlice";

export default function PharmacyDashboardStats() {
  const dispatch = useAppDispatch();
  const { medicines, total } = useAppSelector((state) => state.medicine);
  const { stockAlerts } = useAppSelector((state) => state.medicine);
  const { medicineStats } = useAppSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(getMedicinesByPharmacy());
    dispatch(getStockAlerts());
    dispatch(getMedicineSalesStats());
  }, [dispatch]);

  const totalRevenue = medicineStats.reduce((sum, stat) => sum + stat.totalRevenue, 0);
  const totalUnitsSold = medicineStats.reduce((sum, stat) => sum + stat.totalQuantitySold, 0);

  const stats = [
    {
      label: "Total Medicines",
      value: total,
      icon: Package,
      tone: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Low Stock Items",
      value: stockAlerts.length,
      icon: AlertCircle,
      tone: "text-red-700 bg-red-50 border-red-100",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${totalRevenue.toFixed(0)}`,
      icon: DollarSign,
      tone: "text-purple-700 bg-purple-50 border-purple-100",
    },
    {
      label: "Units Sold",
      value: totalUnitsSold,
      icon: TrendingUp,
      tone: "text-blue-700 bg-blue-50 border-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-2xl border p-5 ${stat.tone} shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">
              {stat.label}
            </p>
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-extrabold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

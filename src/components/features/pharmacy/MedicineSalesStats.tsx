"use client";

import { useEffect } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getMedicineSalesStats } from "@/redux/slices/medicineSlice";

export default function MedicineSalesStats() {
  const dispatch = useAppDispatch();
  const { medicineStats, loading } = useAppSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(getMedicineSalesStats());
  }, [dispatch]);

  const topMedicines = medicineStats.slice(0, 10);
  const maxRevenue =
    topMedicines.length > 0
      ? Math.max(...topMedicines.map((m) => m.totalRevenue))
      : 0;

  if (loading && medicineStats.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Top Selling Medicines
        </h2>
        <p className="text-gray-500 text-sm">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        Top Selling Medicines
      </h2>

      {medicineStats.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No sales data available yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topMedicines.map((stat, index) => (
            <div key={stat.medicine.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="font-semibold text-gray-900">
                      {stat.medicine.medicine_name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {stat.medicine.generic_name} • {stat.medicine.category}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600">Revenue</p>
                  <p className="text-lg font-bold text-purple-700">
                    Rs. {stat.totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Revenue Bar */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-linear-to-r from-purple-500 to-purple-700 h-2 rounded-full transition-all"
                    style={{
                      width: `${(stat.totalRevenue / maxRevenue) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600">Qty Sold</p>
                  <p className="font-bold text-gray-900">{stat.totalQuantitySold}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600">Avg Price</p>
                  <p className="font-bold text-gray-900">
                    Rs. {(stat.totalRevenue / stat.totalQuantitySold).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-600">Transactions</p>
                  <p className="font-bold text-gray-900">{stat.transactionCount}</p>
                </div>
              </div>
            </div>
          ))}

          {medicineStats.length > 10 && (
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                + {medicineStats.length - 10} more medicines
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getStockAlerts } from "@/redux/slices/medicineSlice";

export default function StockAlerts() {
  const dispatch = useAppDispatch();
  const { stockAlerts, loading } = useAppSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(getStockAlerts());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Stock Alerts
        </h2>
        <p className="text-gray-500 text-sm">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        Low Stock Alerts
        {stockAlerts.length > 0 && (
          <span className="ml-auto bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
            {stockAlerts.length}
          </span>
        )}
      </h2>

      {stockAlerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No stock alerts. All medicines are in good stock.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {stockAlerts.map((medicine) => (
            <div
              key={medicine.id}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {medicine.medicine_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {medicine.generic_name}
                  </p>
                </div>
                <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">
                  {medicine.category}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">Current</p>
                  <p className="font-bold text-gray-900">
                    {medicine.stock_quantity} {medicine.base_unit || "UNIT"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Reorder Level</p>
                  <p className="font-bold text-gray-900">
                    {medicine.reorder_level} {medicine.base_unit || "UNIT"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">Unit Price</p>
                  <p className="font-bold text-gray-900">
                    Rs. {medicine.selling_price?.toFixed(2) || "N/A"}
                  </p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      (medicine.stock_quantity / medicine.reorder_level) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {medicine.reorder_level - medicine.stock_quantity} {medicine.base_unit || "UNIT"} below reorder level
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

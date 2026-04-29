"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSalesReport } from "@/redux/slices/medicineSlice";
import Button from "@/components/ui/Button";

export default function SalesReport() {
  const dispatch = useAppDispatch();
  const { salesReport, loading } = useAppSelector((state) => state.medicine);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    dispatch(getSalesReport({}));
  }, [dispatch]);

  const handleFetchReport = () => {
    dispatch(getSalesReport({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }));
  };

  if (loading && !salesReport) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Sales Report
        </h2>
        <p className="text-gray-500 text-sm">Loading report...</p>
      </div>
    );
  }

  const summary = salesReport?.summary;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-teal-600" />
        Sales Report
      </h2>

      {/* Date Filter */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <Button
            onClick={handleFetchReport}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {loading ? "Loading..." : "Generate"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-linear-to-br from-emerald-50 to-teal-50 border border-teal-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Total Transactions
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              {summary.totalTransactions}
            </p>
          </div>

          <div className="bg-linear-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Total Quantity Sold
            </p>
            <p className="text-2xl font-bold text-blue-700">
              {summary.totalQuantity}
            </p>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Total Sales
            </p>
            <p className="text-2xl font-bold text-purple-700">
              Rs. {summary.totalSales.toFixed(2)}
            </p>
          </div>

          <div className="bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-600 mb-1">
              Avg Transaction
            </p>
            <p className="text-2xl font-bold text-amber-700">
              Rs. {summary.avgTransactionValue.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      {salesReport?.transactions && salesReport.transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-3 py-3 font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left px-3 py-3 font-semibold text-gray-700">
                  Medicine
                </th>
                <th className="text-left px-3 py-3 font-semibold text-gray-700">
                  Patient
                </th>
                <th className="text-right px-3 py-3 font-semibold text-gray-700">
                  Qty
                </th>
                <th className="text-right px-3 py-3 font-semibold text-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {salesReport.transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-3 text-gray-700">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-900">
                      {transaction.medicine?.medicine_name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {transaction.medicine?.generic_name}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {transaction.patientName || "N/A"}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-900 font-medium">
                    {transaction.quantity}
                  </td>
                  <td className="px-3 py-3 text-right text-gray-900 font-bold">
                    Rs. {transaction.total_amount?.toFixed(2) || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No transactions found</p>
        </div>
      )}
    </div>
  );
}

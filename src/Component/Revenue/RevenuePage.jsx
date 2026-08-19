import { useState } from "react";
import { Download } from "lucide-react";

import { useSuperAdminRevenue } from "../../hooks/useSuperAdminApi";
import { exportSuperAdminRevenue } from "../../services/superAdminService";

const statusStyles = {
  paid: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  failed: "bg-rose-50 text-rose-600 border border-rose-200",
  cancelled: "bg-gray-50 text-gray-600 border border-gray-200",
};

const ROWS_PER_PAGE = 10;


/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-3">

        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-black mt-2">{value}</h3>
          {sub && <p className="text-xs text-gray-500 mt-2">{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#a3feff]/40 text-[#016472] text-xl">
          {icon}
        </div>

      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Company Payment Modal
|--------------------------------------------------------------------------
*/

function CompanyModal({ company, onClose }) {
  if (!company) return null;

  const paymentStatus =
    company.payment_status?.toLowerCase() || "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6">

        {/* Header */}

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Payment Details
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-gray-100 transition"
          >
            ✕
          </button>

        </div>


        {/* Details */}

        <div className="space-y-4">

          {/* Company */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">
              Company
            </span>

            <span className="text-sm font-medium text-black text-right">
              {company.company || "—"}
            </span>
          </div>


          {/* Email */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">
              Email
            </span>

            <span className="text-sm font-medium text-black text-right break-all">
              {company.email || "—"}
            </span>
          </div>


          {/* Owner ID */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">
              Owner ID
            </span>

            <span className="text-sm font-medium text-black">
              {company.owner_id ?? "—"}
            </span>
          </div>


          {/* Revenue */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">
              Revenue
            </span>

            <span className="text-sm font-semibold text-black">
              ${Number(company.revenue || 0).toLocaleString()}
            </span>
          </div>


          {/* Address */}

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">
              Location
            </span>

            <span className="text-sm font-medium text-black text-right">
              {company.address || "—"}
            </span>
          </div>


          {/* Payment Status */}

          <div className="flex items-center justify-between gap-4">

            <span className="text-sm text-black">
              Payment Status
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                statusStyles[paymentStatus] ||
                "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              {company.payment_status || "Pending"}
            </span>

          </div>
        </div>


        {/* Close */}

        <button
          onClick={onClose}
          className="mt-7 w-full py-2.5 rounded-xl bg-[#016472] hover:bg-[#014f59] text-white font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| Revenue Page
|--------------------------------------------------------------------------
*/

export default function RevenuePage() {

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [exporting, setExporting] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Revenue API
  |--------------------------------------------------------------------------
  */

  const {
    summary,
    payments,
    loading,
    error,
    refetch,
  } = useSuperAdminRevenue(statusFilter);


  /*
  |--------------------------------------------------------------------------
  | Data
  |--------------------------------------------------------------------------
  */

  const filteredPayments =
    Array.isArray(payments)
      ? payments
      : [];


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPayments.length /
        ROWS_PER_PAGE
    )
  );


  const startIndex =
    (currentPage - 1) *
    ROWS_PER_PAGE;


  const currentPayments =
    filteredPayments.slice(
      startIndex,
      startIndex + ROWS_PER_PAGE
    );


  /*
  |--------------------------------------------------------------------------
  | Export
  |--------------------------------------------------------------------------
  */

  const handleExport = async () => {

    try {

      setExporting(true);

      const csvData =
        await exportSuperAdminRevenue(
          statusFilter
        );


      const blob = new Blob(
        [csvData],
        {
          type: "text/csv;charset=utf-8;",
        }
      );


      const url =
        window.URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      const date =
        new Date()
          .toISOString()
          .split("T")[0];


      link.href = url;

      link.download =
        `worknest-revenue-${date}.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error(
        "Export failed:",
        err
      );

      alert(
        "Failed to export revenue data"
      );

    } finally {

      setExporting(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        Loading revenue data...
      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="mb-4">

        <h1 className="text-3xl font-semibold text-slate-900">
          Revenue Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Track company payments and platform revenue metrics.
        </p>

      </div>


      {/* Error */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex justify-between items-center">

          <span>
            {error}
          </span>

          <button
            onClick={refetch}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
          >
            Retry
          </button>

        </div>
      )}


      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          label="Total Revenue"
          value={`$${Number(
            summary?.total_revenue || 0
          ).toLocaleString()}`}
          sub="Paid companies"
          icon="💰"
        />


        <StatCard
          label="Pending Revenue"
          value={`$${Number(
            summary?.pending_revenue || 0
          ).toLocaleString()}`}
          sub="Waiting for payment"
          icon="⏳"
        />


        <StatCard
          label="Paid Companies"
          value={
            summary?.paid_companies || 0
          }
          sub="Successful payments"
          icon="✓"
        />


        <StatCard
          label="Failed Revenue"
          value={`$${Number(
            summary?.failed_revenue || 0
          ).toLocaleString()}`}
          sub="Failed payments"
          icon="✕"
        />

      </div>


      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">

        <div>

          <label className="text-sm font-medium text-slate-700 block mb-2">
            Payment Status
          </label>

          <select
            value={statusFilter}
            onChange={(e) => {

              setStatusFilter(
                e.target.value
              );

              setCurrentPage(1);

            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >

            <option value="all">
              All Payments
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="failed">
              Failed
            </option>

            <option value="cancelled">
              Cancelled
            </option>

          </select>
        </div>


        {/* Export */}

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#016472] text-white rounded-lg hover:bg-[#014f59] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >

          <Download size={16} />

          {exporting
            ? "Exporting..."
            : "Export Report"}

        </button>

      </div>


      {/* Payments Table */}

      <div className="overflow-x-auto rounded-lg border border-gray-200">

        <table className="w-full text-sm">

          <thead>

            <tr className="bg-gray-50 border-b border-gray-200">

              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Company
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Owner
              </th>

              <th className="px-6 py-3 text-right font-semibold text-gray-900">
                Revenue
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Status
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Location
              </th>

              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Action
              </th>

            </tr>

          </thead>


          <tbody>

            {currentPayments.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No payment records found
                </td>

              </tr>

            ) : (

              currentPayments.map(
                (payment) => {

                  const paymentStatus =
                    payment.payment_status?.toLowerCase() ||
                    "pending";


                  return (

                    <tr
                      key={payment.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >

                      {/* Company */}

                      <td className="px-6 py-3 font-medium text-gray-900">
                        {payment.company ||
                          "—"}
                      </td>


                      {/* Owner */}

                      <td className="px-6 py-3 text-gray-700">
                        {payment.owner_id ??
                          "—"}
                      </td>


                      {/* Revenue */}

                      <td className="px-6 py-3 text-right font-semibold text-gray-900">
                        $
                        {Number(
                          payment.revenue || 0
                        ).toLocaleString()}
                      </td>


                      {/* Status */}

                      <td className="px-6 py-3">

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            statusStyles[
                              paymentStatus
                            ] ||
                            "bg-gray-50 text-gray-600 border border-gray-200"
                          }`}
                        >
                          {payment.payment_status ||
                            "Pending"}
                        </span>

                      </td>


                      {/* Location */}

                      <td className="px-6 py-3 text-gray-700">
                        {payment.address ||
                          "—"}
                      </td>


                      {/* Action */}

                      <td className="px-6 py-3">

                        <button
                          onClick={() =>
                            setSelectedCompany(
                              payment
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  );

                }
              )

            )}

          </tbody>

        </table>

      </div>


      {/* Pagination */}

      {totalPages > 1 && (

        <div className="flex items-center justify-between gap-4">

          <p className="text-sm text-gray-600">
            Page{" "}
            {currentPage}{" "}
            of{" "}
            {totalPages}
          </p>


          <div className="flex gap-2">

            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>


            <button
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>

          </div>
        </div>

      )}


      {/* Modal */}

      <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
    </div>
  );
}
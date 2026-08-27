import { useState } from "react";
import { Download } from "lucide-react";

import { useSuperAdminRevenue } from "../../hooks/useSuperAdminApi";

const statusStyles = {
  paid: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  failed: "bg-rose-50 text-rose-600 border border-rose-200",
  cancelled: "bg-gray-50 text-gray-600 border border-gray-200",
};

const accountStatusStyles = {
  Active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Suspended: "bg-red-50 text-red-600 border border-red-200",
  Terminated: "bg-gray-100 text-gray-600 border border-gray-300",
};

const ROWS_PER_PAGE = 10;

// ==========================================
// HELPERS FOR DATA MAPPING
// ==========================================
function pickField(obj, keys, fallback = "—") {
  if (!obj) return fallback;
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return fallback;
}

function getOwnerName(payment) {
  return pickField(
    payment,
    [
      "owner",
      "owner_name",
      "account_owner",
      "accountOwner",
      "user_name",
      "contact_person",
      "AccountOwnerName",
    ],
    "—"
  );
}

function getLocation(payment) {
  return pickField(
    payment,
    ["location", "address", "company_address", "city", "country"],
    "—"
  );
}

function getCompanyName(payment) {
  return pickField(payment, ["company", "company_name", "name"], "—");
}

function getPaymentStatus(payment) {
  return pickField(
    payment,
    ["payment_status", "paymentStatus", "status"],
    "Pending"
  );
}

function getAccountStatus(payment) {
  const value = pickField(
    payment,
    ["accountStatus", "account_status", "company_status"],
    "Active"
  );

  const s = String(value).toLowerCase().trim();
  if (s === "suspended") return "Suspended";
  if (s === "inactive" || s === "terminated") return "Terminated";
  if (s === "active") return "Active";
  if (value === "Suspended" || value === "Terminated" || value === "Active") {
    return value;
  }
  return "Active";
}

function getEmail(payment) {
  return pickField(
    payment,
    ["email", "company_email", "login_email", "owner_email"],
    "—"
  );
}

// ==========================================
// STYLISH PDF REPORT GENERATOR
// ==========================================
function printStylishReport({ summary, payments, statusFilter }) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = new Date().toLocaleTimeString("en-US");

  // Status Badge Colors for Print
  const getBadgeStyle = (status) => {
    const s = String(status).toLowerCase();
    if (s === "paid" || s === "active")
      return "background-color: #d1fae5; color: #059669;";
    if (s === "pending")
      return "background-color: #fef3c7; color: #d97706;";
    if (s === "failed" || s === "suspended")
      return "background-color: #ffe4e6; color: #e11d48;";
    if (s === "terminated" || s === "inactive")
      return "background-color: #f3f4f6; color: #4b5563;";
    return "background-color: #f3f4f6; color: #4b5563;";
  };

  const tableRows =
    payments.length > 0
      ? payments
          .map((p) => {
            const paymentStatus = getPaymentStatus(p);
            const accountStatus = getAccountStatus(p);

            return `
        <tr>
          <td style="padding: 14px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">${getCompanyName(
            p
          )}</td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${getOwnerName(
            p
          )}</td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #e5e7eb; font-weight: 700; color: #016472; text-align: right;">$${Number(
            p.revenue || 0
          ).toLocaleString()}</td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; ${getBadgeStyle(
              paymentStatus
            )}">${paymentStatus}</span>
          </td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; ${getBadgeStyle(
              accountStatus
            )}">${accountStatus}</span>
          </td>
          <td style="padding: 14px 12px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">${getLocation(
            p
          )}</td>
        </tr>
      `;
          })
          .join("")
      : `<tr><td colspan="6" style="padding: 30px; text-align: center; color: #6b7280;">No payment records found</td></tr>`;

  const html = `
    <html>
      <head>
        <title>WorkNest Revenue Report</title>
        <meta charset="UTF-8">
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            color: #1f2937;
            margin: 0;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #016472;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand h1 {
            margin: 0;
            color: #016472;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .brand p {
            margin: 6px 0 0 0;
            color: #6b7280;
            font-size: 14px;
          }
          .meta {
            text-align: right;
            font-size: 13px;
            color: #4b5563;
            line-height: 1.8;
          }
          .meta strong {
            color: #111827;
          }
          .summary-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 35px;
          }
          .summary-card {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            padding: 20px;
            border-radius: 14px;
            border: 1px solid #e5e7eb;
            border-left: 4px solid #016472;
          }
          .summary-card p {
            margin: 0 0 8px 0;
            color: #6b7280;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .summary-card h2 {
            margin: 0;
            font-size: 24px;
            color: #016472;
            font-weight: 800;
          }
          .table-title {
            margin: 20px 0 12px 0;
            color: #111827;
            font-size: 18px;
            font-weight: 700;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            text-align: left;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
          }
          th {
            background: linear-gradient(135deg, #016472 0%, #014f59 100%);
            padding: 14px 12px;
            color: white;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 12px;
          }
          @media print {
            body {
              padding: 20px;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .summary-container {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <h1>WorkNest</h1>
            <p>Platform Revenue &amp; Companies Report</p>
          </div>
          <div class="meta">
            <strong>Date:</strong> ${date}<br/>
            <strong>Time:</strong> ${time}<br/>
            <strong>Filter:</strong> ${
              statusFilter === "all" ? "All Payments" : statusFilter.toUpperCase()
            }
          </div>
        </div>

        <div class="summary-container">
          <div class="summary-card">
            <p>Total Revenue</p>
            <h2>$${Number(summary?.total_revenue || 0).toLocaleString()}</h2>
          </div>
          <div class="summary-card">
            <p>Pending Revenue</p>
            <h2>$${Number(summary?.pending_revenue || 0).toLocaleString()}</h2>
          </div>
          <div class="summary-card">
            <p>Paid Companies</p>
            <h2>${Number(summary?.paid_companies || 0)}</h2>
          </div>
          <div class="summary-card">
            <p>Failed Revenue</p>
            <h2>$${Number(summary?.failed_revenue || 0).toLocaleString()}</h2>
          </div>
        </div>

        <h3 class="table-title">📋 Detailed Payment Records</h3>
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Owner</th>
              <th style="text-align: right;">Revenue</th>
              <th>Payment</th>
              <th>Account Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          © ${new Date().getFullYear()} WorkNest — Project Management System. All rights reserved.
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to export the report.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for resources to load then trigger print dialog
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 500);
}

/*
|--------------------------------------------------------------------------
| Stat Card Component
|--------------------------------------------------------------------------
*/
function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-black mt-2">
            {value}
          </h3>
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
| Company Payment Modal Component
|--------------------------------------------------------------------------
*/
function CompanyModal({ company, onClose }) {
  if (!company) return null;

  const paymentStatus = String(getPaymentStatus(company)).toLowerCase();
  const accountStatus = getAccountStatus(company);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6">
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

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Company</span>
            <span className="text-sm font-medium text-black text-right">
              {getCompanyName(company)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Email</span>
            <span className="text-sm font-medium text-black text-right break-all">
              {getEmail(company)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Owner</span>
            <span className="text-sm font-medium text-black text-right">
              {getOwnerName(company)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Revenue</span>
            <span className="text-sm font-semibold text-black">
              ${Number(company.revenue || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Location</span>
            <span className="text-sm font-medium text-black text-right">
              {getLocation(company)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Payment Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                statusStyles[paymentStatus] ||
                "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              {getPaymentStatus(company)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Account Status</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                accountStatusStyles[accountStatus] ||
                "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
            >
              {accountStatus}
            </span>
          </div>
        </div>

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
| Revenue Page Main Component
|--------------------------------------------------------------------------
*/
export default function RevenuePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [exporting, setExporting] = useState(false);

  const {
    summary,
    payments,
    loading,
    error,
    refetch,
  } = useSuperAdminRevenue(statusFilter);

  const filteredPayments = Array.isArray(payments) ? payments : [];

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / ROWS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;

  const currentPayments = filteredPayments.slice(
    startIndex,
    startIndex + ROWS_PER_PAGE
  );

  // ✅ STYLISH PDF EXPORT
  const handleExport = () => {
    try {
      setExporting(true);

      printStylishReport({
        summary,
        payments: filteredPayments,
        statusFilter,
      });
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export revenue data");
    } finally {
      setTimeout(() => setExporting(false), 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        Loading revenue data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-slate-900">
          Revenue Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Track company payments and platform revenue metrics.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={refetch}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${Number(summary?.total_revenue || 0).toLocaleString()}`}
          sub="Paid companies"
          icon="💰"
        />
        <StatCard
          label="Pending Revenue"
          value={`$${Number(summary?.pending_revenue || 0).toLocaleString()}`}
          sub="Waiting for payment"
          icon="⏳"
        />
        <StatCard
          label="Paid Companies"
          value={summary?.paid_companies || 0}
          sub="Successful payments"
          icon="✓"
        />
        <StatCard
          label="Failed Revenue"
          value={`$${Number(summary?.failed_revenue || 0).toLocaleString()}`}
          sub="Failed payments"
          icon="✕"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">
            Payment Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#016472] text-white rounded-lg hover:bg-[#014f59] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Download size={16} />
          {exporting ? "Exporting..." : "Export Report"}
        </button>
      </div>

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
                Payment
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Account Status
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
                  colSpan="7"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No payment records found
                </td>
              </tr>
            ) : (
              currentPayments.map((payment) => {
                const paymentStatus = String(
                  getPaymentStatus(payment)
                ).toLowerCase();
                const accountStatus = getAccountStatus(payment);
                const isSuspended = accountStatus === "Suspended";
                const isTerminated = accountStatus === "Terminated";

                return (
                  <tr
                    key={
                      payment.id ||
                      `${getCompanyName(payment)}-${payment.revenue}`
                    }
                    className={`border-b border-gray-200 transition ${
                      isSuspended
                        ? "bg-red-50/70"
                        : isTerminated
                        ? "bg-gray-100 opacity-70"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td
                      className={`px-6 py-3 font-medium ${
                        isSuspended || isTerminated
                          ? "line-through text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {getCompanyName(payment)}
                    </td>

                    <td className="px-6 py-3 text-gray-700">
                      {getOwnerName(payment)}
                    </td>

                    <td className="px-6 py-3 text-right font-semibold text-gray-900">
                      ${Number(payment.revenue || 0).toLocaleString()}
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          statusStyles[paymentStatus] ||
                          "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {getPaymentStatus(payment)}
                      </span>
                    </td>

                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          accountStatusStyles[accountStatus] ||
                          "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {accountStatus}
                      </span>
                    </td>

                    <td className="px-6 py-3 text-gray-700">
                      {getLocation(payment)}
                    </td>

                    <td className="px-6 py-3">
                      <button
                        onClick={() => setSelectedCompany(payment)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            <button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CompanyModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
      />
    </div>
  );
}
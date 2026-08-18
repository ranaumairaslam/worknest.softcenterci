import { useEffect, useState } from "react";
import { getRevenue } from "../../services/superAdminService.js";
const ROWS_PER_PAGE = 5;

const statusStyles = {
  Paid: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-600 border border-amber-200",
  Failed: "bg-rose-50 text-rose-600 border border-rose-200",
};

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

function CompanyModal({ company, onClose }) {
  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-black">Payment Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-gray-100 transition">✕</button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Company</span>
            <span className="text-sm font-medium text-black">{company.company || company.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Owner</span>
            <span className="text-sm font-medium text-black">{company.owner}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Email</span>
            <span className="text-sm font-medium text-black">{company.email || "—"}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Revenue</span>
            <span className="text-sm font-semibold text-black">${company.revenue}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Location</span>
            <span className="text-sm font-medium text-black">{company.location}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-black">Payment Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[company.paymentStatus] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
              {company.paymentStatus || "Pending"}
            </span>
          </div>
        </div>

        <button onClick={onClose} className="mt-7 w-full py-2.5 rounded-xl bg-[#016472] hover:bg-[#014f59] text-white font-medium transition">
          Close
        </button>
      </div>
    </div>
  );
}

export default function RevenuePage() {
  const [summary, setSummary] = useState({
    total_revenue: 0,
    pending_revenue: 0,
    paid_companies: 0,
    failed_revenue: 0,
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ LOAD FROM API
  useEffect(() => {
    const loadRevenue = async () => {
      try {
        setLoading(true);
        const data = await getRevenue();

        if (data) {
          setSummary(data.summary || {});
          setPayments(data.payments || []);
        }
      } catch (error) {
        console.error("Error loading revenue:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRevenue();
  }, []);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(payments.length / ROWS_PER_PAGE));
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentPayments = payments.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Export
  const handleExport = () => {
    const headers = ["Company", "Owner", "Revenue", "Payment Status", "Location"];
    const rows = payments.map((p) => [
      p.company, p.owner, `$${p.revenue}`, p.paymentStatus, p.location,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "revenue-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
        <p className="text-center py-20 text-gray-500">Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="w-full p-4 sm:p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Revenue Overview</h1>
            <p className="text-sm text-black mt-1">Track your platform revenue and payments</p>
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm text-black outline-none focus:border-[#016472] cursor-pointer"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
            <option value="This Year">This Year</option>
          </select>
        </div>

        {/* STAT CARDS - FROM API */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Revenue"
            value={`$${Number(summary.total_revenue || 0).toLocaleString("en-US")}`}
            sub="Paid companies"
            icon="💰"
          />
          <StatCard
            label="Pending Revenue"
            value={`$${Number(summary.pending_revenue || 0).toLocaleString("en-US")}`}
            sub="Waiting for payment"
            icon="⏳"
          />
          <StatCard
            label="Paid Companies"
            value={summary.paid_companies || 0}
            sub="Successful payments"
            icon="✓"
          />
          <StatCard
            label="Failed Revenue"
            value={`$${Number(summary.failed_revenue || 0).toLocaleString("en-US")}`}
            sub="Failed payments"
            icon="!"
          />
        </div>

        {/* TABLE - FROM API */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-black">Recent Payments</h2>
              <p className="text-xs text-black mt-1">Latest company payment activity</p>
            </div>
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-[#016472] text-white text-sm font-medium hover:bg-[#014f59] transition"
            >
              Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="p-4 font-semibold text-black">Company</th>
                  <th className="p-4 font-semibold text-black">Owner</th>
                  <th className="p-4 font-semibold text-black">Revenue</th>
                  <th className="p-4 font-semibold text-black">Payment Status</th>
                  <th className="p-4 font-semibold text-black">Location</th>
                  <th className="p-4 font-semibold text-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment) => (
                    <tr key={payment.id} className="border-t border-gray-100 hover:bg-[#a3feff]/10 transition">
                      <td className="p-4 font-medium text-black">{payment.company}</td>
                      <td className="p-4 text-black">{payment.owner}</td>
                      <td className="p-4 font-semibold text-black">${payment.revenue}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusStyles[payment.paymentStatus] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>
                          {payment.paymentStatus || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-black">{payment.location}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setSelectedCompany(payment)}
                          className="px-3 py-1.5 rounded-lg bg-[#a3feff]/40 border border-[#016472]/20 text-[#016472] hover:bg-[#016472] hover:text-white transition text-xs font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500 text-sm">
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="border-t border-gray-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-black">
              Showing <span className="font-semibold">{payments.length === 0 ? 0 : startIndex + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(endIndex, payments.length)}</span> of{" "}
              <span className="font-semibold">{payments.length}</span> records
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-black hover:bg-[#a3feff]/30 hover:border-[#016472]"
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-[#016472] text-white"
                          : "text-black hover:bg-[#a3feff]/40"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    currentPage === totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-black hover:bg-[#a3feff]/30 hover:border-[#016472]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
    </div>
  );
}
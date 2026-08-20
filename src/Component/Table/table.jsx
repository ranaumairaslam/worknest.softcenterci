import { useEffect, useState } from "react";
import "./Table.css";
import {
  getSuperAdminCompanies,
  setSuperAdminCompanyStatus,
} from "../../services/superAdminService.js";

const ROWS_PER_PAGE = 5;

/** Facebook-style Shimmer Block */
function Shimmer({ className = "" }) {
  return <div className={`wn-shimmer ${className}`} />;
}

/** Table Loading Skeleton */
function TableSkeleton() {
  return (
    <div className="bg-[#fbfbfb] mt-[20px] text-black py-[5px] px-3 rounded-md text-[12px]">
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-5">
        <Shimmer className="h-5 w-48 rounded-md" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-24 rounded" /></th>
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-32 rounded" /></th>
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-24 rounded" /></th>
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-16 rounded" /></th>
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-12 rounded" /></th>
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-12 rounded" /></th>
              <th className="px-5 py-3.5 text-left"><Shimmer className="h-3.5 w-12 rounded" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS_PER_PAGE }).map((_, row) => (
              <tr key={row} className="border-b border-gray-50 last:border-0">
                <td className="px-5 py-4"><Shimmer className="h-4 w-28 rounded-md" /></td>
                <td className="px-5 py-4"><Shimmer className="h-4 w-36 rounded-md" /></td>
                <td className="px-5 py-4"><Shimmer className="h-4 w-24 rounded-md" /></td>
                <td className="px-5 py-4"><Shimmer className="h-4 w-16 rounded-md" /></td>
                <td className="px-5 py-4"><Shimmer className="h-5 w-5 rounded-md" /></td>
                <td className="px-5 py-4"><Shimmer className="h-5 w-5 rounded-md" /></td>
                <td className="px-5 py-4"><Shimmer className="h-5 w-5 rounded-md" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Tables() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const companies = await getSuperAdminCompanies();
        setData(companies);
      } catch (error) {
        console.error("Error loading companies:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCompanies();
  }, []);

  const updateAccountStatus = async (id, status) => {
    const company = data.find((c) => c.id === id);
    if (!company) return;

    const previousStatus = company.accountStatus;

    // Map frontend display -> backend status
    const statusMap = {
      Active: "active",
      Suspended: "suspended",
      Terminated: "inactive",
    };

    const backendStatus = statusMap[status] || status.toLowerCase();

    // 1. Instantly update UI
    setData((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, accountStatus: status, status: status } : c
      )
    );

    // 2. Call backend API with company payload
    try {
      await setSuperAdminCompanyStatus(id, backendStatus, company);
    } catch (error) {
      console.error("Status update failed:", error);
      alert(`❌ Status update failed: ${error.message || "Failed to update status"}`);

      // Revert back on failure
      setData((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, accountStatus: previousStatus, status: previousStatus } : c
        )
      );
    }
  };

  // Pagination
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentCompanies = data.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
    if (totalPages === 0 && currentPage !== 1) setCurrentPage(1);
  }, [data.length, currentPage, totalPages]);

  // ✅ Facebook-style Shimmer Skeleton while loading
  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="bg-[#fbfbfb] mt-[20px] text-black py-[5px] px-3 rounded-md text-[12px]">
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-5">
        <h2 className="text-sm font-semibold text-black">Tenant Company Registry</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Company</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Contact Email</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Industry</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Revenue</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Active</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Suspend</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Terminate</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.length > 0 ? (
              currentCompanies.map((item) => {
                const currentStatus = String(item.accountStatus || item.status || "").toLowerCase();

                const isActive = currentStatus === "active";
                const isSuspended = currentStatus === "suspended";
                const isTerminated = currentStatus === "terminated" || currentStatus === "inactive";

                return (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-50 last:border-0 transition-all duration-300 ${
                      isSuspended ? "bg-red-50" : isTerminated ? "bg-gray-100 opacity-60" : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${isSuspended || isTerminated ? "line-through decoration-red-500 decoration-2" : "text-gray-800"}`}>{item.name}</td>
                    <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${isSuspended || isTerminated ? "line-through decoration-red-500 decoration-2" : "text-gray-800"}`}>{item.email}</td>
                    <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${isSuspended || isTerminated ? "line-through decoration-red-500 decoration-2" : "text-gray-800"}`}>{item.industry}</td>
                    <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${isSuspended || isTerminated ? "line-through decoration-red-500 decoration-2" : "text-gray-800"}`}>{item.revenue}</td>
                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input type="checkbox" checked={isActive} onChange={() => updateAccountStatus(item.id, "Active")} className="w-[18px] h-[18px] accent-[#016472] cursor-pointer" />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input type="checkbox" checked={isSuspended} onChange={() => updateAccountStatus(item.id, isSuspended ? "Active" : "Suspended")} className="w-[18px] h-[18px] accent-red-500 cursor-pointer" />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input type="checkbox" checked={isTerminated} onChange={() => updateAccountStatus(item.id, isTerminated ? "Active" : "Terminated")} className="w-[18px] h-[18px] accent-red-700 cursor-pointer" />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500 text-sm">No companies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-gray-700">{Math.min(endIndex, data.length)}</span> of{" "}
            <span className="font-semibold text-gray-700">{data.length}</span> companies
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                  currentPage === 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-black hover:bg-[#a3feff]/30 hover:border-[#016472]"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    currentPage === page ? "bg-[#016472] text-white" : "text-black hover:bg-[#a3feff]/40"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                  currentPage === totalPages ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-black hover:bg-[#a3feff]/30 hover:border-[#016472]"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
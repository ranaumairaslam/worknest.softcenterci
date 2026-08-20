import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Pencil, Eye, X, MapPin, Mail, User, Building2, FileImage } from "lucide-react";
import { deleteSuperAdminCompany } from "../../services/superAdminService.js";

const ROWS_PER_PAGE = 5;

function normalizeStatus(rawStatus) {
  if (!rawStatus) return "Active";
  const s = String(rawStatus).toLowerCase().trim();
  if (s === "suspended") return "Suspended";
  if (s === "inactive" || s === "terminated") return "Terminated";
  if (s === "pending") return "Pending";
  if (s === "failed") return "Failed";
  if (s === "active") return "Active";
  // already normalized
  if (rawStatus === "Suspended" || rawStatus === "Terminated" || rawStatus === "Active") {
    return rawStatus;
  }
  return rawStatus;
}

function normalizePaymentStatus(rawStatus) {
  if (!rawStatus) return "Pending";
  const s = String(rawStatus).toLowerCase().trim();
  if (s === "paid" || s === "completed" || s === "success") return "Paid";
  if (s === "failed" || s === "rejected") return "Failed";
  return "Pending";
}

function highlightMatch(text, query) {
  if (!text || !query.trim()) return text;
  const searchQuery = query.trim();
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = String(text).split(regex);
  return parts.map((part, index) =>
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      <mark key={index} className="bg-[#a3feff] text-[#016472] rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function CompanyTable({ companies = [], onChanged }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(false);

  const deleteCompany = async (id) => {
    setDeleting(true);
    try {
      await deleteSuperAdminCompany(id);
      setDeleteId(null);
      if (selectedCompany?.id === id) setSelectedCompany(null);
      await onChanged?.();
    } catch (error) {
      window.alert(error.message || "Unable to delete company.");
    } finally {
      setDeleting(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const searchText = search.toLowerCase().trim();
    const companyStatus = normalizeStatus(company.status || company.accountStatus);

    const matchesSearch =
      company.name?.toLowerCase().includes(searchText) ||
      company.owner?.toLowerCase().includes(searchText) ||
      company.email?.toLowerCase().includes(searchText) ||
      company.industry?.toLowerCase().includes(searchText) ||
      company.location?.toLowerCase().includes(searchText);

    const matchesStatus = statusFilter === "All" || companyStatus === statusFilter;
    const matchesIndustry = industryFilter === "All" || company.industry === industryFilter;
    const matchesOwner = ownerFilter === "All" || company.owner === ownerFilter;

    return matchesSearch && matchesStatus && matchesIndustry && matchesOwner;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, industryFilter, ownerFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / ROWS_PER_PAGE) || 0;
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);
  const owners = [...new Set(companies.map((c) => c.owner).filter(Boolean))];

  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Suspended: "bg-red-50 text-red-600 border border-red-200",
    Terminated: "bg-gray-100 text-gray-600 border border-gray-300",
    Inactive: "bg-gray-100 text-gray-600 border border-gray-300",
    Pending: "bg-amber-50 text-amber-600 border border-amber-200",
    Failed: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] w-full sm:w-auto cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Terminated">Terminated</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm">Industry:</label>
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] w-full sm:w-auto cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Software">Software</option>
              <option value="Software Development">Software Development</option>
              <option value="Web Development">Web Development</option>
              <option value="IT Consulting">IT Consulting</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm">Account Owner:</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] w-full sm:w-auto cursor-pointer"
            >
              <option value="All">Any</option>
              {owners.map((owner) => (
                <option key={owner} value={owner}>
                  {owner}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full lg:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company..."
            className="bg-white text-gray-700 text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none border border-gray-200 focus:border-[#016472] w-full lg:w-[240px]"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider">Company Name</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider">Industry</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider">Account Owner</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider">Login Email</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider">Payment Status</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.length > 0 ? (
              currentCompanies.map((company) => {
                const displayStatus = normalizeStatus(company.status || company.accountStatus);
                const paymentStatus = normalizePaymentStatus(company.paymentStatus);
                const isBad = displayStatus === "Suspended" || displayStatus === "Terminated";

                return (
                  <tr
                    key={company.id}
                    className={`border-b border-gray-50 transition ${
                      displayStatus === "Suspended"
                        ? "bg-red-50/60"
                        : displayStatus === "Terminated"
                        ? "bg-gray-50 opacity-80"
                        : "hover:bg-gray-50/70"
                    }`}
                  >
                    <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${isBad ? "line-through text-red-600" : "text-gray-800"}`}>
                      {highlightMatch(company.name, search)}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[displayStatus] || "bg-gray-50 text-gray-600 border"}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{highlightMatch(company.industry, search)}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{highlightMatch(company.owner, search)}</td>
                    <td className="px-5 py-3.5 text-sm whitespace-nowrap">
                      {company.email ? (
                        <a href={`mailto:${company.email}`} className="text-[#016472] hover:underline">
                          {highlightMatch(company.email, search)}
                        </a>
                      ) : (
                        <span className="text-gray-400">No Email</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : paymentStatus === "Failed"
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" onClick={() => setSelectedCompany(company)} title="View">
                          <Eye size={18} className="text-[#016472]" />
                        </button>
                        <button type="button" onClick={() => navigate("/add-company", { state: { company } })} title="Edit">
                          <Pencil size={18} className="text-gray-600" />
                        </button>
                        <button type="button" onClick={() => setDeleteId(company.id)} title="Delete">
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500 text-sm">
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-500">
          {filteredCompanies.length > 0 ? (
            <>
              Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span> to{" "}
              <span className="font-semibold text-gray-700">{Math.min(endIndex, filteredCompanies.length)}</span> of{" "}
              <span className="font-semibold text-gray-700">{filteredCompanies.length}</span> companies
            </>
          ) : (
            "Showing 0 companies"
          )}
        </div>
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedCompany(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Company Details</h2>
                <p className="text-sm text-gray-500 mt-1">Complete company information</p>
              </div>
              <button type="button" onClick={() => setSelectedCompany(null)} className="w-9 h-9 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 sm:px-7 pt-6">
              <div className="bg-[#a3feff]/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#016472] text-white flex items-center justify-center">
                  <Building2 size={23} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{selectedCompany.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                  <User size={15} /> Account Owner
                </div>
                <p className="text-sm font-medium">{selectedCompany.owner || "N/A"}</p>
              </div>
              <div className="border rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                  <Mail size={15} /> Login Email
                </div>
                <p className="text-sm font-medium break-all">{selectedCompany.email || "N/A"}</p>
              </div>
              <div className="border rounded-xl p-4">
                <div className="text-gray-500 text-xs font-semibold uppercase mb-2">Company Status</div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[normalizeStatus(selectedCompany.status || selectedCompany.accountStatus)]}`}>
                  {normalizeStatus(selectedCompany.status || selectedCompany.accountStatus)}
                </span>
              </div>
              <div className="border rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2">
                  <MapPin size={15} /> Location
                </div>
                <p className="text-sm font-medium">{selectedCompany.location || "N/A"}</p>
              </div>
              <div className="border rounded-xl p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-3">
                  <FileImage size={15} /> Payment Receipt
                </div>
                {selectedCompany.receipt ? (
                  <img src={selectedCompany.receipt} alt="Receipt" className="w-full max-h-[350px] object-contain rounded-xl border" />
                ) : (
                  <div className="flex items-center justify-center h-32 rounded-xl bg-gray-50 border border-dashed">
                    <p className="text-sm text-gray-400">No receipt uploaded</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 sm:px-7 py-4 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedCompany(null)} className="px-5 py-2.5 border rounded-lg text-sm">
                Close
              </button>
              <button
                type="button"
                onClick={() => navigate("/add-company", { state: { company: selectedCompany } })}
                className="px-5 py-2.5 bg-[#016472] text-white rounded-lg text-sm"
              >
                Edit Company
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Delete Company</h2>
            <p className="text-sm text-gray-500 mt-2">Are you sure? This cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteId(null)} disabled={deleting} className="px-4 py-2 text-sm bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button type="button" onClick={() => deleteCompany(deleteId)} disabled={deleting} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
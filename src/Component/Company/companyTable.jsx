import { useState, useEffect } from "react";
import { Search, Trash2, Pencil, Eye, X, MapPin, Mail, User, Building2, CreditCard, FileImage } from "lucide-react";
import Companiesdata from "./companyTable.js";

const STORAGE_KEY = "worknest_companies";
const ROWS_PER_PAGE = 5;

function highlightMatch(text, query) {
  if (!text || !query.trim()) return text;
  const searchQuery = query.trim();
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = String(text).split(regex);
  return parts.map((part, index) => part.toLowerCase() === searchQuery.toLowerCase() ? <mark key={index} className="bg-[#a3feff] text-[#016472] rounded px-0.5">{part}</mark> : part);
}

function getCompaniesFromStorage() {
  try {
    const savedCompanies = localStorage.getItem(STORAGE_KEY);
    if (!savedCompanies) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Companiesdata));
      return Companiesdata;
    }
    const parsedCompanies = JSON.parse(savedCompanies);
    if (!Array.isArray(parsedCompanies)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Companiesdata));
      return Companiesdata;
    }
    const mergedCompanies = parsedCompanies.map((savedCompany) => {
      const latestCompany = Companiesdata.find((company) => company.id === savedCompany.id);
      if (latestCompany) {
        return {
          ...latestCompany,
          ...savedCompany,
          password: savedCompany.password ?? latestCompany.password ?? "",
          paymentStatus: savedCompany.paymentStatus ?? latestCompany.paymentStatus ?? "Pending",
          receipt: savedCompany.receipt ?? latestCompany.receipt ?? null,
        };
      }
      return savedCompany;
    });
    Companiesdata.forEach((latestCompany) => {
      const exists = mergedCompanies.some((company) => company.id === latestCompany.id);
      if (!exists) mergedCompanies.push(latestCompany);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedCompanies));
    return mergedCompanies;
  } catch (error) {
    console.error("Error loading companies:", error);
    return Companiesdata;
  }
}

export default function CompanyTable() {
  const [companies, setCompanies] = useState(() => getCompaniesFromStorage());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [industryFilter, setIndustryFilter] = useState("All");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadCompanies = () => {
    setCompanies(getCompaniesFromStorage());
  };

  useEffect(() => {
    const handleCompaniesUpdated = (event) => {
      if (event.detail && Array.isArray(event.detail)) setCompanies(event.detail);
      else loadCompanies();
    };
    const handleStorage = () => loadCompanies();
    window.addEventListener("companiesUpdated", handleCompaniesUpdated);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("companiesUpdated", handleCompaniesUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const deleteCompany = (id) => {
    setCompanies((prevCompanies) => {
      const updatedCompanies = prevCompanies.filter((company) => company.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCompanies));
      window.dispatchEvent(new CustomEvent("companiesUpdated", { detail: updatedCompanies }));
      return updatedCompanies;
    });
    setDeleteId(null);
    if (selectedCompany?.id === id) setSelectedCompany(null);
  };

  const filteredCompanies = companies.filter((company) => {
    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      company.name?.toLowerCase().includes(searchText) ||
      company.owner?.toLowerCase().includes(searchText) ||
      company.email?.toLowerCase().includes(searchText) ||
      company.industry?.toLowerCase().includes(searchText) ||
      company.location?.toLowerCase().includes(searchText);
    const matchesStatus = statusFilter === "All" || company.status === statusFilter;
    const matchesIndustry = industryFilter === "All" || company.industry === industryFilter;
    const matchesOwner = ownerFilter === "All" || company.owner === ownerFilter;
    return matchesSearch && matchesStatus && matchesIndustry && matchesOwner;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, industryFilter, ownerFilter]);

  const totalPages = Math.ceil(filteredCompanies.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  const owners = [...new Set(companies.map((company) => company.owner).filter(Boolean))];

  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Inactive: "bg-red-50 text-red-600 border border-red-200",
    Pending: "bg-amber-50 text-amber-600 border border-amber-200",
    Failed: "bg-red-50 text-red-600 border border-red-200",
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm">Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] w-full sm:w-auto">
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm">Industry:</label>
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] w-full sm:w-auto">
              <option value="All">All</option>
              <option value="Software Development">Software Development</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="IT Consulting">IT Consulting</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="SaaS">SaaS</option>
              <option value="Finance">Finance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm">Account Owner:</label>
            <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] w-full sm:w-auto">
              <option value="All">Any</option>
              {owners.map((owner) => <option key={owner} value={owner}>{owner}</option>)}
            </select>
          </div>
        </div>

        <div className="relative w-full lg:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company..." className="bg-white text-gray-700 text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none border border-gray-200 focus:border-[#016472] w-full lg:w-[240px]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Company Name</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Industry</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Account Owner</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Login Email</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Payment Status</th>
              <th className="px-5 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.length > 0 ? currentCompanies.map((company) => (
              <tr key={company.id} className="border-b border-gray-50 hover:bg-gray-50/70 transition">
                <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{highlightMatch(company.name, search)}</td>
                <td className="px-5 py-3.5 whitespace-nowrap"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[company.status] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>{company.status}</span></td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{highlightMatch(company.industry, search)}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{highlightMatch(company.owner, search)}</td>
                <td className="px-5 py-3.5 text-sm whitespace-nowrap">{company.email ? <a href={`mailto:${company.email}`} className="text-[#016472] hover:underline">{highlightMatch(company.email, search)}</a> : <span className="text-gray-400">No Email</span>}</td>
                <td className="px-5 py-3.5 whitespace-nowrap"><span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${company.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : company.paymentStatus === "Failed" ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>{company.paymentStatus || "Pending"}</span></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-3">
                    <button type="button" onClick={() => setSelectedCompany(company)} className="inline-flex items-center justify-center hover:scale-110 transition" title="View Details"><Eye size={18} className="text-[#016472]" /></button>
                    <button type="button" onClick={() => window.location.href = `/add-company?edit=${company.id}`} className="inline-flex items-center justify-center hover:scale-110 transition" title="Edit Company"><Pencil size={18} className="text-gray-600" /></button>
                    <button type="button" onClick={() => setDeleteId(company.id)} className="inline-flex items-center justify-center hover:scale-110 transition" title="Delete Company"><Trash2 size={18} className="text-red-500" /></button>
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan="7" className="text-center py-10 text-gray-500 text-sm">No companies found.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-500">{filteredCompanies.length > 0 ? <>Showing <span className="font-semibold text-gray-700">{startIndex + 1}</span>{" "}to{" "}<span className="font-semibold text-gray-700">{Math.min(endIndex, filteredCompanies.length)}</span>{" "}of{" "}<span className="font-semibold text-gray-700">{filteredCompanies.length}</span>{" "}companies</> : "Showing 0 companies"}</div>
        {totalPages > 1 && <div className="flex items-center gap-1">
          <button type="button" onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1} className={`px-3 py-2 rounded-lg border text-sm font-medium ${currentPage === 1 ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-black hover:bg-[#a3feff]/30 hover:border-[#016472]"}`}>Previous</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === page ? "bg-[#016472] text-white" : "text-black hover:bg-[#a3feff]/40"}`}>{page}</button>)}
          <button type="button" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages} className={`px-3 py-2 rounded-lg border text-sm font-medium ${currentPage === totalPages ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-300 text-black hover:bg-[#a3feff]/30 hover:border-[#016472]"}`}>Next</button>
        </div>}
      </div>

      {selectedCompany && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4" onClick={() => setSelectedCompany(null)}>
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Company Details</h2>
                <p className="text-sm text-gray-500 mt-1">Complete company information</p>
              </div>
              <button type="button" onClick={() => setSelectedCompany(null)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"><X size={20} /></button>
            </div>

            <div className="px-5 sm:px-7 pt-6">
              <div className="bg-[#a3feff]/30 rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#016472] text-white flex items-center justify-center"><Building2 size={23} /></div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{selectedCompany.name}</h3>
                  <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4"><div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2"><User size={15} />Account Owner</div><p className="text-sm font-medium text-gray-800">{selectedCompany.owner || "N/A"}</p></div>
              <div className="border border-gray-200 rounded-xl p-4"><div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2"><Mail size={15} />Login Email</div><p className="text-sm font-medium text-gray-800 break-all">{selectedCompany.email || "N/A"}</p></div>
              <div className="border border-gray-200 rounded-xl p-4"><div className="text-gray-500 text-xs font-semibold uppercase mb-2">Login Password</div><p className="text-sm font-mono font-medium text-gray-800">{selectedCompany.password || "No Password"}</p></div>
              <div className="border border-gray-200 rounded-xl p-4"><div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2"><Building2 size={15} />Company Size</div><p className="text-sm font-medium text-gray-800">{selectedCompany.size || "N/A"}</p></div>
              <div className="border border-gray-200 rounded-xl p-4 sm:col-span-2"><div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-2"><MapPin size={15} />Location</div><p className="text-sm font-medium text-gray-800">{selectedCompany.location || "N/A"}</p></div>
              <div className="border border-gray-200 rounded-xl p-4"><div className="text-gray-500 text-xs font-semibold uppercase mb-2">Company Status</div><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[selectedCompany.status] || "bg-gray-50 text-gray-600 border border-gray-200"}`}>{selectedCompany.status || "N/A"}</span></div>
              <div className="border border-gray-200 rounded-xl p-4"><div className="text-gray-500 text-xs font-semibold uppercase mb-2">Industry</div><p className="text-sm font-medium text-gray-800">{selectedCompany.industry || "N/A"}</p></div>
              <div className="border border-gray-200 rounded-xl p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase mb-3"><FileImage size={15} />Payment Receipt</div>
                {selectedCompany.receipt ? <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50"><img src={selectedCompany.receipt} alt="Payment Receipt" className="w-full max-h-[350px] object-contain" /></div> : <div className="flex items-center justify-center h-32 rounded-xl bg-gray-50 border border-dashed border-gray-300"><p className="text-sm text-gray-400">No receipt uploaded</p></div>}
              </div>
            </div>

            <div className="px-5 sm:px-7 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedCompany(null)} className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">Close</button>
              <button type="button" onClick={() => window.location.href = `/add-company?edit=${selectedCompany.id}`} className="px-5 py-2.5 bg-[#016472] text-white rounded-lg text-sm font-medium hover:bg-[#01535e]">Edit Company</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white w-full max-w-sm rounded-xl shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-800">Delete Company</h2>
            <p className="text-sm text-gray-500 mt-2 leading-6">Are you sure you want to delete this company? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
              <button type="button" onClick={() => deleteCompany(deleteId)} className="px-4 py-2 text-sm font-medium bg-[#016472] text-white rounded-lg hover:bg-[#014f59]">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
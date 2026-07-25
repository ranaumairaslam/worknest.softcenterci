import { Search, Trash2,Eye,MessageCircle } from "lucide-react";
import Companiesdata from "./companyTable.js";

export default function CompanyTable() {
  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Inactive: "bg-red-50 text-red-600 border border-red-200",
    Pending: "bg-amber-50 text-amber-600 border border-amber-200",
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm shrink-0">
              Status:
            </label>
            <select className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] transition-colors duration-200 w-full sm:w-auto">
              <option>All</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm shrink-0">Industry:</label>
            <select className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] transition-colors duration-200 w-full sm:w-auto">
              <option>Technology</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <label className="text-gray-700 font-semibold text-sm shrink-0">
              Account Owner:
            </label>
            <select className="bg-white text-gray-700 text-sm p-2 rounded-lg border border-gray-200 outline-none focus:border-[#016472] transition-colors duration-200 w-full sm:w-auto">
              <option>Any</option>
              <option>Only One</option>
            </select>
          </div>
        </div>
        <div className="relative w-full lg:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input type="search" placeholder="Search" className="bg-white text-gray-700 text-sm pl-9 pr-3 py-2.5 rounded-lg outline-none border border-gray-200 focus:border-[#016472] transition-colors duration-200 w-full lg:w-[220px]"/>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Company Name
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Industry
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Account Owner
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Company Size
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Revenue
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Location
              </th>
              <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Companiesdata.map((compani) => (
              <tr
                key={compani.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors duration-150"
              >
                <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                  {compani.name}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap ">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusStyles[compani.status] ||"bg-[red] text-[white] border border-gray-200"}`}>
                    {compani.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {compani.industry}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {compani.owner}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {compani.size}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {compani.revenue}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                  {compani.location}
                </td>
                <td className="text-center ">
                    
                    
                    <button><Eye size={18} className="text-[#000000] opacity-100 "/></button>
                    <button><MessageCircle size={18} className="text-[#000000] ml-2 mr-2"/></button>
                    <button ><Trash2 size={18} className="text-[red]"/></button> 
                    </td>
                    
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
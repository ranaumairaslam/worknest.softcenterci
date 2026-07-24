import { Search, Trash2,Eye,MessageCircle } from "lucide-react";
import Companiesdata from "../Company/companyTable";

export default function Pending(){
  const statusStyles = {
    Active: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    Inactive: "bg-red-50 text-red-600 border border-red-200",
    Pending: "bg-amber-50 text-amber-600 border border-amber-200",
  };

  return (
    <>

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
                Pakage
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
                    {compani.Buy}
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
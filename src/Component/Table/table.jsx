import { useEffect, useState } from "react";
import "./Table.css";
import Companiesdata from "../Company/companyTable.js";

const STORAGE_KEY = "worknest_companies";

export default function Tables() {
  const [data, setData] = useState([]);

  const loadCompanies = () => {
    try {
      const savedCompanies = localStorage.getItem(STORAGE_KEY);

      if (savedCompanies === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Companiesdata));
        setData(Companiesdata);
        return;
      }

      const parsedCompanies = JSON.parse(savedCompanies);

      if (Array.isArray(parsedCompanies)) {
        setData(parsedCompanies);
        return;
      }

      setData(Companiesdata);
    } catch (error) {
      console.error("Error loading companies:", error);
      setData(Companiesdata);
    }
  };

  useEffect(() => {
    loadCompanies();

    const handleCompaniesUpdated = (event) => {
      if (event.detail) {
        setData(event.detail);
      } else {
        loadCompanies();
      }
    };

    window.addEventListener("companiesUpdated", handleCompaniesUpdated);
    window.addEventListener("storage", loadCompanies);

    return () => {
      window.removeEventListener("companiesUpdated", handleCompaniesUpdated);
      window.removeEventListener("storage", loadCompanies);
    };
  }, []);

  return (
    <>
      <div className="bg-[#fbfbfb] mt-[20px] text-[#000000] py-[5px] px-3 rounded-md text-[12px]">
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-5">
          <h2>Tenant Company Registry</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Company
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Contact Email
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Register
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Plan
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Active
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Suspend
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[black] uppercase tracking-wider whitespace-nowrap">
                  Terminate
                </th>
              </tr>
            </thead>
        <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors duration-150"
                    key={item.id}
                  >
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.industry}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">
                      {item.revenue}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input className="w-[18px] h-[18px]" type="checkbox" />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input className="w-[18px] h-[18px]" type="checkbox" />
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input className="w-[18px] h-[18px]" type="checkbox" />
                    </td>
                  </tr>
                ))
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
      </div>
    </>
  );
}
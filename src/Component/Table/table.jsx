
import { useEffect, useState } from "react";
import "./Table.css";
import Companiesdata from "../Company/companyTable.js";

const STORAGE_KEY = "worknest_companies";

export default function Tables({ companies: propCompanies }) {
  const [localData, setLocalData] = useState([]);
  const data = propCompanies || localData;

  const loadCompanies = () => {
    if (propCompanies) return;
    try {
      const savedCompanies = localStorage.getItem(STORAGE_KEY);

      if (savedCompanies === null) {
        const initialData = Companiesdata.map((company) => ({
          ...company,
          accountStatus: "Active",
        }));

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(initialData)
        );

        setLocalData(initialData);
        return;
      }

      const parsedCompanies = JSON.parse(savedCompanies);

      if (Array.isArray(parsedCompanies)) {
        const updatedData = parsedCompanies.map((company) => ({
          ...company,
          accountStatus: company.accountStatus || "Active",
        }));

        setLocalData(updatedData);
        return;
      }

      setLocalData(
        Companiesdata.map((company) => ({
          ...company,
          accountStatus: "Active",
        }))
      );
    } catch (error) {
      console.error("Error loading companies:", error);

      setLocalData(
        Companiesdata.map((company) => ({
          ...company,
          accountStatus: "Active",
        }))
      );
    }
  };

  useEffect(() => {
    if (propCompanies) return;
    loadCompanies();

    const handleCompaniesUpdated = (event) => {
      if (event.detail) {
        setLocalData(event.detail);
      } else {
        loadCompanies();
      }
    };

    window.addEventListener(
      "companiesUpdated",
      handleCompaniesUpdated
    );

    window.addEventListener("storage", loadCompanies);

    return () => {
      window.removeEventListener(
        "companiesUpdated",
        handleCompaniesUpdated
      );

      window.removeEventListener("storage", loadCompanies);
    };
  }, [propCompanies]);

  const updateAccountStatus = (id, status) => {
    if (propCompanies) {
      alert("Status updates for persistent tenant databases are managed through administrative configurations.");
      return;
    }
    setLocalData((previousData) => {
      const updatedData = previousData.map((company) =>
        company.id === id
          ? {
              ...company,
              accountStatus: status,
            }
          : company
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedData)
      );

      window.dispatchEvent(
        new CustomEvent("companiesUpdated", {
          detail: updatedData,
        })
      );

      return updatedData;
    });
  };

  return (
    <div className="bg-[#fbfbfb] mt-[20px] text-black py-[5px] px-3 rounded-md text-[12px]">
      <div className="flex flex-col items-center sm:flex-row sm:items-center gap-3 mb-5">
        <h2 className="text-sm font-semibold text-black">
          Tenant Company Registry
        </h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-5 overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Company
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Contact Email
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Register
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Plan
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Active
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Suspend
              </th>

              <th className="px-5 py-3.5 text-xs font-semibold text-black uppercase tracking-wider whitespace-nowrap">
                Terminate
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => {
                const isActive = item.accountStatus === "Active";
                const isSuspended =
                  item.accountStatus === "Suspended";
                const isTerminated =
                  item.accountStatus === "Terminated";

                return (
                  <tr
                    key={item.id}
                    className={`
                      border-b border-gray-50
                      last:border-0
                      transition-all duration-300
                      ${
                        isSuspended
                          ? "bg-red-50"
                          : isTerminated
                          ? "bg-gray-100 opacity-60"
                          : "hover:bg-gray-50/70"
                      }
                    `}
                  >
                    <td
                      className={`
                        px-5 py-3.5 text-sm font-medium whitespace-nowrap
                        ${
                          isSuspended || isTerminated
                            ? "line-through decoration-red-500 decoration-2"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {item.name}
                    </td>

                    <td
                      className={`
                        px-5 py-3.5 text-sm font-medium whitespace-nowrap
                        ${
                          isSuspended || isTerminated
                            ? "line-through decoration-red-500 decoration-2"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {item.email}
                    </td>

                    <td
                      className={`
                        px-5 py-3.5 text-sm font-medium whitespace-nowrap
                        ${
                          isSuspended || isTerminated
                            ? "line-through decoration-red-500 decoration-2"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {item.industry}
                    </td>

                    <td
                      className={`
                        px-5 py-3.5 text-sm font-medium whitespace-nowrap
                        ${
                          isSuspended || isTerminated
                            ? "line-through decoration-red-500 decoration-2"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {item.revenue}
                    </td>

                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={() =>
                          updateAccountStatus(
                            item.id,
                            "Active"
                          )
                        }
                        className="w-[18px] h-[18px] accent-[#016472] cursor-pointer"
                      />
                    </td>

                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSuspended}
                        onChange={() =>
                          updateAccountStatus(
                            item.id,
                            isSuspended
                              ? "Active"
                              : "Suspended"
                          )
                        }
                        className="w-[18px] h-[18px] accent-red-500 cursor-pointer"
                      />
                    </td>

                    <td className="px-5 py-3.5 text-sm font-medium whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isTerminated}
                        onChange={() =>
                          updateAccountStatus(
                            item.id,
                            isTerminated
                              ? "Active"
                              : "Terminated"
                          )
                        }
                        className="w-[18px] h-[18px] accent-red-700 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500 text-sm"
                >
                  No companies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

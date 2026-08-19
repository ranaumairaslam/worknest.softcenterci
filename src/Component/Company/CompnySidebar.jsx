import CompanyCards from "./compnyCard.jsx";
import CompanyTable from "./companyTable.jsx";
import { useLocation } from "react-router-dom";
import { useSuperAdminCompanies } from "../../hooks/useSuperAdminApi";
import { toCompanyViewModel } from "../../services/superAdminService";

export default function CompanySidebar() {
  const location = useLocation();
  const {
    companies,
    loading,
    error,
    refetch,
    updateStatus,
  } = useSuperAdminCompanies();

  // Trigger refetch when route state changes
  React.useEffect(() => {
    if (location.state?.refreshCompanies) {
      refetch();
    }
  }, [location.state?.refreshCompanies, refetch]);

  if (loading) {
    return (
      <div className="mx-6 mt-6 text-center text-slate-500">
        Loading companies...
      </div>
    );
  }

  const mappedCompanies = companies.map(toCompanyViewModel);

  return (
    <>
      {error && (
        <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={refetch}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
          >
            Retry
          </button>
        </div>
      )}
      <CompanyCards companies={mappedCompanies} />
      <CompanyTable
        companies={mappedCompanies}
        onChanged={refetch}
        onStatusChange={updateStatus}
      />
    </>
  );
}

import React from 'react';

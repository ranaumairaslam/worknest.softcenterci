import CompanyCards from "./compnyCard.jsx";
import CompanyTable from "./companyTable.jsx";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSuperAdminCompanies, toCompanyViewModel } from "../../services/superAdminService.js";
export default function CompanySidebar(){
    const location = useLocation();
    const [companies, setCompanies] = useState([]);
    const [error, setError] = useState("");
    const loadCompanies = useCallback(async () => {
      try {
        setError("");
        setCompanies((await getSuperAdminCompanies()).map(toCompanyViewModel));
      } catch (err) {
        setError(err.message || "Unable to load companies.");
      }
    }, []);

    useEffect(() => { loadCompanies(); }, [loadCompanies, location.state?.refreshCompanies]);

    return(<>
      {error && <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      <CompanyCards companies={companies} />
      <CompanyTable companies={companies} onChanged={loadCompanies} />
    </>)
}

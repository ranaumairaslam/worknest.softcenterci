import { useCallback, useEffect, useState } from "react";
import {
  getSuperAdminDashboard,
  getSuperAdminCompanies,
  getCompanyById,
  getSuperAdminRevenue,
  createCompany,
  updateSuperAdminCompany,
  setSuperAdminCompanyStatus,
} from "../services/superAdminService";

/**
 * Hook for managing super admin dashboard
 */
export function useSuperAdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await getSuperAdminDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.message || "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

/**
 * Hook for managing all companies
 */
export function useSuperAdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const companiesData = await getSuperAdminCompanies();
      setCompanies(companiesData || []);
    } catch (err) {
      console.error("Error loading companies:", err);
      setError(err.message || "Failed to load companies");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addCompany = useCallback(
    async (companyData) => {
      try {
        const newCompany = await createCompany(companyData);
        setCompanies((prev) => [newCompany, ...prev]);
        return newCompany;
      } catch (err) {
        console.error("Error adding company:", err);
        throw err;
      }
    },
    []
  );

  const updateCompany = useCallback(
    async (companyId, companyData) => {
      try {
        const updated = await updateSuperAdminCompany(companyId, companyData);
        setCompanies((prev) =>
          prev.map((c) => (c.id === companyId ? updated : c))
        );
        return updated;
      } catch (err) {
        console.error("Error updating company:", err);
        throw err;
      }
    },
    []
  );

  const updateStatus = useCallback(
    async (companyId, status) => {
      try {
        const updated = await setSuperAdminCompanyStatus(companyId, status);
        setCompanies((prev) =>
          prev.map((c) => (c.id === companyId ? updated : c))
        );
        return updated;
      } catch (err) {
        console.error("Error updating status:", err);
        throw err;
      }
    },
    []
  );

  return {
    companies,
    loading,
    error,
    refetch: load,
    addCompany,
    updateCompany,
    updateStatus,
  };
}

/**
 * Hook for managing a single company
 */
export function useSuperAdminCompany(companyId) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!companyId) {
      setCompany(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const companyData = await getCompanyById(companyId);
      setCompany(companyData);
    } catch (err) {
      console.error("Error loading company:", err);
      setError(err.message || "Failed to load company");
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    load();
  }, [load]);

  return { company, loading, error, refetch: load };
}

/**
 * Hook for managing revenue data
 */
export function useSuperAdminRevenue(status = "all") {
  const [summary, setSummary] = useState({
    total_revenue: 0,
    pending_revenue: 0,
    paid_companies: 0,
    failed_revenue: 0,
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const revenueData = await getSuperAdminRevenue(status);
      setSummary(revenueData.summary || {});
      setPayments(revenueData.payments || []);
    } catch (err) {
      console.error("Error loading revenue:", err);
      setError(err.message || "Failed to load revenue");
      setSummary({});
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    summary,
    payments,
    loading,
    error,
    refetch: load,
  };
}

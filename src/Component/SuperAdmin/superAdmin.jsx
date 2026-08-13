import { useEffect, useState } from "react";
import Cards from "../Cards/cards";
import Tables from "../Table/table";
import { useSuperAdminDashboard, useSuperAdminCompanies } from "../../hooks/useSuperAdminApi";

export default function Admin() {
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useSuperAdminDashboard();
  const { companies, loading: companiesLoading, error: companiesError } = useSuperAdminCompanies();

  const [stats, setStats] = useState({});

  useEffect(() => {
    if (dashboardData) {
      setStats({
        total_companies: dashboardData.total_companies || 0,
        active_companies: dashboardData.active_companies || 0,
        new_this_month: dashboardData.new_this_month || 0,
        total_employees: dashboardData.total_employees || 0,
        pending_approval: dashboardData.pending_approval || 0,
        suspended: dashboardData.suspended || 0,
        revenue: dashboardData.revenue || {
          total: 0,
          pending: 0,
          paid_companies: 0,
          failed: 0,
        },
      });
    }
  }, [dashboardData]);

  const isLoading = dashboardLoading || companiesLoading;
  const error = dashboardError || companiesError;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        Loading super admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
        <p className="font-semibold mb-2">Error Loading Dashboard</p>
        <p>{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Map backend company fields to structure expected by frontend Cards and Tables
  const mappedCompanies = companies.map((company) => ({
    id: company.id,
    name: company.name,
    email: company.login_email || company.company_email || company.owner_email || "N/A",
    industry: company.industry || "N/A",
    owner: company.account_owner || company.owner_name || "N/A",
    status: company.status === "active" ? "Active" : "Inactive",
    accountStatus: company.status === "active" ? "Active" : "Suspended",
    phone: company.phone || "",
    revenue: company.platform_fee ? `$${company.platform_fee}` : "$0",
    size: company.company_size || "N/A",
    paymentStatus: company.payment_status || "Pending",
    createdAt: company.created_at,
  }));

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-slate-900">Super Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Global overview of tenant company registries, user accounts, and system metrics.
        </p>
      </div>
      <Cards stats={stats} companies={mappedCompanies} />
      <Tables companies={mappedCompanies} onRefresh={refetch} />
    </div>
  );
}
import { useEffect, useState } from "react";
import Cards from "../Cards/cards";
import Tables from "../Table/table";
import {
  useSuperAdminDashboard,
  useSuperAdminCompanies,
} from "../../hooks/useSuperAdminApi";

function Shimmer({ className = "" }) {
  return <div className={`wn-shimmer ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mb-4 space-y-2">
        <Shimmer className="h-9 w-72 max-w-full rounded-lg" />
        <Shimmer className="h-4 w-[28rem] max-w-full rounded-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <Shimmer className="h-3.5 w-28 rounded-md" />
                <Shimmer className="h-8 w-16 rounded-lg" />
                <div className="flex gap-2">
                  <Shimmer className="h-3 w-12 rounded" />
                  <Shimmer className="h-3 w-16 rounded" />
                </div>
              </div>
              <Shimmer className="w-12 h-12 rounded-full shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <Shimmer className="h-5 w-52 rounded-md" />
        </div>
        {Array.from({ length: 5 }).map((_, r) => (
          <div
            key={r}
            className="grid grid-cols-7 gap-3 px-5 py-4 border-b border-gray-50"
          >
            {Array.from({ length: 7 }).map((_, c) => (
              <Shimmer key={c} className="h-4 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function getErrorMessage(err) {
  if (!err) return null;
  if (typeof err === "string") return err;
  return (
    err?.data?.message ||
    err?.message ||
    err?.error ||
    "Something went wrong"
  );
}

export default function Admin() {
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useSuperAdminDashboard();

  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
    refetch: refetchCompanies,
  } = useSuperAdminCompanies();

  const [stats, setStats] = useState({
    total_companies: 0,
    active_companies: 0,
    new_this_month: 0,
    total_employees: 0,
    pending_approval: 0,
    suspended: 0,
    revenue: {
      total: 0,
      pending: 0,
      paid_companies: 0,
      failed: 0,
    },
  });

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

  // Debug — Console mein real errors
  useEffect(() => {
    if (dashboardError) console.error("Dashboard API error:", dashboardError);
    if (companiesError) console.error("Companies API error:", companiesError);
  }, [dashboardError, companiesError]);

  const isLoading = dashboardLoading || companiesLoading;

  // ✅ dono fail tabhi full-page error
  const bothFailed = !isLoading && dashboardError && companiesError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (bothFailed) {
    const msg =
      getErrorMessage(dashboardError) ||
      getErrorMessage(companiesError) ||
      "Something went wrong";

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
        <p className="font-semibold mb-2">Error Loading Dashboard</p>
        <p className="mb-1">{msg}</p>
        <p className="text-xs text-red-500 mb-4">
          Check Console/Network for /super-admin/dashboard and /super-admin/companies
        </p>
        <button
          onClick={() => {
            refetchDashboard?.();
            refetchCompanies?.();
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const mappedCompanies = (companies || []).map((company) => {
    const rawStatus = String(company.status || company.accountStatus || "").toLowerCase();

    let accountStatus = "Active";
    if (rawStatus === "suspended") accountStatus = "Suspended";
    else if (rawStatus === "inactive" || rawStatus === "terminated")
      accountStatus = "Terminated";
    else if (rawStatus === "active") accountStatus = "Active";

    return {
      id: company.id,
      name: company.name,
      email:
        company.login_email ||
        company.company_email ||
        company.owner_email ||
        company.email ||
        "N/A",
      industry: company.industry || "N/A",
      owner: company.account_owner || company.owner_name || company.owner || "N/A",
      status: accountStatus,
      accountStatus,
      phone: company.phone || "",
      revenue: company.platform_fee ?? company.revenue ?? 0,
      size: company.company_size || "N/A",
      paymentStatus: company.payment_status || company.paymentStatus || "Pending",
      createdAt: company.created_at,
      rawCompany: company,
    };
  });

  const softError = getErrorMessage(dashboardError) || getErrorMessage(companiesError);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-slate-900">
          Super Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Global overview of tenant company registries, user accounts, and
          system metrics.
        </p>
      </div>

      {/* Soft warning if only one API failed */}
      {softError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center justify-between gap-3">
          <span>⚠️ Partial load: {softError}</span>
          <button
            onClick={() => {
              refetchDashboard?.();
              refetchCompanies?.();
            }}
            className="shrink-0 px-3 py-1 rounded bg-amber-600 text-white text-xs hover:bg-amber-700"
          >
            Retry
          </button>
        </div>
      )}

      <Cards stats={stats} companies={mappedCompanies} />
      <Tables companies={mappedCompanies} onRefresh={refetchDashboard} />
    </div>
  );
}
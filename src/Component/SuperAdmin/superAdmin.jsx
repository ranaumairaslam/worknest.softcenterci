import { useEffect, useState } from "react";
import Cards from "../Cards/cards";
import Tables from "../Table/table";
import { getSuperAdminDashboard } from "../../services/superAdminService.js";

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSuperAdminDashboard()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        Loading super admin dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600 shadow-sm">
        Error: {error}
      </div>
    );
  }

  const { stats = {}, companies = [] } = data || {};

  // Map backend company fields to structure expected by frontend Cards and Tables
  const mappedCompanies = companies.map((company) => ({
    id: company.id,
    name: company.name,
    email: company.company_email || company.owner_email || "N/A",
    industry: company.industry || "N/A",
    owner: company.owner_name || "N/A",
    status: company.status === "active" ? "Active" : "Inactive",
    accountStatus: company.status === "active" ? "Active" : "Suspended",
    phone: company.phone || "",
    revenue: "$0",
    size: "N/A",
    paymentStatus: "Paid",
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
      <Tables companies={mappedCompanies} />
    </div>
  );
}
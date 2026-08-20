import { useEffect, useState } from "react";
import DashboardCardsData from "./dashboardCardsData.js";
import { getSuperAdminDashboard } from "../../services/superAdminService";

/** Single shimmer block */
function Shimmer({ className = "" }) {
  return <div className={`wn-shimmer ${className}`} />;
}

/** One card skeleton — matches real card layout */
function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <Shimmer className="h-3.5 w-28 rounded-md" />
          <Shimmer className="h-8 w-16 rounded-lg mt-3" />
          <div className="flex items-center gap-2 mt-3">
            <Shimmer className="h-3 w-12 rounded" />
            <Shimmer className="h-3 w-16 rounded" />
          </div>
        </div>
        <Shimmer className="w-12 h-12 rounded-full shrink-0" />
      </div>
    </div>
  );
}

export default function DashboardCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getSuperAdminDashboard();
        if (data) setStats(data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const cardValues = {
    totalUsers: stats?.total_employees ?? 0,
    monthlyRevenue: `$${Number(stats?.revenue?.pending ?? 0).toLocaleString("en-US")}`,
    totalCompanies: stats?.total_companies ?? 0,
    activeEmployees: stats?.total_employees ?? 0,
    pendingCompanies: stats?.pending_approval ?? 0,
    suspendedCompanies: stats?.suspended ?? 0,
    paidCompanies: stats?.revenue?.paid_companies ?? 0,
    newCompanies: stats?.new_this_month ?? 0,
  };

  // ✅ Facebook-style shimmer while loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {DashboardCardsData.map((card, index) => {
        const Icon = card.icon;
        const value = cardValues[card.key] ?? 0;

        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <h2 className="text-3xl font-bold text-gray-900 mt-3">{value}</h2>
                <div className="flex items-center gap-2 mt-3">
                  <span className={`text-sm font-semibold ${card.color}`}>
                    {card.change}
                  </span>
                  <span className="text-xs text-gray-500">Last Month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#a3feff]/40 text-[#016472] shrink-0">
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
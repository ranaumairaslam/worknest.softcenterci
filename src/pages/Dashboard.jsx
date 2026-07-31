import {
  FolderKanban,
  Users,
  UserRound,
  Building2,
  CheckSquare,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useDashboardData } from "../hooks/useDashboardData";
import StatCard from "../components/Cards/StatCard";
import QuickActionsCard from "../components/Cards/QuickActionsCard";
import ListCard from "../components/Cards/ListCard";
import ProgressTable from "../components/Tables/ProgressTable";

const statIcons = {
  "total-projects": { icon: <FolderKanban size={20} className="text-cyan-600" />, iconBg: "bg-cyan-50" },
  "total-teams": { icon: <Users size={20} className="text-indigo-600" />, iconBg: "bg-indigo-50" },
  "total-employees": { icon: <UserRound size={20} className="text-violet-600" />, iconBg: "bg-violet-50" },
  "total-clients": { icon: <Building2 size={20} className="text-blue-600" />, iconBg: "bg-blue-50" },
  "active-tasks": { icon: <CheckSquare size={20} className="text-orange-600" />, iconBg: "bg-orange-50" },
  "completed-tasks": { icon: <CheckSquare size={20} className="text-green-600" />, iconBg: "bg-green-50" },
  "pending-tasks": { icon: <CheckSquare size={20} className="text-amber-600" />, iconBg: "bg-amber-50" },
  "total-revenue": { icon: <DollarSign size={20} className="text-emerald-600" />, iconBg: "bg-emerald-50" },
};

export default function Dashboard() {
  const { stats, projects, invitations, team, revenue, loading, error } = useDashboardData();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading company dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-rose-500">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Company Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage all company operations from a single overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const meta = statIcons[stat.id] || statIcons["total-projects"];
          return (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              note={stat.note}
              icon={meta.icon}
              iconBg={meta.iconBg}
            />
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProgressTable title="Project Progress" rows={projects} />
        </div>
        <QuickActionsCard />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListCard
          title="Recent Activity"
          items={invitations}
          onAction={() => navigate("/company-reports")}
        />
        <ListCard
          title="Team Overview"
          items={team}
          onAction={(item) => navigate("/employees")}
        />
      </div>

      {revenue && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <TrendingUp className="text-emerald-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Revenue Overview</p>
              <p className="text-2xl font-bold text-slate-900">
                ${(revenue.totalRevenue / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-slate-400">
                Total company revenue across {revenue.revenuePerProject?.length || 0} projects
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

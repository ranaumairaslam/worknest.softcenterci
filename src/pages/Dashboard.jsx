import React from "react";
import { Search, Bell, BarChart3, Loader2, CheckCircle2 } from "lucide-react";
import StatCard from "../components/Cards/StatCard";
import QuickActionsCard from "../components/Cards/QuickActionsCard";
import ListCard from "../components/Cards/ListCard";
import ProgressTable from "../components/Tables/ProgressTable";
import { useDashboardData } from "../hooks/useDashboardData";

const icons = {
  "total-projects": <BarChart3 size={20} className="text-blue-600" />,
  "active-tasks": <Loader2 size={20} className="text-amber-500" />,
  "completed-projects": <CheckCircle2 size={20} className="text-emerald-500" />,
};

const iconBgs = {
  "total-projects": "bg-blue-50",
  "active-tasks": "bg-amber-50",
  "completed-projects": "bg-emerald-50",
};

export default function Dashboard() {
  const { stats, projects, invitations, team, loading, error } = useDashboardData();

  if (loading) {
    return <div className="p-6 text-slate-500 text-sm">Loading dashboard…</div>;
  }

  if (error) {
    return <div className="p-6 text-rose-500 text-sm">Failed to load dashboard data.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-slate-800 tracking-wide">
          COMPANY DASHBOARD
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Global Search"
              className="pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <button className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <Bell size={16} className="text-slate-500" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-rose-500 text-white">5</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-slate-800">Jane Doe</p>
              <p className="text-xs text-slate-400">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            label={s.label}
            value={s.value}
            note={s.note}
            icon={icons[s.id]}
            iconBg={iconBgs[s.id]}
          />
        ))}
        <QuickActionsCard onAction={(label) => console.log(label)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <ProgressTable title="Active Project Progress Overview" rows={projects} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm font-medium text-slate-700 mb-4">Project Leader Designation</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 rounded-lg">
                Project Progress
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm font-medium text-slate-700 mb-4">Assign Team</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 rounded-lg">
                Assign Team
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <ListCard title="Pending Invitations" items={invitations} />
          <ListCard title="Team Overview" items={team} onAction={(item) => console.log(item)} />
        </div>
      </div>
    </div>
  );
}
import { BarChart3, Loader2, CheckCircle2 } from "lucide-react";
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
    <div className="space-y-6">
      
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
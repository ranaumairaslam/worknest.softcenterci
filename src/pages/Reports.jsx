
import { Calendar, Download, ChevronDown } from "lucide-react";
import StatCardSimple from "../components/Cards/StatCardSimple";
import DonutChart from "../components/Charts/DonutChart";
import BarChart from "../components/Charts/BarChart";
import ReportsTable from "../components/Tables/ReportsTable";
import { useReportsData } from "../hooks/useReportsData";

export default function Reports() {
  const { data, loading, error } = useReportsData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading reports…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load reports.</div>;

  const { stats, statusBreakdown, projectProgress, reports } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track progress, performance and productivity across your projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-600 bg-white">
            <Calendar size={14} /> Jun 01, 2025 - Jun 30, 2025
          </button>
          <button className="flex items-center gap-2 text-sm border border-indigo-200 text-indigo-600 rounded-lg px-3 py-2 bg-white">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCardSimple key={s.id} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-medium text-slate-700 mb-4">Task Status Overview</p>
          <DonutChart segments={statusBreakdown} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-700">Project Progress</p>
            <button className="flex items-center gap-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-500">
              By Project <ChevronDown size={12} />
            </button>
          </div>
          <BarChart data={projectProgress} max={100} />
        </div>
      </div>

      <ReportsTable reports={reports} />
    </div>
  );
}
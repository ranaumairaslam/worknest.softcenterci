import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  Users,
  ClipboardList,
  AlertTriangle,
  FileText,
  Download,
} from "lucide-react";

import { useCompanyReports } from "../hooks/useCompanyReports";
import ProjectStatusChart from "../components/reports/ProjectStatusChart";
import MonthlyCompletionChart from "../components/reports/MonthlyCompletionChart";
import TeamPerformanceChart from "../components/reports/TeamPerformanceChart";
import TaskTrendChart from "../components/reports/TaskTrendChart";
import ReportStatsCard from "../components/reports/ReportStatsCard";
import FilterBar from "../components/reports/FilterBar";

const iconMap = {
  "Total Projects": FolderKanban,
  Completed: CheckCircle2,
  Active: Clock3,
  Employees: Users,
  Tasks: ClipboardList,
  Overdue: AlertTriangle,
};

export default function CompanyReports() {
  const { data, loading, error } = useCompanyReports();

  const handleExport = (type) => {
    alert(`${type} export will be available when backend is connected.`);
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading reports...</div>;
  }

  if (error || !data) {
    return <div className="p-6 text-sm text-rose-500">Failed to load reports.</div>;
  }

  const monthlyData = data.monthlyCompletion.map((item) => ({
    month: item.month.slice(5) || item.month,
    completed: item.value,
  }));

  const teamData = data.teamPerformance.map((t) => ({
    team: t.name,
    score: t.progress,
  }));

  const taskData = data.taskTrend.map((t) => ({
    month: t.name,
    tasks: t.value,
  }));

  return (
    <div className="min-h-screen bg-[#F5FCFC] p-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#01343C]">Reports Dashboard</h1>
          <p className="mt-2 text-[#5C7B80]">
            Monitor company performance, projects, and employee productivity.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport("PDF")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#CFEDEE] bg-white px-5 py-2.5 text-[#016472] shadow-sm transition hover:border-[#016472] hover:bg-[#EEF9FA]"
          >
            <FileText size={18} />
            Export PDF
          </button>
          <button
            onClick={() => handleExport("Excel")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-2.5 text-white shadow transition hover:bg-[#027C8A]"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      <FilterBar />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.stats.map((item) => (
          <ReportStatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={iconMap[item.title] || FolderKanban}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ProjectStatusChart data={data.projectStatusData} />
        <MonthlyCompletionChart data={monthlyData} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <TeamPerformanceChart data={teamData} />
        <TaskTrendChart data={taskData} />
      </div>
    </div>
  );
}

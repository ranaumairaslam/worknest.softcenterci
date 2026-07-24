import React from "react";
import ProjectStatusChart from "../components/reports/ProjectStatusChart";
import MonthlyCompletionChart from "../components/reports/MonthlyCompletionChart";
import TeamPerformanceChart from "../components/reports/TeamPerformanceChart";
import TaskTrendChart from "../components/reports/TaskTrendChart";
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

import ReportStatsCard from "../components/reports/ReportStatsCard";
import FilterBar from "../components/reports/FilterBar";

const stats = [
  {
    title: "Total Projects",
    value: 24,
    subtitle: "Across all departments",
    icon: FolderKanban,
    color: "bg-cyan-600",
  },
  {
    title: "Completed",
    value: 18,
    subtitle: "Finished successfully",
    icon: CheckCircle2,
    color: "bg-green-600",
  },
  {
    title: "Active",
    value: 6,
    subtitle: "Currently running",
    icon: Clock3,
    color: "bg-orange-500",
  },
  {
    title: "Employees",
    value: 82,
    subtitle: "Company members",
    icon: Users,
    color: "bg-violet-600",
  },
  {
    title: "Tasks",
    value: 412,
    subtitle: "Assigned tasks",
    icon: ClipboardList,
    color: "bg-blue-600",
  },
  {
    title: "Overdue",
    value: 12,
    subtitle: "Need attention",
    icon: AlertTriangle,
    color: "bg-red-600",
  },
];

export default function CompanyReports() {
  return (
 <div className="min-h-screen bg-[#F5FCFC] p-6">

    

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
         <h1 className="text-3xl font-bold text-[#01343C]">
    Reports Dashboard
</h1>

<p className="mt-2 text-[#5C7B80]">
    Monitor company performance, projects and employee productivity.
</p>
        </div>

        <div className="flex flex-wrap gap-3">

          <button className="rounded-xl border border-[#CFEDEE] bg-white px-5 py-2.5 text-[#016472] shadow-sm transition hover:bg-[#EEF9FA] hover:border-[#016472]">
            <FileText size={18} />
            Export PDF
          </button>

          <button className="rounded-xl bg-[#016472] px-5 py-2.5 text-white shadow transition hover:bg-[#027C8A]">
            <Download size={18} />
            Export Excel
          </button>

        </div>
      </div>

      

      <FilterBar />

      

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

        {stats.map((item) => (
          <ReportStatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            color={item.color}
          />
        ))}

      </div>

      

<div className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
  <ProjectStatusChart />
  <MonthlyCompletionChart />
</div>

<div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
  <TeamPerformanceChart />
  <TaskTrendChart />
</div>

    </div>
  );
}
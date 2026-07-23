
import ProjectHeaderCard from "../../components/Project/ProjectHeaderCard";
import ProjectTimeline from "../../components/Project/ProjectTimeline";
import TeamPerformanceCard from "../../components/Project/TeamPerformanceCard";
import StatCardTrend from "../../components/Cards/StatCardTrend";
import TaskOverviewTable from "../../components/Tables/TaskOverviewTable";
import MiniKanbanPreview from "../../components/Kanban/MiniKanbanPreview";
import { useProjectOversightData } from "../../hooks/useProjectOversightData";

export default function ProjectOversightFull() {
  const { data, loading, error } = useProjectOversightData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading project oversight…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  const { summary, stats, timeline, team, tasks, kanban } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Project Oversight</h1>
        <p className="text-xs text-slate-400 mt-1">Dashboard &gt; Project Oversight</p>
      </div>

      <ProjectHeaderCard summary={summary} />

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map((s) => (
          <StatCardTrend key={s.id} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ProjectTimeline steps={timeline} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-700">Team Performance</p>
            <button className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team.map((m) => (
              <TeamPerformanceCard key={m.id} member={m} />
            ))}
          </div>
        </div>
      </div>

      <TaskOverviewTable tasks={tasks} totalCount={50} />

      <MiniKanbanPreview columns={kanban.columns} />
    </div>
  );
}
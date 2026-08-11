import TeamPerformanceCard from "../components/Cards/TeamPerformanceCard";
import ProjectSearchSelect from "../components/Cards/ProjectSearchSelect";
import { useProjectOversightData } from "../hooks/useProjectOversightData";

export default function TeamPerformancePage() {
  const { projects, selectedProjectId, setSelectedProjectId, data, loading, error } =
    useProjectOversightData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading team performance…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  const { summary, team } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Team Performance</h1>
        <p className="text-xs text-slate-400 mt-1">
          Dashboard &gt; Project Oversight &gt; Team Performance
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">Project:</label>
        {projects && projects.length > 0 ? (
          <ProjectSearchSelect
            projects={projects}
            selectedId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
        ) : (
          <span className="text-sm font-medium text-slate-800">{summary.name}</span>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        {team.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No team members assigned to this project yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {team.map((m) => (
              <TeamPerformanceCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import ProjectTimeline from "../components/Cards/ProjectTimeline";
import ProjectSearchSelect from "../components/Cards/ProjectSearchSelect";
import { useProjectOversightData } from "../hooks/useProjectOversightData";

export default function ProjectTimelinePage() {
  const { projects, selectedProjectId, setSelectedProjectId, data, loading, error } =
    useProjectOversightData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading timeline…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  const { summary, timeline } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Project Timeline</h1>
        <p className="text-xs text-slate-400 mt-1">
          Dashboard &gt; Project Oversight &gt; Timeline
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

      <ProjectTimeline steps={timeline} />
    </div>
  );
}
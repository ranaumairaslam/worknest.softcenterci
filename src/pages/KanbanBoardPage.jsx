import MiniKanbanPreview from "../components/Cards/MiniKanbanPreview";
import { useProjectOversightData } from "../hooks/useProjectOversightData";

export default function KanbanBoardPage() {
  const { data, loading, error } = useProjectOversightData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading kanban board…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  const { summary, kanban } = data;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Kanban Board</h1>
        <p className="text-xs text-slate-400 mt-1">
          Dashboard &gt; Project Oversight &gt; Kanban Board
        </p>
        <p className="text-sm text-slate-500 mt-1">{summary.name}</p>
      </div>

      <MiniKanbanPreview columns={kanban.columns} />
    </div>
  );
}
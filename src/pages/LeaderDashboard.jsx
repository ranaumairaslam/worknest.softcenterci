import { useState } from "react";
import { ChevronDown } from "lucide-react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import DeliverablesReviewModal from "../components/Modals/DeliverablesReviewModal";
import { useProjectLeaderData } from "../hooks/useProjectLeaderData";

export default function ProjectLeaderDashboard() {
  const {
    projects,
    tasks,
    deliverables,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    error,
  } = useProjectLeaderData();

  const [showReview, setShowReview] = useState(false);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading project…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">
          MY PROJECT OVERSIGHT <span className="text-xs text-slate-400 font-normal"></span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">Project:</label>
        <div className="relative">
          <select
            value={selectedProjectId ?? ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-700">Task Management Board</p>
          <button className="text-xs text-slate-500 border border-slate-200 rounded-md px-2 py-1">
            Scrum/Kanban
          </button>
        </div>
        <KanbanBoard tasks={tasks} onTaskClick={() => {}} />
      </div>

      <DeliverablesReviewModal
        items={showReview ? deliverables : null}
        onClose={() => setShowReview(false)}
        onApprove={(item) => console.log("approved:", item)}
        onReject={(item) => console.log("rejected:", item)}
      />
    </div>
  );
}
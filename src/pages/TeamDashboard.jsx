import { useState } from "react";
import { ChevronDown } from "lucide-react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import TaskDetailModal from "../components/Modals/TaskDetailModal";
import { useTeamMemberTasks } from "../hooks/useTeamMemberTasks";

export default function TeamMemberDashboard() {
  const { tasks, loading, error } = useTeamMemberTasks();
  const [selectedTask, setSelectedTask] = useState(null);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading tasks…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load tasks.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-800">
          MY WORK EXECUTION <span className="text-xs text-slate-400 font-normal">FR-5.1</span>
        </h1>
        <button className="flex items-center gap-1 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5">
          Filter by Tenant_ID <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">My Tasks across Projects</p>
        <button className="text-sm text-blue-600">Personal view</button>
      </div>

      <KanbanBoard tasks={tasks} onTaskClick={setSelectedTask} />

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSubmit={(payload) => {
          console.log("submitted:", payload);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}
// src/pages/TeamDashboard.jsx
import { useState } from "react";
import { ChevronDown, Check, Users, User } from "lucide-react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import TaskDetailModal from "../components/Modals/TaskDetailModal";
import { useTeamMemberTasks } from "../hooks/useTeamMemberTasks";

// Top-level component — React Compiler forbids defining components
// inside another component's render function.
function ProjectFilterDropdown({ value, projects, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5"
      >
        {value === "All" ? "Filter by Project" : value} <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
          {["All", ...projects].map((p) => (
            <button
              key={p}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              {p}
              {value === p && <Check size={14} className="text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamMemberDashboard() {
  const {
    tasks,
    projects,
    projectFilter,
    setProjectFilter,
    viewMode,
    setViewMode,
    submitTask,
    startTask,   // ✅ NEW - from updated hook
    loading,
    error,
  } = useTeamMemberTasks();

  const [selectedTask, setSelectedTask] = useState(null);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading tasks…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load tasks.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-800">
          MY WORK EXECUTION <span className="text-xs text-slate-400 font-normal">FR-5.1</span>
        </h1>
        <ProjectFilterDropdown value={projectFilter} projects={projects} onChange={setProjectFilter} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">
          {viewMode === "personal" ? "My Tasks across Projects" : "Team Tasks across Projects"}
        </p>
        <button
          onClick={() => setViewMode(viewMode === "personal" ? "team" : "personal")}
          className="flex items-center gap-1 text-sm text-blue-600"
        >
          {viewMode === "personal" ? <Users size={14} /> : <User size={14} />}
          {viewMode === "personal" ? "Switch to Team view" : "Switch to Personal view"}
        </button>
      </div>

      <KanbanBoard tasks={tasks} onTaskClick={setSelectedTask} />

      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onStart={(taskId) => {                    // ✅ NEW - Start Task handler
          startTask(taskId);
          setSelectedTask(null);
        }}
        onSubmit={(payload) => {
          submitTask(selectedTask.id, payload);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}
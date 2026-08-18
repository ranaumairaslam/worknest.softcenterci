import { useState } from "react";
import { ChevronDown, ClipboardCheck, LayoutGrid, List, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import KanbanBoard from "../components/Kanban/KanbanBoard";
import DeliverablesReviewModal from "../components/Modals/DeliverablesReviewModal";
import AssignTaskModal from "../components/Modals/AssignTaskModal";
import EditKanbanTaskModal from "../components/Modals/EditKanbanTaskModal";
import { useProjectLeaderData } from "../hooks/useProjectLeaderData";
import CreateProjectModal from "../components/Modals/CreateProjectModal";
import LoadingShimmer from "../components/common/LoadingShimmer";


const statusLabel = {
  todo: "To Do",
  in_progress: "In Progress",
  under_review: "Under Review",
  completed: "Completed",
};

// Top-level component — the React Compiler forbids defining
// components inside another component's render function.
function TaskListRow({ task, onOpenAssign, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg">
      <button
        type="button"
        onClick={() => onOpenAssign(task)}
        className="flex-1 flex items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-medium text-slate-700">{task.title}</p>
          <p className="text-xs text-slate-400">{statusLabel[task.status]}</p>
        </div>
        <div className="flex items-center gap-2 mr-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
            {task.assignee.avatar}
          </div>
          <span className="text-xs text-slate-500">{task.assignee.name}</span>
        </div>
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Task actions"
          className="text-slate-400 hover:text-slate-600 p-1"
        >
          <MoreHorizontal size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onEdit(task);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(task);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProjectLeaderDashboard() {
  const {
    projects,
    tasks,
    deliverables,
    teamMembers,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    error,
    handleApprove,
    handleReject,
    handleReassign,
    handleUpdateTask,
    handleDeleteTask,
    handleCreateProject,
  } = useProjectLeaderData();

  const [showReview, setShowReview] = useState(false);
  const [viewMode, setViewMode] = useState("kanban");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

  if (loading) return <LoadingShimmer message="Loading project..." variant="kanban" />;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  if (!projects.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-semibold text-slate-800">MY PROJECT OVERSIGHT</h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-lg font-medium text-slate-700">No projects assigned yet</p>
          <p className="mt-2 text-sm text-slate-500">
            This team leader account does not currently have any projects to monitor.
          </p>
        </div>
      </div>
    );
  }

  function confirmDelete(task) {
    const ok = window.confirm(`Delete task "${task.title}"? This can't be undone.`);
    if (ok) handleDeleteTask(task.id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-800">
          MY PROJECT OVERSIGHT <span className="text-xs text-slate-400 font-normal"></span>
        </h1>
        <button
          onClick={() => setShowReview(true)}
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg"
        >
          <ClipboardCheck size={14} />
          Review Deliverables
          {deliverables.length > 0 && (
            <span className="bg-white text-blue-600 text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {deliverables.length}
            </span>
          )}
        </button>
      </div>

     <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-slate-500">Project:</label>
        <div className="relative">
          <select
            value={selectedProjectId ?? ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <button
          onClick={() => setShowCreateProject(true)}
          className="flex items-center gap-1 text-sm border border-blue-200 text-blue-600 rounded-lg px-3 py-1.5 hover:bg-blue-50"
        >
          <Plus size={14} /> New Project
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-700">Task Management Board</p>
          <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 text-xs px-2 py-1 ${
                viewMode === "kanban" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid size={12} /> Kanban
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 text-xs px-2 py-1 border-l border-slate-200 ${
                viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <List size={12} /> List
            </button>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            onTaskClick={setSelectedTask}
            onEditTask={setEditingTask}
            onDeleteTask={confirmDelete}
            onDropTask={(taskId, newStatus) => handleUpdateTask(taskId, { status: newStatus })}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {tasks.map((t) => (
              <TaskListRow
                key={t.id}
                task={t}
                onOpenAssign={setSelectedTask}
                onEdit={setEditingTask}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showReview && (
        <DeliverablesReviewModal
          items={deliverables}
          onClose={() => setShowReview(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <AssignTaskModal
        task={selectedTask}
        teamMembers={teamMembers}
        onClose={() => setSelectedTask(null)}
        onAssign={handleReassign}
      />

      <EditKanbanTaskModal
        task={editingTask}
        teamMembers={teamMembers}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />

      <CreateProjectModal
        open={showCreateProject}
        teamMembers={teamMembers}
        onClose={() => setShowCreateProject(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
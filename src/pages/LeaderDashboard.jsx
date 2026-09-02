import { useState } from "react";
import {
  ChevronDown,
  ClipboardCheck,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import KanbanBoard from "../components/Kanban/KanbanBoard";
import DeliverablesReviewModal from "../components/Modals/DeliverablesReviewModal";
import AssignTaskModal from "../components/Modals/AssignTaskModal";
import EditTaskModal from "../components/Cards/EditTaskModal";
import CreateProjectModal from "../components/Modals/CreateProjectModal";
import TaskDetailsModal from "../components/Modals/TaskDetailsModal";

import { useProjectLeaderData } from "../hooks/useProjectLeaderData";

// ✅ keys match backend statuses
const statusLabel = {
  todo: "To Do",
  in_progress: "In Progress",
  under_review: "Under Review",
  submitted: "Submitted",
  done: "Completed",
  blocked: "Blocked",
};

function TaskListRow({ task, onOpenAssign, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const assigneeName =
    task.assigneeName ||
    task.assignee_name ||
    task.assignee?.name ||
    "Unassigned";

  const taskTitle = task.title || "Untitled Task";

  return (
    <div className="w-full flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg">
      {/* Task */}
      <button
        type="button"
        onClick={() => onOpenAssign(task)}
        className="flex-1 flex items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-medium text-slate-700">{taskTitle}</p>
          <p className="text-xs text-slate-400">
            {statusLabel[task.status] || task.status || "Pending"}
          </p>
        </div>

        <div className="flex items-center gap-2 mr-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
            {assigneeName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-slate-500">{assigneeName}</span>
        </div>
      </button>

      {/* Actions */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
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
              <Pencil size={12} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDelete(task);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-500 hover:bg-rose-50"
            >
              <Trash2 size={12} />
              Delete
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
  const [selectedTask, setSelectedTask] = useState(null); // task details
  const [taskToAssign, setTaskToAssign] = useState(null); // reassign
  const [editingTask, setEditingTask] = useState(null); // edit
  const [showCreateProject, setShowCreateProject] = useState(false);

  if (loading) {
    return <div className="p-6 text-slate-500 text-sm">Loading project…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-rose-500 text-sm">
        Failed to load project data.
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-xl font-semibold text-slate-800">
            MY PROJECT OVERSIGHT
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <p className="text-lg font-medium text-slate-700">
            No projects assigned yet
          </p>
          <p className="mt-2 text-sm text-slate-500">
            This team leader account does not currently have any projects to
            monitor.
          </p>
        </div>
      </div>
    );
  }

  // ✅ handlers now re-throw, so catch here to avoid unhandled rejections
  async function confirmDelete(task) {
    const ok = window.confirm(
      `Delete task "${task.title}"? This can't be undone.`
    );
    if (!ok) return;

    try {
      await handleDeleteTask(task.id);
    } catch (err) {
      window.alert(err.message || "Failed to delete task.");
    }
  }

  async function handleDropTask(taskId, newStatus) {
    try {
      await handleUpdateTask(taskId, { status: newStatus });
    } catch (err) {
      window.alert(err.message || "Failed to move task.");
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-slate-800">
          MY PROJECT OVERSIGHT
        </h1>

        <button
          type="button"
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

      {/* PROJECT SELECTOR */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-sm text-slate-500">Project:</label>

        <div className="relative">
          <select
            value={selectedProjectId ?? ""}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-lg text-sm pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={14}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowCreateProject(true)}
          className="flex items-center gap-1 text-sm border border-blue-200 text-blue-600 rounded-lg px-3 py-1.5 hover:bg-blue-50"
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {/* TASK BOARD */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-700">
            Task Management Board
          </p>

          <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 text-xs px-2 py-1 ${
                viewMode === "kanban"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid size={12} />
              Kanban
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 text-xs px-2 py-1 border-l border-slate-200 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <List size={12} />
              List
            </button>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <KanbanBoard
            tasks={tasks}
            onTaskClick={setTaskToAssign}
            onEditTask={setEditingTask}
            onDeleteTask={confirmDelete}
            onDropTask={handleDropTask}
          />
        ) : (
          <div className="divide-y divide-slate-50">
            {tasks.map((task) => (
              <TaskListRow
                key={task.id}
                task={task}
                onOpenAssign={setTaskToAssign}
                onEdit={setEditingTask}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* REVIEW DELIVERABLES MODAL */}
      {showReview && (
        <DeliverablesReviewModal
          items={deliverables}
          onClose={() => setShowReview(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewTask={(item) => {
            if (!item?.task) {
              console.error("Task data missing:", item);
              return;
            }
            setShowReview(false);
            setSelectedTask(item.task);
          }}
        />
      )}

      {/* TASK DETAILS MODAL */}
      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      {/* REASSIGN TASK MODAL */}
      <AssignTaskModal
        task={taskToAssign}
        teamMembers={teamMembers}
        onClose={() => setTaskToAssign(null)}
        onAssign={handleReassign}
      />

      {/* EDIT TASK MODAL */}
      {/* ✅ EditTaskModal directly — prop is `team`, onSave goes straight to the hook */}
    <EditTaskModal
  task={editingTask}
  team={teamMembers}
  onClose={() => setEditingTask(null)}
  onSave={handleUpdateTask}
/>
      {/* CREATE PROJECT MODAL */}
      <CreateProjectModal
        open={showCreateProject}
        teamMembers={teamMembers}
        onClose={() => setShowCreateProject(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
}
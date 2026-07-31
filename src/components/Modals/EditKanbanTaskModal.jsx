import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "under_review", label: "Under Review" },
  { value: "completed", label: "Completed" },
];

export default function EditKanbanTaskModal({ task, teamMembers, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");
  const [assigneeId, setAssigneeId] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      const match = teamMembers.find((m) => m.name === task.assignee.name);
      setAssigneeId(match ? match.id : "");
      setErrors({});
    }
  }, [task, teamMembers]);

  if (!task) return null;

  function validate() {
    const next = {};
    if (!title.trim()) next.title = "Task title is required.";
    if (!assigneeId) next.assigneeId = "Please select an assignee.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const member = teamMembers.find((m) => m.id === assigneeId);
    onSave(task.id, { title: title.trim(), status, assignee: member });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Edit Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          <div>
            <label htmlFor="edit-task-title" className="text-xs font-medium text-slate-500 block mb-1">
              Task Title
            </label>
            <input
              id="edit-task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={
                errors.title
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="edit-task-status" className="text-xs font-medium text-slate-500 block mb-1">
              Status
            </label>
            <select
              id="edit-task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-task-assignee" className="text-xs font-medium text-slate-500 block mb-1">
              Assignee
            </label>
            <select
              id="edit-task-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={
                errors.assigneeId
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            >
              <option value="" disabled>Select a team member</option>
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {errors.assigneeId && <p className="text-xs text-rose-500 mt-1">{errors.assigneeId}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg mt-2"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
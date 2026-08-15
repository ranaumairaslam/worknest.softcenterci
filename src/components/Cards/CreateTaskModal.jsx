// src/components/Cards/CreateTaskModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CreateTaskModal({
  open,
  team,
  projects,
  currentProjectId,
  onClose,
  onCreate,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState(currentProjectId ?? "");
  const [priority, setPriority] = useState("Medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setProjectId(currentProjectId ?? "");
    }
  }, [open, currentProjectId]);

  if (!open) return null;

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Task name is required.";
    if (!projectId) next.projectId = "Please select a project.";
    if (!assigneeId) next.assigneeId = "Please select an assignee.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    if (submitting) return;

    const member = team.find((m) => String(m.id) === String(assigneeId));
    const project = projects.find((p) => String(p.id) === String(projectId));

    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        projectId,
        projectName: project?.name ?? "",
        priority,
        assigneeId,
        assigneeName: member?.name ?? "",
        dueDate: dueDate || null,
      });

      // Reset form on success
      setName("");
      setDescription("");
      setPriority("Medium");
      setAssigneeId("");
      setDueDate("");
      setErrors({});
      onClose();
    } catch (err) {
      setErrors({
        submit: err.message || "Failed to create task. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Create Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {/* Task Name */}
          <div>
            <label htmlFor="task-name" className="text-xs font-medium text-slate-500 block mb-1">
              Task Name
            </label>
            <input
              id="task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fix login bug"
              className={
                errors.name
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="text-xs font-medium text-slate-500 block mb-1">
              Description
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          </div>

          {/* Project */}
          {projects && projects.length > 0 && (
            <div>
              <label htmlFor="task-project" className="text-xs font-medium text-slate-500 block mb-1">
                Project
              </label>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={
                  errors.projectId
                    ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                }
              >
                <option value="" disabled>Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-xs text-rose-500 mt-1">{errors.projectId}</p>
              )}
            </div>
          )}

          {/* Assignee */}
          <div>
            <label htmlFor="task-assignee" className="text-xs font-medium text-slate-500 block mb-1">
              Assignee
            </label>
            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={
                errors.assigneeId
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            >
              <option value="" disabled>Select team member</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.assigneeId && (
              <p className="text-xs text-rose-500 mt-1">{errors.assigneeId}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="task-priority" className="text-xs font-medium text-slate-500 block mb-1">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="task-due" className="text-xs font-medium text-slate-500 block mb-1">
              Due Date
            </label>
            <input
              id="task-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-2">
              <p className="text-xs text-rose-600">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2 rounded-lg mt-2 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
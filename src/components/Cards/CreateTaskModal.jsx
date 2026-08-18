// src/components/Cards/CreateTaskModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CreateTaskModal({
  open,
  team = [],
  projects = [],
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

    if (!name.trim()) {
      next.name = "Task name is required.";
    }

    if (!description.trim()) {
      next.description = "Task description is required.";
    }

    if (!projectId) {
      next.projectId = "Please select a project.";
    }

    if (!assigneeId) {
      next.assigneeId = "Please select an assignee.";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;
    if (submitting) return;

    const member = team.find(
      (m) => String(m.id) === String(assigneeId)
    );

    const project = projects.find(
      (p) => String(p.id) === String(projectId)
    );

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

      // Reset form
      setName("");
      setDescription("");
      setProjectId(currentProjectId ?? "");
      setPriority("Medium");
      setAssigneeId("");
      setDueDate("");
      setErrors({});

      onClose();
    } catch (err) {
      setErrors({
        submit:
          err.message ||
          "Failed to create task. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (error) =>
    `w-full border ${
      error ? "border-rose-300" : "border-slate-200"
    } rounded-lg text-sm px-3 py-2.5
    bg-white text-slate-700
    focus:outline-none
    ${
      error
        ? "focus:ring-2 focus:ring-rose-500/30"
        : "focus:ring-2 focus:ring-blue-500/30"
    }`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Create Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3"
        >
          {/* Task Name */}
          <div>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task Name *"
              className={inputClass(errors.name)}
            />

            {errors.name && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Task Description */}
          <div>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description *"
              rows={4}
              className={`${inputClass(
                errors.description
              )} resize-none`}
            />

            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Project */}
          {projects.length > 0 && (
            <div>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={inputClass(errors.projectId)}
              >
                <option value="" disabled>
                  Select project
                </option>

                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {errors.projectId && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.projectId}
                </p>
              )}
            </div>
          )}

          {/* Assignee */}
          <div>
            <label
              htmlFor="task-assignee"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Assignee
            </label>

            <select
              id="task-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={inputClass(errors.assigneeId)}
            >
              <option value="" disabled>
                Select team member
              </option>

              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {errors.assigneeId && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.assigneeId}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="task-priority"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="task-due"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
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
              <p className="text-xs text-rose-600">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
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
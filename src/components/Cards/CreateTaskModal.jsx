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

  // Set current project whenever modal opens
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

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const member = team.find(
      (m) => String(m.id) === String(assigneeId)
    );

    const project = projects.find(
      (p) => String(p.id) === String(projectId)
    );

    onCreate({
      id: `TASK-${Math.floor(Math.random() * 900 + 100)}`,

      name: name.trim(),

      description: description.trim(),

      projectId,

      projectName: project?.name ?? "",

      priority,

      status: "Pending",

      assignee: member
        ? member.name
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "",

      dueDate: dueDate || "TBD",

      progress: 0,

      category: "New",
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
          <h2 className="text-xl font-semibold text-slate-800">
            Assign Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4"
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
              placeholder="Task Description"
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

          {/* Project + Team Member */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project */}
            <div>
              <select
                id="task-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={inputClass(errors.projectId)}
              >
                <option value="" disabled>
                  Select Project *
                </option>

                {projects?.map((p) => (
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

              {projectId &&
                projectId !== currentProjectId && (
                  <p className="text-xs text-amber-600 mt-1">
                    You're viewing a different project — this
                    task won't appear here until you switch to
                    it.
                  </p>
                )}
            </div>

            {/* Team Member */}
            <div>
              <select
                id="task-assignee"
                value={assigneeId}
                onChange={(e) =>
                  setAssigneeId(e.target.value)
                }
                className={inputClass(errors.assigneeId)}
              >
                <option value="" disabled>
                  Select Team Member (Optional)
                </option>

                {team?.map((m) => (
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
          </div>

          {/* Priority + Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className={inputClass(false)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className={inputClass(false)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-300 rounded-lg
              text-sm font-medium text-slate-700
              hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600
              hover:bg-blue-700 text-white
              text-sm font-medium rounded-lg
              transition"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
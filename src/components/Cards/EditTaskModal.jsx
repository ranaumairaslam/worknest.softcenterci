import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditTaskModal({ task, team = [], onClose, onSave }) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!task) return;

    setName(task.title ?? "");

    const normalizedPriority =
      task.priority
        ? String(task.priority).charAt(0).toUpperCase() +
          String(task.priority).slice(1).toLowerCase()
        : "Medium";

    setPriority(normalizedPriority);

    setStatus(task.status ?? "Pending");

    // API already gives assignee_id
    setAssigneeId(
      task.assignee_id !== undefined && task.assignee_id !== null
        ? String(task.assignee_id)
        : ""
    );

    // API gives ISO date
    setDueDate(
      task.due_date
        ? String(task.due_date).slice(0, 10)
        : ""
    );

    setErrors({});
  }, [task]);

  if (!task) return null;

  function validate() {
    const next = {};

    if (!name.trim()) {
      next.name = "Task name is required.";
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

    const payload = {
      title: name.trim(),
      priority: priority.toLowerCase(),
      status,
      assignee_id: Number(assigneeId),
      assignee_name: member?.name ?? task.assignee_name ?? "",
      due_date: dueDate || null,
    };

    onSave(task.id, payload);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Edit Task
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
            <label
              htmlFor="edit-name"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Task Name
            </label>

            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={
                errors.name
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />

            {errors.name && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label
              htmlFor="edit-assignee"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Assignee
            </label>

            <select
              id="edit-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={
                errors.assigneeId
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
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

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label
                htmlFor="edit-priority"
                className="text-xs font-medium text-slate-500 block mb-1"
              >
                Priority
              </label>

              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-status"
                className="text-xs font-medium text-slate-500 block mb-1"
              >
                Status
              </label>

              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

          </div>

          {/* Due Date */}
          <div>
            <label
              htmlFor="edit-due"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Due Date
            </label>

            <input
              id="edit-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
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
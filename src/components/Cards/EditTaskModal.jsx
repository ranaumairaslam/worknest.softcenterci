import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

// ✅ values match backend statuses, labels are what the user sees
const STATUS_OPTIONS = [
  { value: "todo", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "under_review", label: "Under Review" },
  { value: "done", label: "Completed" },
];

const inputClass = (hasError) =>
  hasError
    ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
    : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30";

export default function EditTaskModal({ task, team = [], onClose, onSave }) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("todo");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!task) return;

    setName(task.title ?? task.name ?? "");

    const p = String(task.priority || "medium").toLowerCase();
    setPriority(p.charAt(0).toUpperCase() + p.slice(1));

    setStatus(task.status ?? "todo");

    // ✅ accept camelCase (normalized) OR snake_case (raw API)
    const rawAssignee =
      task.assigneeId ?? task.assignee_id ?? task.assignee?.id ?? null;
    setAssigneeId(rawAssignee != null ? String(rawAssignee) : "");

    const rawDue = task.dueDate ?? task.due_date;
    setDueDate(rawDue && rawDue !== "TBD" ? String(rawDue).slice(0, 10) : "");

    setErrors({});
    setSubmitError(null);
  }, [task]);

  if (!task) return null;

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Task name is required.";
    if (!assigneeId) next.assigneeId = "Please select an assignee.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

 async function handleSubmit(e) {
  e.preventDefault();
  if (!validate()) return;

  const member = team.find((m) => String(m.id) === String(assigneeId));

  // ✅ Must match backend updateTask controller
  const payload = {
    taskName: name.trim(),                // was `title`
    assigneeName: member?.name || "",     // was `assigneeId`
    priority: priority.toLowerCase(),     // low/medium/high
    ...(dueDate ? { dueDate } : {}),
  };

  // If you want Status to persist, you must first add 
  // `status = $5` to backend SQL; until then omit it.
  // const payload = { ...payload, status };

  console.log("📤 REAL EDIT PAYLOAD:", task.id, payload);

  setSaving(true);
  setSubmitError(null);
  try {
    await onSave(task.id, payload); // ✅ wait for PUT
    onClose();                      // ✅ close only on success
  } catch (err) {
    setSubmitError(err?.message || "Failed to save task.");
  } finally {
    setSaving(false);
  }
}
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Edit Task</h2>
          <button
            type="button"
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
            <label htmlFor="edit-name" className="text-xs font-medium text-slate-500 block mb-1">
              Task Name
            </label>
            <input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(errors.name)}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Assignee */}
          <div>
            <label htmlFor="edit-assignee" className="text-xs font-medium text-slate-500 block mb-1">
              Assignee
            </label>
            <select
              id="edit-assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={inputClass(errors.assigneeId)}
            >
              <option value="" disabled>Select team member</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {errors.assigneeId && (
              <p className="text-xs text-rose-500 mt-1">{errors.assigneeId}</p>
            )}
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="edit-priority" className="text-xs font-medium text-slate-500 block mb-1">
                Priority
              </label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass(false)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="edit-status" className="text-xs font-medium text-slate-500 block mb-1">
                Status
              </label>
              <select
                id="edit-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass(false)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="edit-due" className="text-xs font-medium text-slate-500 block mb-1">
              Due Date
            </label>
            <input
              id="edit-due"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass(false)}
            />
          </div>

          {submitError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg mt-2 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
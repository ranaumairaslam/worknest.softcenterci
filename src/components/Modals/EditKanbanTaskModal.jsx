import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditKanbanTaskModal({
  task,
  teamMembers = [],
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!task) return;

    setTitle(task.title ?? task.name ?? "");

    // Support both raw API snake_case and UI camelCase fields.
    const currentAssigneeId =
      task.assignee_id ??
      task.assigneeId ??
      task.assignee?.id ??
      "";

    setAssigneeId(String(currentAssigneeId));

    setErrors({});
    setSaveError("");
  }, [task]);

  if (!task) return null;

  function validate() {
    const next = {};

    if (!title.trim()) {
      next.title = "Task title is required.";
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

    const selectedMember = teamMembers.find(
      (member) => String(member.id) === String(assigneeId)
    );

    if (!selectedMember) {
      setErrors({
        assigneeId: "Selected assignee was not found.",
      });
      return;
    }

    /*
      MUST match backend updateTask controller.

      Backend accepts:
        taskName
        assigneeName
        priority
        dueDate

      Backend currently DOES NOT save status.
    */
    const updates = {
      taskName: title.trim(),
      assigneeName: selectedMember.name,
    };

    console.log("📤 Saving task:", task.id, updates);

    try {
      setSaving(true);
      setSaveError("");

      await onSave(task.id, updates);

      // Close only when API/database save succeeds.
      onClose();
    } catch (error) {
      console.error("❌ Failed to save task:", error);

      setSaveError(
        error?.message || "Could not save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
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
            disabled={saving}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
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
          {/* Task title */}
          <div>
            <label
              htmlFor="edit-task-title"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Task Title
            </label>

            <input
              id="edit-task-title"
              type="text"
              value={title}
              disabled={saving}
              onChange={(e) => setTitle(e.target.value)}
              className={
                errors.title
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />

            {errors.title && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Assignee */}
          <div>
            <label
              htmlFor="edit-task-assignee"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Assignee
            </label>

            <select
              id="edit-task-assignee"
              value={assigneeId}
              disabled={saving}
              onChange={(e) => setAssigneeId(e.target.value)}
              className={
                errors.assigneeId
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            >
              <option value="" disabled>
                Select a team member
              </option>

              {teamMembers.map((member) => (
                <option
                  key={member.id}
                  value={String(member.id)}
                >
                  {member.name}
                </option>
              ))}
            </select>

            {errors.assigneeId && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.assigneeId}
              </p>
            )}
          </div>

          {saveError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {saveError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg mt-2"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
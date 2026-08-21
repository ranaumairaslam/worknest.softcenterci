import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createTask } from "../../services/taskService";

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
  const [projectId, setProjectId] = useState(
    currentProjectId || ""
  );
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SET CURRENT PROJECT
  // =====================================================
  useEffect(() => {
    if (currentProjectId) {
      setProjectId(currentProjectId);
    }
  }, [currentProjectId]);

  // =====================================================
  // RESET WHEN MODAL OPENS
  // =====================================================
  useEffect(() => {
    if (!open) return;

    setName("");
    setDescription("");
    setAssigneeId("");
    setPriority("Medium");
    setDueDate("");
    setError("");

    if (currentProjectId) {
      setProjectId(currentProjectId);
    }
  }, [open, currentProjectId]);

  if (!open) {
    return null;
  }

  // =====================================================
  // NORMALIZE TEAM MEMBERS
  // =====================================================
  const members = Array.isArray(team)
    ? team
        .map((member) => ({
          id: member.id,
          name:
            member.name ||
            member.full_name ||
            member.EmployeeName ||
            member.employee_name ||
            "Unknown Member",
        }))
        .filter((member) => member.id)
    : [];

  // =====================================================
  // SUBMIT
  // =====================================================
  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Task name is required.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    try {
      setSaving(true);

      const selectedMember = members.find(
        (member) =>
          String(member.id) ===
          String(assigneeId)
      );

      const payload = {
        name: name.trim(),
        description: description.trim(),
        projectId,
        priority,
        dueDate,

        assigneeId:
          selectedMember?.id || null,

        assignee:
          selectedMember?.name ||
          "Unassigned",
      };

      console.log(
        "📤 CREATING TASK:",
        payload
      );

      const savedTask =
        await createTask(payload);

      console.log(
        "✅ TASK CREATED:",
        savedTask
      );

      if (savedTask) {
        onCreate?.(savedTask);
      }

      onClose?.();

    } catch (err) {
      console.error(
        "❌ CREATE TASK ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to create task."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="flex items-center justify-between mb-5">

          <h2 className="text-xl font-semibold text-slate-800">
            Create Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* TASK NAME */}
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-2">
              Task Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter task name"
              className="w-full border border-slate-200 rounded-lg text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={4}
              placeholder="Enter task description"
              className="w-full border border-slate-200 rounded-lg text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* PROJECT */}
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-2">
              Project
            </label>

            <select
              value={projectId || ""}
              onChange={(e) =>
                setProjectId(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">
                Select project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* ASSIGNEE */}
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-2">
              Assignee
            </label>

            <select
              value={assigneeId}
              onChange={(e) =>
                setAssigneeId(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">
                Select team member
              </option>

              {members.length > 0 ? (
                members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>
                ))
              ) : (
                <option
                  value=""
                  disabled
                >
                  No team members available
                </option>
              )}
            </select>

            {/* DEBUG INFO */}
            {members.length === 0 && (
              <p className="text-xs text-rose-500 mt-1">
                No team members loaded.
              </p>
            )}
          </div>

          {/* PRIORITY */}
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-2">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>

          {/* DUE DATE */}
          <div>
            <label className="text-sm font-medium text-slate-500 block mb-2">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* CREATE BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            {saving
              ? "Creating..."
              : "Create Task"}
          </button>

        </form>
      </div>
    </div>
  );
}
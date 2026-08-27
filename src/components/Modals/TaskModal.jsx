import { useState, useEffect } from "react";

const STATUSES = ["Pending", "In Progress", "Under Review", "Completed", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];

function toDateInputValue(value) {
  if (!value || value === "TBD" || value === "Unassigned") return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) return String(value).slice(0, 10);
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function cleanLabel(value) {
  if (!value || value === "Unassigned" || value === "TBD") return "";
  return String(value);
}

export default function TaskModal({
  open,
  task,
  projects = [],
  teamMembers = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    name: "",
    description: "",
    project: "",
    projectId: null,
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    assignee: "",
    assigneeId: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (task) {
      const projectName = cleanLabel(task.project);
      const assigneeName = cleanLabel(task.assignee);

      const projectMatch =
        projects.find((p) => String(p.id) === String(task.projectId)) ||
        projects.find((p) => p.name === projectName);

      const memberMatch =
        teamMembers.find((m) => String(m.id) === String(task.assigneeId)) ||
        teamMembers.find((m) => m.name === assigneeName);

      setForm({
        name: task?.name || task?.title || "",
        description: task?.description || "",
        project: projectMatch?.name || projectName,
        projectId: projectMatch?.id ?? task?.projectId ?? null,
        priority: task?.priority || "Medium",
        status: task?.status || "Pending",
        dueDate: toDateInputValue(task?.dueDateRaw || task?.dueDate),
        assignee: memberMatch?.name || assigneeName,
        assigneeId: memberMatch?.id ?? task?.assigneeId ?? null,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [task, open, projects, teamMembers]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Task Name is required";
    }

    // resolve project id from name if needed
    const project =
      projects.find((p) => String(p.id) === String(form.projectId)) ||
      projects.find((p) => p.name === form.project);

    if (!form.project || !project?.id) {
      newErrors.project = "Please select a project";
    }

    return newErrors;
  };

  const handleProjectChange = (e) => {
    const projectName = e.target.value;
    const project = projects.find((p) => p.name === projectName);
    setForm((prev) => ({
      ...prev,
      project: projectName,
      projectId: project?.id || null,
    }));
    if (errors.project) setErrors((prev) => ({ ...prev, project: undefined }));
  };

  const handleAssigneeChange = (e) => {
    const assigneeName = e.target.value;
    const member = teamMembers.find((m) => m.name === assigneeName);
    setForm((prev) => ({
      ...prev,
      assignee: assigneeName,
      assigneeId: member?.id || null,
    }));
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const project =
      projects.find((p) => String(p.id) === String(form.projectId)) ||
      projects.find((p) => p.name === form.project);

    const member =
      teamMembers.find((m) => String(m.id) === String(form.assigneeId)) ||
      teamMembers.find((m) => m.name === form.assignee);

    const payload = {
      id: task?.id,
      name: form.name.trim(),
      title: form.name.trim(),
      description: form.description.trim(),
      project: project?.name || form.project || "",
      projectId: project?.id ?? form.projectId ?? null,
      priority: form.priority,
      status: form.status, // ✅ "In Progress" etc
      dueDate: form.dueDate || null,
      assignee: member?.name || form.assignee || "",
      assigneeId: member?.id ?? form.assigneeId ?? null,
    };

    console.log("📝 TaskModal submit payload:", payload);

    setSubmitting(true);
    try {
      await onSubmit?.(payload);
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            TaskName: "name",
            title: "name",
            description: "description",
            projectId: "project",
            priority: "priority",
            status: "status",
            dueDate: "dueDate",
            assigneeId: "assignee",
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || "Failed to save task");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border p-3 outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  const ErrorMessage = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {task ? "Update Task" : "Assign Task"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="col-span-2">
            <input
              className={inputClass("name")}
              placeholder="Task Name *"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          <div className="col-span-2">
            <textarea
              rows={4}
              className={inputClass("description")}
              placeholder="Task Description"
              value={form.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
            />
            <ErrorMessage field="description" />
          </div>

          <div>
            <select
              className={inputClass("project")}
              value={form.project}
              onChange={handleProjectChange}
            >
              <option value="">Select Project *</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <ErrorMessage field="project" />
          </div>

          <div>
            <select
              className={inputClass("assignee")}
              value={form.assignee}
              onChange={handleAssigneeChange}
            >
              <option value="">Select Team Member (Optional)</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
            <ErrorMessage field="assignee" />
          </div>

          <div>
            <select
              className={inputClass("priority")}
              value={form.priority}
              onChange={(e) => handleFieldChange("priority", e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ErrorMessage field="priority" />
          </div>

          <div>
            <input
              type="date"
              className={inputClass("dueDate")}
              value={form.dueDate}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
            />
            <ErrorMessage field="dueDate" />
          </div>

          {/* Status (create + update both) */}
          <div className="col-span-2">
            <select
              className={inputClass("status")}
              value={form.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ErrorMessage field="status" />
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            ⚠️ Please fix the errors above before submitting.
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border px-5 py-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Saving..." : task ? "Save Changes" : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

const STATUSES = ["Pending", "In Progress", "Under Review", "Completed", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];

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
    if (task) {
      setForm({
        name: task?.name || task?.title || "",
        description: task?.description || "",
        project: task?.project || "",
        projectId: task?.projectId || null,
        priority: task?.priority || "Medium",
        status: task?.status || "Pending",
        dueDate: task?.dueDate || "",
        assignee: task?.assignee || "",
        assigneeId: task?.assigneeId || null,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [task, open, projects]);

  if (!open) return null;

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Task Name is required";
    }
    if (!form.project || !form.projectId) {
      newErrors.project = "Please select a project";
    }

    return newErrors;
  };

  const handleProjectChange = (e) => {
    const projectName = e.target.value;
    const project = projects.find((p) => p.name === projectName);
    setForm({
      ...form,
      project: projectName,
      projectId: project?.id || null,
    });
    if (errors.project) {
      setErrors({ ...errors, project: undefined });
    }
  };

  const handleAssigneeChange = (e) => {
    const assigneeName = e.target.value;
    const member = teamMembers.find((m) => m.name === assigneeName);
    setForm({
      ...form,
      assignee: assigneeName,
      assigneeId: member?.id || null,
    });
  };

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      console.log("📤 Submitting task:", form);
      await onSubmit?.({ ...form, id: task?.id });
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            TaskName: 'name',
            title: 'name',
            description: 'description',
            projectId: 'project',
            priority: 'priority',
            status: 'status',
            dueDate: 'dueDate',
            assigneeId: 'assignee',
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save task');
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
          {/* Task Name */}
          <div className="col-span-2">
            <input
              className={inputClass("name")}
              placeholder="Task Name *"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          {/* Description */}
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

          {/* Project */}
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

          {/* Assignee */}
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

          {/* Priority */}
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

          {/* Due Date */}
          <div>
            <input
              type="date"
              className={inputClass("dueDate")}
              value={form.dueDate}
              onChange={(e) => handleFieldChange("dueDate", e.target.value)}
            />
            <ErrorMessage field="dueDate" />
          </div>

          {/* Status (only for updates) */}
          {task && (
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
          )}
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
            {submitting
              ? "Saving..."
              : task
              ? "Save Changes"
              : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
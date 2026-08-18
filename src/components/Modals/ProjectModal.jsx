import { useState, useEffect } from "react";

const STATUSES = ["Planning", "Active", "In Progress", "Review", "Completed"];
const PRIORITIES = ["High", "Medium", "Low", "Urgent"];

export default function ProjectModal({
  open,
  project,
  teams = [],
  employees = [],
  clients = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    name: "",
    description: "",
    leader: "",
    client: "",
    team: "",
    status: "Planning",
    priority: "Medium",
    dueDate: "",
    progress: 0,
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        description: project.description || "",
        leader: project.leader || "",
        client: project.client || "",
        team: project.team || "",
        status: project.status || "Planning",
        priority: project.priority || "Medium",
        dueDate: project.dueDate || "",
        progress: project.progress || 0,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [project, open]);

  if (!open) return null;

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Project Name is required";
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }
    // Only for CREATE, not for UPDATE
    if (!project) {
      if (!form.leader.trim()) {
        newErrors.leader = "Please select a Project Leader";
      }
      if (!form.team.trim()) {
        newErrors.team = "Please select a Team";
      }
      if (!form.client.trim()) {
        newErrors.client = "Please select a Client";
      }
      if (!form.dueDate) {
        newErrors.dueDate = "Due Date is required";
      }
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.({ ...form, id: project?.id });
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            projectName: 'name',
            description: 'description',
            TeamLeaderName: 'leader',
            ProjectTeam: 'team',
            ProjectStatus: 'status',
            ProjectPriority: 'priority',
            date: 'dueDate',
            clientName: 'client',
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save project');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const inputClass = (field) =>
    `w-full rounded-lg border p-3 outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-[#016472]"
    }`;

  const ErrorMessage = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project Name */}
          <div className="col-span-2">
            <input
              className={inputClass("name")}
              placeholder="Project Name *"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <textarea
              className={inputClass("description")}
              placeholder="Description *"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <ErrorMessage field="description" />
          </div>

          {/* Project Leader */}
          <div>
            <select
              className={inputClass("leader")}
              value={form.leader}
              onChange={(e) => handleChange("leader", e.target.value)}
            >
              <option value="">Select Project Leader *</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
            <ErrorMessage field="leader" />
          </div>

          {/* Team */}
          <div>
            <select
              className={inputClass("team")}
              value={form.team}
              onChange={(e) => handleChange("team", e.target.value)}
            >
              <option value="">Select Team *</option>
              {teams.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
            <ErrorMessage field="team" />
          </div>

          {/* Status */}
          <div>
            <select
              className={inputClass("status")}
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ErrorMessage field="status" />
          </div>

          {/* Priority */}
          <div>
            <select
              className={inputClass("priority")}
              value={form.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
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
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
            <ErrorMessage field="dueDate" />
          </div>

          {/* Client */}
          <div>
            <select
              className={inputClass("client")}
              value={form.client}
              onChange={(e) => handleChange("client", e.target.value)}
            >
              <option value="">Select Client *</option>
              {clients.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <ErrorMessage field="client" />
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
            className="rounded-lg bg-[#016472] px-5 py-2 text-white hover:bg-[#014b55] disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : project
              ? "Save Changes"
              : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
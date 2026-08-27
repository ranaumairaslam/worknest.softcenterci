import { useState, useEffect } from "react";

const STATUSES = ["Planning", "Active", "In Progress", "Review", "Completed"];
const PRIORITIES = ["High", "Medium", "Low", "Urgent"];

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
    leaderId: null,
    client: "",
    clientId: null,
    team: "",
    teamId: null,
    status: "Planning",
    priority: "Medium",
    dueDate: "",
    progress: 0,
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (project) {
      const leaderName = cleanLabel(project.leader);
      const teamName = cleanLabel(project.team);
      const clientName = cleanLabel(project.client);

      const leaderMatch =
        employees.find((e) => e.id === project.leaderId) ||
        employees.find((e) => e.name === leaderName);
      const teamMatch =
        teams.find((t) => t.id === project.teamId) ||
        teams.find((t) => t.name === teamName);
      const clientMatch =
        clients.find((c) => c.id === project.clientId) ||
        clients.find((c) => c.name === clientName);

      setForm({
        name: project.name || "",
        description: project.description || "",
        leader: leaderMatch?.name || leaderName,
        leaderId: leaderMatch?.id ?? project.leaderId ?? null,
        client: clientMatch?.name || clientName,
        clientId: clientMatch?.id ?? project.clientId ?? null,
        team: teamMatch?.name || teamName,
        teamId: teamMatch?.id ?? project.teamId ?? null,
        status: project.status || "Planning",
        priority: project.priority || "Medium",
        dueDate: toDateInputValue(project.dueDateRaw || project.dueDate),
        progress: Number(project.progress) || 0,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [project, open, teams, employees, clients]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Project Name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    if (!project) {
      if (!form.leader.trim()) newErrors.leader = "Please select a Project Leader";
      if (!form.team.trim()) newErrors.team = "Please select a Team";
      if (!form.client.trim()) newErrors.client = "Please select a Client";
      if (!form.dueDate) newErrors.dueDate = "Due Date is required";
    }

    if (form.progress < 0 || form.progress > 100) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const leaderMatch =
      employees.find((e) => String(e.id) === String(form.leaderId)) ||
      employees.find((e) => e.name === form.leader);
    const teamMatch =
      teams.find((t) => String(t.id) === String(form.teamId)) ||
      teams.find((t) => t.name === form.team);
    const clientMatch =
      clients.find((c) => String(c.id) === String(form.clientId)) ||
      clients.find((c) => c.name === form.client);

    const payload = {
      id: project?.id,
      name: form.name.trim(),
      description: form.description.trim(),
      leader: leaderMatch?.name || form.leader || "",
      leaderId: leaderMatch?.id ?? form.leaderId ?? null,
      team: teamMatch?.name || form.team || "",
      teamId: teamMatch?.id ?? form.teamId ?? null,
      client: clientMatch?.name || form.client || "",
      clientId: clientMatch?.id ?? form.clientId ?? null,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate,
      progress: Number(form.progress) || 0,
    };

    setSubmitting(true);
    try {
      await onSubmit?.(payload);
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            projectName: "name",
            description: "description",
            TeamLeaderName: "leader",
            ProjectTeam: "team",
            ProjectStatus: "status",
            ProjectPriority: "priority",
            date: "dueDate",
            clientName: "client",
            progress: "progress",
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || "Failed to save project");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLeaderChange = (name) => {
    const emp = employees.find((e) => e.name === name);
    setForm((prev) => ({ ...prev, leader: name, leaderId: emp?.id ?? null }));
    if (errors.leader) setErrors((prev) => ({ ...prev, leader: undefined }));
  };

  const handleTeamChange = (name) => {
    const t = teams.find((x) => x.name === name);
    setForm((prev) => ({ ...prev, team: name, teamId: t?.id ?? null }));
    if (errors.team) setErrors((prev) => ({ ...prev, team: undefined }));
  };

  const handleClientChange = (name) => {
    const c = clients.find((x) => x.name === name);
    setForm((prev) => ({ ...prev, client: name, clientId: c?.id ?? null }));
    if (errors.client) setErrors((prev) => ({ ...prev, client: undefined }));
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

          {/* Leader */}
          <div>
            <select
              className={inputClass("leader")}
              value={form.leader}
              onChange={(e) => handleLeaderChange(e.target.value)}
            >
              <option value="">Select Project Leader *</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
            <ErrorMessage field="leader" />
          </div>

          {/* Team */}
          <div>
            <select
              className={inputClass("team")}
              value={form.team}
              onChange={(e) => handleTeamChange(e.target.value)}
            >
              <option value="">Select Team *</option>
              {teams.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
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
                <option key={s} value={s}>
                  {s}
                </option>
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
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
            <ErrorMessage field="dueDate" />
          </div>

          {/* Client */}
          <div>
            <select
              className={inputClass("client")}
              value={form.client}
              onChange={(e) => handleClientChange(e.target.value)}
            >
              <option value="">Select Client *</option>
              {clients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <ErrorMessage field="client" />
          </div>

          {/* ✅ NEW: Progress (%) Input */}
          <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Project Progress (%)
              </label>
              <span className="text-sm font-bold text-[#016472]">
                {form.progress}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) => handleChange("progress", Number(e.target.value))}
                className="w-full accent-[#016472] cursor-pointer"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={form.progress}
                onChange={(e) =>
                  handleChange(
                    "progress",
                    Math.min(100, Math.max(0, Number(e.target.value)))
                  )
                }
                className="w-16 p-1 text-center border rounded-lg text-sm font-semibold outline-none focus:border-[#016472]"
              />
            </div>
            <ErrorMessage field="progress" />
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
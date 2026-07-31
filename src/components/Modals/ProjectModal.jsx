import { useState, useEffect } from "react";
import { useEmployees } from "../../hooks/useEmployees";

const STATUSES = ["Planning", "Active", "In Progress", "Review", "Completed"];
const PRIORITIES = ["High", "Medium", "Low"];

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
  team: teams[0]?.name || "",
  status: "Planning",
  priority: "Medium",
  dueDate: "",
  progress: 0,
};

  const [form, setForm] = useState(emptyForm);

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
  }, [project, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit?.({ ...form, id: project?.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Project Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
         <select
  className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#016472] focus:ring-2 focus:ring-[#016472]/20"
  value={form.leader}
  onChange={(e) => setForm({ ...form, leader: e.target.value })}
>
  <option value="">Select Project Leader</option>

  {employees.map((employee) => (
    <option
      key={employee.id}
      value={employee.name}
    >
      {employee.name}
    </option>
  ))}
</select>
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.team}
            onChange={(e) => setForm({ ...form, team: e.target.value })}
          >
            <option value="">Select Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
         <input
  type="date"
  className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-[#016472] focus:ring-2 focus:ring-[#016472]/20"
  value={form.dueDate}
  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
/>
       <select
  className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-[#016472] focus:ring-2 focus:ring-[#016472]/20"
  value={form.client}
  onChange={(e) => setForm({ ...form, client: e.target.value })}
>
  <option value="">Select Client</option>

  {clients.map((client) => (
    <option key={client.id} value={client.name}>
      {client.name}
    </option>
  ))}
</select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#016472] px-5 py-2 text-white hover:bg-[#014b55]"
          >
            {project ? "Save Changes" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

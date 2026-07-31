import { useState, useEffect } from "react";

export default function RevenueModal({ open, record, projects = [], clients = [], onClose, onSubmit }) {
  const emptyForm = {
    projectId: projects[0]?.id || "",
    projectName: projects[0]?.name || "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    status: "Pending",
    client: clients[0]?.name || "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (record) {
      setForm({
        projectId: record.projectId || "",
        projectName: record.projectName || "",
        amount: record.amount || "",
        date: record.date || "",
        status: record.status || "Pending",
        client: record.client || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [record, open]);

  if (!open) return null;

  const handleProjectChange = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    setForm({
      ...form,
      projectId,
      projectName: project?.name || "",
    });
  };

  const handleSubmit = () => {
    if (!form.projectName || !form.amount) return;
    onSubmit?.({ ...form, id: record?.id, amount: Number(form.amount) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {record ? "Update Revenue" : "Add Project Revenue"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.projectId}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input
            type="number"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Amount ($)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            type="date"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Pending</option>
            <option>Received</option>
          </select>
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700"
          >
            {record ? "Save Changes" : "Add Revenue"}
          </button>
        </div>
      </div>
    </div>
  );
}

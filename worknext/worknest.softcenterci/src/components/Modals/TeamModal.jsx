import { useState, useEffect } from "react";

export default function TeamModal({
  open,
  team,
  employees = [],
  onClose,
  onSubmit,
}) {const emptyForm = {
  name: "",
  description: "",
  status: "Active",
  projectLeader: "",
  members: [],
};
const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (team) {
  setForm({
    name: team.name || "",
    description: team.description || "",
    status: team.status || "Active",
    projectLeader: team.projectLeader || "",
    members: team.members || [],
  });
} else {
  setForm(emptyForm);
}
  }, [team, open]);

  if (!open) return null;

  const handleSubmit = () => {
  if (!form.name.trim()) return;

  onSubmit({
    ...form,
    id: team?.id,
  });
};
const filteredEmployees = employees.filter((employee) => {
  const isLeader = employee.id === form.projectLeader;

  const matchesSearch = employee.name
    .toLowerCase()
    .includes(search.toLowerCase());

  return !isLeader && matchesSearch;
});
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {team ? "Edit Team" : "Create Team"}
        </h2>

        <div className="grid gap-4">
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Team Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
         <div>
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Team Leader
  </label>

  <select
    className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
    value={form.projectLeader}
    onChange={(e) =>
      setForm({
        ...form,
        projectLeader: e.target.value,
        members: [],
      })
    }
  >
    <option value="">Select Team Leader</option>

    {employees.map((employee) => (
      <option
        key={employee.id}
        value={employee.id}
      >
        {employee.name}
      </option>
    ))}
  </select>
</div>
<div className="space-y-3">

  <label className="text-sm font-semibold text-slate-700">
    Team Members
  </label>

  <input
    type="text"
    placeholder="Search employee..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#016472] focus:ring-2 focus:ring-[#016472]/20"
  />

  <div className="h-44 overflow-y-auto rounded-xl border border-slate-200">

    {filteredEmployees.length === 0 ? (
      <div className="p-5 text-center text-sm text-slate-500">
        No employee found
      </div>
    ) : (
      filteredEmployees.map((employee) => (
        <label
          key={employee.id}
          className="flex cursor-pointer items-center justify-between border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 font-semibold text-cyan-700">
              {employee.name.charAt(0)}
            </div>

            <div>

              <p className="font-medium text-slate-800">
                {employee.name}
              </p>

              <p className="text-xs text-slate-500">
                {employee.role}
              </p>

            </div>

          </div>

          <input
            type="checkbox"
            checked={form.members.includes(employee.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setForm({
                  ...form,
                  members: [...form.members, employee.id],
                });
              } else {
                setForm({
                  ...form,
                  members: form.members.filter(
                    (id) => id !== employee.id
                  ),
                });
              }
            }}
          />

        </label>
      ))
    )}

  </div>

</div>{form.members.length > 0 && (
  <div className="space-y-2">

    <p className="text-sm font-semibold text-slate-700">
      Selected Members
    </p>

    <div className="flex flex-wrap gap-2">

      {form.members.map((id) => {
        const employee = employees.find(
          (emp) => emp.id === id
        );

        if (!employee) return null;

        return (
          <div
            key={id}
            className="flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700"
          >
            {employee.name}

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  members: form.members.filter(
                    (memberId) => memberId !== id
                  ),
                })
              }
            >
              ✕
            </button>

          </div>
        );
      })}

    </div>

  </div>
)}
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
          >
            {team ? "Save Changes" : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}

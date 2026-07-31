import { useState, useEffect } from "react";

export default function EmployeeModal({
  open,
  employee,
  teams = [],
  onClose,
  onSubmit,
}) {const initialForm = employee
  ? {
      name: employee.name,
      email: employee.email,
      password: "",
      role: employee.role,
      team: employee.team || "",
      status: employee.status,
      joinedAt: employee.joinedAt,
      phone: employee.phone,
    }
  : {
      name: "",
      email: "",
      password: "",
      role: "Team Member",
      team: "",
      status: "Active",
      joinedAt: "",
      phone: "",
    };
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialForm);
  }, [employee]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) return;

    onSubmit?.({
      ...form,
      id: employee?.id,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

        <select
  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
  value={form.role}
  onChange={(e) =>
    setForm({
      ...form,
      role: e.target.value,
    })
  }
>
  
  <option>Project Leader</option>
  <option>Team Member</option>
</select>
          <input
            type="email"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
<input
  type="password"
  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
  placeholder="Password"
  value={form.password}
  onChange={(e) =>
    setForm({
      ...form,
      password: e.target.value,
    })
  }
/><select
  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
  value={form.team}
  onChange={(e) =>
    setForm({
      ...form,
      team: e.target.value,
    })
  }
>
  <option value="">Select Team</option>

  {teams.map((team) => (
    <option
      key={team.id}
      value={team.name}
    >
      {team.name}
    </option>
  ))}
</select>

          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

         <input
  type="date"
  className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
  value={form.joinedAt}
  onChange={(e) =>
    setForm({
      ...form,
      joinedAt: e.target.value,
    })
  }
/>
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>On Leave</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            {employee ? "Save Changes" : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

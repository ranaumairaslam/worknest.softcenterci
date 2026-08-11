import { useState, useEffect } from "react";

export default function ClientModal({ open, client, onClose, onSubmit }) {
  const emptyForm = {
  name: "",
  email: "",
  password: "",
  address: "",
  status: "Active",
  industry: "",
  owner: "",
  size: "",
  revenue: "",
  location: "",
};

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (client) {
     setForm({
  name: client.name || "",
  email: client.email || "",
  password: "",
  address: client.address || "",
  status: client.status || "Active",
  industry: client.industry || "",
  owner: client.owner || "",
  size: client.size || "",
  revenue: client.revenue || "",
  location: client.location || "",
});
    } else {
      setForm(emptyForm);
    }
  }, [client, open]);

  if (!open) return null;

 const handleSubmit = () => {
  if (
    !form.name.trim() ||
    !form.email.trim() ||
    (!client && !form.password.trim())
  ) {
    return;
  }

  onSubmit?.({
    ...form,
    id: client?.id,
  });
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {client ? "Edit Client" : "Add Client"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Company Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Contact Email"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
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
/> <textarea
  rows={3}
  className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
  placeholder="Company Address"
  value={form.address}
  onChange={(e) =>
    setForm({
      ...form,
      address: e.target.value,
    })
  }
/>
          
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Industry"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Account Owner"
            value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Company Size"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Revenue"
            value={form.revenue}
            onChange={(e) => setForm({ ...form, revenue: e.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#016472] px-5 py-2 text-white hover:bg-[#014b55]"
          >
            {client ? "Save Changes" : "Add Client"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

export default function RevenueModal({
  open,
  revenue,
  projects = [],
  clients = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    project: "",
    client: "",
    amount: "",
    date: "",
    status: "Pending",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (revenue) {
      setForm({
        project: revenue.project === "Unassigned" ? "" : (revenue.project || ""),
        client: revenue.client === "Unknown" ? "" : (revenue.client || ""),
        amount: revenue.amount || "",
        date: revenue.date || "",
        status: revenue.status || "Pending",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [revenue, open]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.project) {
      newErrors.project = "Please select a project";
    }

    if (!form.client) {
      newErrors.client = "Please select a client";
    }

    if (!form.amount) {
      newErrors.amount = "Amount is required";
    } else {
      const cleaned = String(form.amount).replace(/[$,\s]/g, '');
      const num = Number(cleaned);
      if (isNaN(num)) {
        newErrors.amount = "Amount must be a valid number";
      } else if (num < 0) {
        newErrors.amount = "Amount cannot be negative";
      }
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
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
      console.log("📤 Submitting revenue:", form);
      await onSubmit?.({
        ...form,
        id: revenue?.id,
      });
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            ProjectName: 'project',
            ClientName: 'client',
            Amount: 'amount',
            Date: 'date',
            status: 'status',
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save revenue');
      }
    } finally {
      setSubmitting(false);
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
          {revenue ? "Edit Revenue" : "Add Revenue"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Project */}
          <div className="col-span-2">
            <select
              className={inputClass("project")}
              value={form.project}
              onChange={(e) => handleChange("project", e.target.value)}
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

          {/* Client */}
          <div className="col-span-2">
            <select
              className={inputClass("client")}
              value={form.client}
              onChange={(e) => handleChange("client", e.target.value)}
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

          {/* Amount */}
          <div>
            <input
              type="number"
              className={inputClass("amount")}
              placeholder="Amount * (e.g. 50000)"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
            <ErrorMessage field="amount" />
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              className={inputClass("date")}
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            <ErrorMessage field="date" />
          </div>

          {/* Status */}
          <div className="col-span-2">
            <select
              className={inputClass("status")}
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Complete">Complete</option>
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
            className="rounded-lg bg-[#016472] px-5 py-2 text-white hover:bg-[#014b55] disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : revenue
              ? "Save Changes"
              : "Add Revenue"}
          </button>
        </div>
      </div>
    </div>
  );
}
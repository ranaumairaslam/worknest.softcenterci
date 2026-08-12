import { useState, useEffect } from "react";

export default function EmployeeModal({
  open,
  employee,
  teams = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    name: "",
    email: "",
    password: "",
    role: "Team Member",
    team: "",
    status: "Active",
    joinedAt: "",
    phone: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || "",
        email: employee.email || "",
        password: "",
        role: employee.role || "Team Member",
        team: employee.team === "Unassigned" ? "" : (employee.team || ""),
        status: employee.status || "Active",
        joinedAt: employee.joinedAt || "",
        phone: employee.phone || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [employee, open]);

  if (!open) return null;

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password (only when creating new)
    if (!employee) {
      if (!form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password.trim().length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      // Team required for new employee
      if (!form.team.trim()) {
        newErrors.team = "Please select a team (required for new employee)";
      }
    }

    // Role
    if (!form.role.trim()) {
      newErrors.role = "Role is required";
    }

    return newErrors;
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
      await onSubmit?.({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role.trim(),
        team: form.team.trim(),
        id: employee?.id,
      });
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          beErrors[e.field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save employee');
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
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <input
              className={inputClass("name")}
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          {/* Role */}
          <div>
            <select
              className={inputClass("role")}
              value={form.role}
              onChange={(e) => handleFieldChange("role", e.target.value)}
            >
              <option>Team Leader</option>
              <option>Team Member</option>
            </select>
            <ErrorMessage field="role" />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              className={inputClass("email")}
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <ErrorMessage field="email" />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              className={inputClass("password")}
              placeholder={employee ? "Password (leave blank)" : "Password * (min 6 chars)"}
              value={form.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
            />
            <ErrorMessage field="password" />
          </div>

          {/* Team */}
          <div>
            <select
              className={inputClass("team")}
              value={form.team}
              onChange={(e) => handleFieldChange("team", e.target.value)}
            >
              <option value="">
                {employee ? "Select Team (Optional)" : "Select Team *"}
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <ErrorMessage field="team" />
          </div>

          {/* Phone */}
          <div>
            <input
              className={inputClass("phone")}
              placeholder="Phone (Optional)"
              value={form.phone}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
            />
            <ErrorMessage field="phone" />
          </div>

          {/* Joining Date */}
          <div>
            <input
              type="date"
              className={inputClass("joinedAt")}
              value={form.joinedAt}
              onChange={(e) => handleFieldChange("joinedAt", e.target.value)}
            />
            <ErrorMessage field="joinedAt" />
          </div>

          {/* Status */}
          <div>
            <select
              className={inputClass("status")}
              value={form.status}
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
            <ErrorMessage field="status" />
          </div>
        </div>

        {teams.length === 0 && !employee && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            ⚠️ No teams available. Please create a team first from Teams page.
          </div>
        )}

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
            disabled={submitting || (teams.length === 0 && !employee)}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : employee
              ? "Save Changes"
              : "Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
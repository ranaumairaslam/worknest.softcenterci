import { useState, useEffect } from "react";

export default function TeamModal({
  open,
  team,
  employees = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    name: "",
    description: "",
    status: "Active",
    leaderId: "",
    leaderName: "",
    memberNames: [],   // ✅ Now contains employee NAMES (not IDs)
  };

  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (team) {
      setForm({
        name: team.name || "",
        description: team.description || "",
        status: team.status || "Active",
        leaderId: team.leaderId || "",
        leaderName: team.projectLeader || "",
        memberNames: [],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setSearch("");
  }, [team, open]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Team Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Team Name must be at least 2 characters";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    }

    return newErrors;
  };

  const handleLeaderChange = (e) => {
    const empId = e.target.value;
    const employee = employees.find((emp) => String(emp.id) === String(empId));
    setForm({
      ...form,
      leaderId: empId,
      leaderName: employee?.name || "",
      // Remove leader from members if selected
      memberNames: form.memberNames.filter((name) => name !== employee?.name),
    });
    if (errors.leaderId) {
      setErrors({ ...errors, leaderId: undefined });
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
        id: team?.id,
      });
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            teamName: 'name',
            name: 'name',
            description: 'description',
            TeamLeaderName: 'leaderId',
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save team');
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
        : "border-gray-300 focus:ring-indigo-500"
    }`;

  const ErrorMessage = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  const filteredEmployees = employees.filter((employee) => {
    const isLeader = String(employee.id) === String(form.leaderId);
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
          {/* Team Name */}
          <div>
            <input
              className={inputClass("name")}
              placeholder="Team Name *"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          {/* Description */}
          <div>
            <textarea
              className={inputClass("description")}
              placeholder="Description *"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <ErrorMessage field="description" />
          </div>

          {/* Team Leader */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Team Leader (Optional)
            </label>
            <select
              className={inputClass("leaderId")}
              value={form.leaderId}
              onChange={handleLeaderChange}
            >
              <option value="">Select Team Leader</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
            <ErrorMessage field="leaderId" />
          </div>

          {/* Team Members */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700">
              Team Members (Optional)
            </label>
            <p className="text-xs text-slate-500">
              ℹ️ Selected members will be added to the team after creation.
            </p>

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
                      checked={form.memberNames.includes(employee.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({
                            ...form,
                            memberNames: [...form.memberNames, employee.name],
                          });
                        } else {
                          setForm({
                            ...form,
                            memberNames: form.memberNames.filter(
                              (name) => name !== employee.name
                            ),
                          });
                        }
                      }}
                    />
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Selected Members Chips */}
          {form.memberNames.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Selected Members ({form.memberNames.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {form.memberNames.map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-sm text-cyan-700"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          memberNames: form.memberNames.filter(
                            (n) => n !== name
                          ),
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
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
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting
              ? "Saving..."
              : team
              ? "Save Changes"
              : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}
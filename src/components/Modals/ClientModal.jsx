import { useState, useEffect } from "react";

export default function ClientModal({ open, client, onClose, onSubmit }) {
  const emptyForm = {
    name: "",
    contact: "",
    password: "",
    projectName: "",
    projectDescription: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || "",
        contact: client.contact || client.email || "",
        password: "",
        projectName: "",
        projectDescription: "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [client, open]);

  if (!open) return null;

  // ✅ VALIDATION
  const validate = () => {
    const newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Client Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email
    if (!form.contact.trim()) {
      newErrors.contact = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contact.trim())) {
        newErrors.contact = "Please enter a valid email address";
      }
    }

    // For create only
    if (!client) {
      if (!form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password.trim().length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!form.projectName.trim()) {
        newErrors.projectName = "Project Name is required";
      }
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
      console.log("📤 Submitting client:", form);
      await onSubmit?.({
        ...form,
        id: client?.id,
      });
    } catch (err) {
      alert(err.message || 'Failed to save client');
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
          {client ? "Edit Client" : "Add Client"}
        </h2>

        <div className="grid gap-4">
          {/* Client Name */}
          <div>
            <input
              className={inputClass("name")}
              placeholder="Client Name *"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              className={inputClass("contact")}
              placeholder="Email Address *"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />
            <ErrorMessage field="contact" />
          </div>

          {/* Password - only for create */}
          {!client && (
            <div>
              <input
                type="password"
                className={inputClass("password")}
                placeholder="Password * (min 6 characters)"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <ErrorMessage field="password" />
            </div>
          )}

          {/* Project Name - only for create */}
          {!client && (
            <>
              <div className="mt-2 border-t border-slate-200 pt-4">
                <p className="mb-2 text-sm font-semibold text-slate-700">
                  Initial Project
                </p>
                <p className="mb-3 text-xs text-slate-500">
                  Every new client needs an initial project.
                </p>
              </div>

              <div>
                <input
                  className={inputClass("projectName")}
                  placeholder="Project Name *"
                  value={form.projectName}
                  onChange={(e) => handleChange("projectName", e.target.value)}
                />
                <ErrorMessage field="projectName" />
              </div>

              <div>
                <textarea
                  rows={3}
                  className={inputClass("projectDescription")}
                  placeholder="Project Description (Optional)"
                  value={form.projectDescription}
                  onChange={(e) =>
                    handleChange("projectDescription", e.target.value)
                  }
                />
                <ErrorMessage field="projectDescription" />
              </div>
            </>
          )}
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
              : client
              ? "Save Changes"
              : "Add Client"}
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

export default function ClientModal({ open, client, onClose, onSubmit }) {
  const emptyForm = {
    name: "",
    contact: "",
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
  const [errors, setErrors] = useState({});   // ✅ Errors state
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name || "",
        contact: client.contact || client.email || "",
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
    setErrors({});   // Clear errors on open
  }, [client, open]);

  if (!open) return null;

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    const newErrors = {};

    // Company Name
    if (!form.name.trim()) {
      newErrors.name = "Company Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Company Name must be at least 2 characters";
    }

    // Contact Email
    if (!form.contact.trim()) {
      newErrors.contact = "Contact Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contact.trim())) {
        newErrors.contact = "Please enter a valid email address";
      }
    }

    // Password (only when creating new client)
    if (!client) {
      if (!form.password.trim()) {
        newErrors.password = "Password is required";
      } else if (form.password.trim().length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    // Address
    if (!form.address.trim()) {
      newErrors.address = "Company Address is required";
    }

    // Industry
    if (!form.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    // Owner
    if (!form.owner.trim()) {
      newErrors.owner = "Account Owner is required";
    }

    // Size
    if (!form.size.trim()) {
      newErrors.size = "Company Size is required";
    }

    // Revenue (must be a number)
    if (!form.revenue.toString().trim()) {
      newErrors.revenue = "Revenue is required";
    } else {
      const cleaned = String(form.revenue).replace(/[$,\s]/g, '');
      if (isNaN(Number(cleaned)) || Number(cleaned) < 0) {
        newErrors.revenue = "Revenue must be a valid number (e.g. 100000)";
      }
    }

    // Location
    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    // Agar errors hain toh submit mat karo
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit?.({
        ...form,
        id: client?.id,
      });
    } catch (err) {
      // Backend errors ko form errors mein daalein
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          // Map backend field names to frontend field names
          const fieldMap = {
            companyName: 'name',
            companyEmail: 'contact',
            AccountOwnerName: 'owner',
            companySize: 'size',
            revenu: 'revenue',
            address: 'address',
            location: 'location',
            password: 'password',
            industry: 'industry',
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save client');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handler to clear specific error on change
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  // ✅ Helper for input classes (adds red border if error)
  const inputClass = (field) =>
    `w-full rounded-lg border p-3 outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-[#016472]"
    }`;

  // ✅ Error message component
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

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Company Name */}
          <div className="col-span-2">
            <input
              className={inputClass("name")}
              placeholder="Company Name *"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <ErrorMessage field="name" />
          </div>

          {/* Contact Email */}
          <div>
            <input
              type="email"
              className={inputClass("contact")}
              placeholder="Contact Email *"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />
            <ErrorMessage field="contact" />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              className={inputClass("password")}
              placeholder={client ? "Password (leave blank)" : "Password * (min 6 chars)"}
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <ErrorMessage field="password" />
          </div>

          {/* Address */}
          <div className="col-span-2">
            <textarea
              rows={3}
              className={inputClass("address")}
              placeholder="Company Address *"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
            <ErrorMessage field="address" />
          </div>

          {/* Industry */}
          <div>
            <input
              className={inputClass("industry")}
              placeholder="Industry *"
              value={form.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
            />
            <ErrorMessage field="industry" />
          </div>

          {/* Owner */}
          <div>
            <input
              className={inputClass("owner")}
              placeholder="Account Owner *"
              value={form.owner}
              onChange={(e) => handleChange("owner", e.target.value)}
            />
            <ErrorMessage field="owner" />
          </div>

          {/* Size */}
          <div>
            <input
              className={inputClass("size")}
              placeholder="Company Size * (e.g. 10-50)"
              value={form.size}
              onChange={(e) => handleChange("size", e.target.value)}
            />
            <ErrorMessage field="size" />
          </div>

          {/* Revenue */}
          <div>
            <input
              type="number"
              className={inputClass("revenue")}
              placeholder="Revenue * (e.g. 100000)"
              value={form.revenue}
              onChange={(e) => handleChange("revenue", e.target.value)}
            />
            <ErrorMessage field="revenue" />
          </div>

          {/* Location */}
          <div className="col-span-2">
            <input
              className={inputClass("location")}
              placeholder="Location *"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <ErrorMessage field="location" />
          </div>
        </div>

        {/* Error Summary */}
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
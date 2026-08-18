import { useState, useEffect } from "react";

export default function MeetingModal({
  open,
  meeting,
  projects = [],
  teams = [],
  clients = [],
  leaders = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    title: "",
    project: "",
    date: "",
    time: "",
    platform: "Google Meet",
    meetingLink: "",
    type: "Team",
    meetingWith: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (meeting) {
      setForm({
        title: meeting.title || "",
        project: meeting.project === "Unassigned" ? "" : (meeting.project || ""),
        date: meeting.date || "",
        time: meeting.time || "",
        platform: meeting.platform || "Google Meet",
        meetingLink: meeting.meetingLink || "",
        type: meeting.type || "Team",
        meetingWith: meeting.meetingWith || "",
        description: meeting.description || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [meeting, open]);

  if (!open) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Meeting Title is required";
    }

    if (!form.type) {
      newErrors.type = "Meeting Type is required";
    }

    if (!form.project) {
      newErrors.project = "Please select a project";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    }

    if (!form.time) {
      newErrors.time = "Time is required";
    }

    if (!form.platform) {
      newErrors.platform = "Platform is required";
    }

    if (
      (form.platform === "Google Meet" || form.platform === "Zoom") &&
      !form.meetingLink.trim()
    ) {
      newErrors.meetingLink = "Meeting link is required for " + form.platform;
    }

    // ✅ UPDATED: Leaders now needs Project (not Team)
    if (!form.meetingWith && form.type !== "Leaders") {
      newErrors.meetingWith =
        form.type === "Client"
          ? "Please select a client"
          : "Please select a team";
    }

    return newErrors;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setForm({
      ...form,
      type: newType,
      // ✅ For Leaders type, auto-set meetingWith to project (since backend uses project's leader)
      meetingWith: newType === "Leaders" ? form.project : "",
    });
    if (errors.type || errors.meetingWith) {
      setErrors({ ...errors, type: undefined, meetingWith: undefined });
    }
  };

  // ✅ NEW: When project changes and type is Leaders, sync meetingWith
  const handleProjectChange = (e) => {
    const projectName = e.target.value;
    setForm({
      ...form,
      project: projectName,
      // If Leaders type, meetingWith should match project
      meetingWith: form.type === "Leaders" ? projectName : form.meetingWith,
    });
    if (errors.project) {
      setErrors({ ...errors, project: undefined });
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // ✅ For Leaders type, use project as meetingWith
    const submitData = { ...form };
    if (form.type === "Leaders") {
      submitData.meetingWith = form.project;
    }

    setSubmitting(true);
    try {
      console.log("📤 Submitting meeting:", submitData);
      await onSubmit?.({
        ...submitData,
        id: meeting?.id,
      });
    } catch (err) {
      if (err.backendErrors) {
        const beErrors = {};
        err.backendErrors.forEach((e) => {
          const fieldMap = {
            Title: 'title',
            toWhome: 'type',
            toWhom: 'type',
            ProjectName: 'project',
            date: 'date',
            time: 'time',
            MeetingSource: 'platform',
            MeetingLink: 'meetingLink',
            Teams: 'meetingWith',
            ClientName: 'meetingWith',
          };
          const field = fieldMap[e.field] || e.field;
          beErrors[field] = e.message;
        });
        setErrors(beErrors);
      } else {
        alert(err.message || 'Failed to save meeting');
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
          {meeting ? "Update Meeting" : "Schedule Meeting"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Title */}
          <div className="col-span-2">
            <input
              className={inputClass("title")}
              placeholder="Meeting Title *"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <ErrorMessage field="title" />
          </div>

          {/* Type */}
          <div>
            <select
              className={inputClass("type")}
              value={form.type}
              onChange={handleTypeChange}
            >
              <option value="Team">Team Meeting</option>
              <option value="Client">Client Meeting</option>
              <option value="Leaders">Leaders Meeting</option>
            </select>
            <ErrorMessage field="type" />
          </div>

          {/* Project */}
          <div>
            <select
              className={inputClass("project")}
              value={form.project}
              onChange={handleProjectChange}
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

          {/* Time */}
          <div>
            <input
              type="time"
              className={inputClass("time")}
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
            <ErrorMessage field="time" />
          </div>

          {/* Platform */}
          <div>
            <select
              className={inputClass("platform")}
              value={form.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
            >
              <option>Google Meet</option>
              <option>Zoom</option>
              <option>Microsoft Teams</option>
              <option>In Person</option>
            </select>
            <ErrorMessage field="platform" />
          </div>

          {/* Meeting Link */}
          <div>
            <input
              className={inputClass("meetingLink")}
              placeholder={
                form.platform === "Google Meet" || form.platform === "Zoom"
                  ? "Meeting Link *"
                  : "Meeting Link (Optional)"
              }
              value={form.meetingLink}
              onChange={(e) => handleChange("meetingLink", e.target.value)}
            />
            <ErrorMessage field="meetingLink" />
          </div>

          {/* Meeting With - Only for Team and Client (Leaders uses Project automatically) */}
          {form.type !== "Leaders" && (
            <div className="col-span-2">
              <select
                className={inputClass("meetingWith")}
                value={form.meetingWith}
                onChange={(e) => handleChange("meetingWith", e.target.value)}
              >
                {form.type === "Team" && (
                  <>
                    <option value="">Select Team *</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </>
                )}

                {form.type === "Client" && (
                  <>
                    <option value="">Select Client *</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <ErrorMessage field="meetingWith" />
            </div>
          )}

          {/* Info message for Leaders type */}
          {form.type === "Leaders" && (
            <div className="col-span-2">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
                ℹ️ The project's leader will be automatically invited based on the selected project above.
              </div>
            </div>
          )}

          {/* Description */}
          <div className="col-span-2">
            <textarea
              rows={3}
              className={inputClass("description")}
              placeholder="Description (Optional)"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
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
              : meeting
              ? "Save Changes"
              : "Schedule Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}
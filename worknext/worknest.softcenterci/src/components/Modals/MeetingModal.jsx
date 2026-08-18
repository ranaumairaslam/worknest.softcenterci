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
    project: projects[0]?.name || "",
    date: "",
    time: "",
    platform: "Google Meet",
    organizer: "Company Admin",
    meetingLink: "",
   type: "Team",
meetingWith: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (meeting) {
      setForm({
        title: meeting.title || "",
        project: meeting.project || "",
        date: meeting.date || "",
        time: meeting.time || "",
        platform: meeting.platform || "Google Meet",
        organizer: meeting.organizer || "",
        meetingLink: meeting.meetingLink || "",
        type: meeting.type || "Team",
        meetingWith: meeting.meetingWith || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [meeting, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit?.({
      ...form,
      id: meeting?.id,
      participants: form.participants
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {meeting ? "Update Meeting" : "Schedule Meeting"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Meeting Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
           <option value="Team">Team Meeting</option>
<option value="Client">Client Meeting</option>
<option value="Leaders">Leaders Meeting</option>
          </select>
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
          <input
            type="date"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Time (e.g. 2:00 PM)"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          >
            <option>Google Meet</option>
            <option>Microsoft Teams</option>
            <option>Zoom</option>
          </select>
          <input
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Meeting Link"
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
          />
        <select
  className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
  value={form.meetingWith}
  onChange={(e) =>
    setForm({
      ...form,
      meetingWith: e.target.value,
    })
  }
>

  {form.type === "Team" && (
    <>
      <option value="">Select Team</option>

      {teams.map((team) => (
        <option key={team.id} value={team.name}>
          {team.name}
        </option>
      ))}
    </>
  )}

  {form.type === "Client" && (
    <>
      <option value="">Select Client</option>

      {clients.map((client) => (
        <option key={client.id} value={client.name}>
          {client.name}
        </option>
      ))}
    </>
  )}

  {form.type === "Leaders" && (
    <>
      <option value="">Select Project Leader</option>

      {leaders.map((leader) => (
        <option key={leader.id} value={leader.name}>
          {leader.name}
        </option>
      ))}
    </>
  )}

</select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-5 py-2">Cancel</button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#016472] px-5 py-2 text-white hover:bg-[#014b55]"
          >
            {meeting ? "Save Changes" : "Schedule Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}

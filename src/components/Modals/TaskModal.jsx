import { useState, useEffect } from "react";

export default function TaskModal({
  open,
  task,
  projects = [],
  teamMembers = [],
  onClose,
  onSubmit,
}) {
  const emptyForm = {
    name: "",
    description: "",
    project: projects[0]?.name || "",
    projectId: projects[0]?.id || null,
    priority: "Medium",
    dueDate: "",
    assignee: "",
    assigneeId: null,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (task) {
      setForm({
        name: task?.name || "",
        description: task?.description || "",
        project: task?.project || "",
        projectId: task?.projectId || null,
        priority: task?.priority || "Medium",
        dueDate: task?.dueDate || "",
        assignee: task?.assignee || "",
        assigneeId: task?.assigneeId || null,
      });
    } else {
      setForm(emptyForm);
    }
  }, [task, open, projects]);

  if (!open) return null;

  const handleProjectChange = (e) => {
    const projectName = e.target.value;
    const project = projects.find((p) => p.name === projectName);
    setForm({
      ...form,
      project: projectName,
      projectId: project?.id || null,
    });
  };

  const handleAssigneeChange = (e) => {
    const assigneeName = e.target.value;
    const member = teamMembers.find((m) => m.name === assigneeName);
    setForm({
      ...form,
      assignee: assigneeName,
      assigneeId: member?.id || null,
    });
  };

  const handleSubmit = () => {
    // Validation
    if (!form.name.trim()) {
      alert("Please enter a task name");
      return;
    }
    if (!form.project || !form.projectId) {
      alert("Please select a project");
      return;
    }

    // ✅ Ab actually onSubmit call karo!
    console.log("📤 Submitting task:", form);
    onSubmit?.({ ...form, id: task?.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">
          {task ? "Update Task" : "Assign Task"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            rows={4}
            className="col-span-2 w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            placeholder="Task Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.project}
            onChange={handleProjectChange}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-[#016472]"
            value={form.assignee}
            onChange={handleAssigneeChange}
          >
            <option value="">Select Team Member (Optional)</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
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
            {task ? "Save Changes" : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
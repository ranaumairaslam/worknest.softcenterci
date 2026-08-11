import { useState } from "react";
import { X } from "lucide-react";

export default function NewTaskModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [project, setProject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !project.trim()) return;

    onCreate({
      name: name.trim(),
      project: project.trim(),
      priority,
      status: "To Do",
      dueDate: dueDate || null,
    });

    setName("");
    setProject("");
    setPriority("Medium");
    setDueDate("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Task Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fix login bug"
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Project</label>
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg mt-2"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
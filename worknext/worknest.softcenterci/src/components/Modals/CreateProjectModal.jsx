import { useState } from "react";
import { X } from "lucide-react";

export default function CreateProjectModal({ open, teamMembers, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [errors, setErrors] = useState({});

  if (!open) return null;

  function toggleMember(id) {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }

  function validate() {
    const next = {};
    if (!name.trim()) next.name = "Project name is required.";
    if (selectedMemberIds.length === 0) next.team = "Select at least one team member.";
    if (startDate && endDate && endDate < startDate) {
      next.endDate = "End date can't be before the start date.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    onCreate({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      teamMemberIds: selectedMemberIds,
    });

    setName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setSelectedMemberIds([]);
    setErrors({});
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Create Project</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="proj-name" className="text-xs font-medium text-slate-500 block mb-1">
              Project Name
            </label>
            <input
              id="proj-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Customer Portal Revamp"
              className={
                errors.name
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="proj-desc" className="text-xs font-medium text-slate-500 block mb-1">
              Description
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of the project"
              className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="proj-start" className="text-xs font-medium text-slate-500 block mb-1">
                Start Date
              </label>
              <input
                id="proj-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <div>
              <label htmlFor="proj-end" className="text-xs font-medium text-slate-500 block mb-1">
                End Date
              </label>
              <input
                id="proj-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={
                  errors.endDate
                    ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                }
              />
              {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <span className="text-xs font-medium text-slate-500 block mb-2">Assign Team Members</span>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-100 rounded-lg p-2">
              {teamMembers.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-2 text-sm text-slate-700 px-1 py-1 rounded-md hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedMemberIds.includes(m.id)}
                    onChange={() => toggleMember(m.id)}
                    className="rounded border-slate-300"
                  />
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
                    {m.avatar}
                  </span>
                  {m.name}
                </label>
              ))}
            </div>
            {errors.team && <p className="text-xs text-rose-500 mt-1">{errors.team}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
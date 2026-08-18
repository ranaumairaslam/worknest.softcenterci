import  { useState } from "react";
import { X } from "lucide-react";

export default function AssignTaskModal({ task, teamMembers, onClose, onAssign }) {
  const [memberId, setMemberId] = useState("");

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Reassign Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-500 mb-4">{task.title}</p>

        <label className="text-xs font-medium text-slate-500 block mb-2">
          Assign to
        </label>
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="" disabled>
            Select a team member
          </option>
          {teamMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button
          disabled={!memberId}
          onClick={() => {
            onAssign?.(task.id, memberId);
            onClose();
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium py-2 rounded-lg"
        >
          Assign
        </button>
      </div>
    </div>
  );
}
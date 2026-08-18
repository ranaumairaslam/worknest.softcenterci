import { X } from "lucide-react";

const presenceColor = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-300",
};

export default function TeamRosterModal({ open, team, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">Full Team Roster</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>
        <ul className="space-y-3">
          {team.map((m) => (
            <li key={m.id} className="flex items-center justify-between border-t border-slate-50 pt-3 first:border-t-0 first:pt-0">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
                    {m.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${presenceColor[m.presence]}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-400">{m.role}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{m.progress}% done</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
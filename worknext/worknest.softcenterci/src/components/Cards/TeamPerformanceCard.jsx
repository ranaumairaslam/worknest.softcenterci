

const presenceColor = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  offline: "bg-slate-300",
};

export default function TeamPerformanceCard({ member }) {
  return (
    <div className="border border-slate-100 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex items-center justify-center">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${presenceColor[member.presence]}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">{member.name}</p>
          <p className="text-xs text-slate-400 capitalize">{member.role} · {member.presence}</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-slate-500 mb-2">
        <span>{member.tasks} Tasks</span>
        <span>{member.done} Done</span>
        <span>{member.pending} Pending</span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${member.progress}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-1">{member.progress}%</p>
    </div>
  );
}
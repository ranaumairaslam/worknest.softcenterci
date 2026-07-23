import  { useState } from "react";
import { Search, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Pending: "bg-amber-50 text-amber-600",
};

const priorityStyles = {
  High: "text-rose-500",
  Medium: "text-amber-500",
  Low: "text-slate-400",
};

export default function TaskOverviewTable({ tasks, totalCount = 50 }) {
  const [search, setSearch] = useState("");
  const filtered = tasks.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <p className="text-sm font-medium text-slate-700">Task Overview</p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          {["Status", "Priority", "Assignee"].map((f) => (
            <button key={f} className="flex items-center gap-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-500">
              {f} <ChevronDown size={12} />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="pb-2 font-medium">ID</th>
              <th className="pb-2 font-medium">Task Name</th>
              <th className="pb-2 font-medium">Priority</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Assignee</th>
              <th className="pb-2 font-medium">Due Date</th>
              <th className="pb-2 font-medium">Progress</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-50">
                <td className="py-3 text-slate-400">{t.id}</td>
                <td className="py-3 text-slate-700 font-medium">{t.name}</td>
                <td className={`py-3 font-medium ${priorityStyles[t.priority]}`}>{t.priority}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
                    {t.assignee}
                  </div>
                </td>
                <td className="py-3 text-slate-500">{t.dueDate}</td>
                <td className="py-3">
                  <div className="flex items-center gap-2 w-28">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${t.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8">{t.progress}%</span>
                  </div>
                  <span className="text-xs text-slate-400">{t.category}</span>
                </td>
                <td className="py-3 text-right">
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <span>Showing 1 to {filtered.length} of {totalCount} results</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200"><ChevronLeft size={14} /></button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md bg-blue-600 text-white">1</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200">2</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200">3</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
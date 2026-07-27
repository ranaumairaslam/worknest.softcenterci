import { useState } from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const TABS = ["All Tasks", "To Do", "In Progress", "Completed", "Overdue"];

const priorityStyles = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const statusStyles = {
  "To Do": "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Overdue: "bg-rose-50 text-rose-600",
};

export default function MyTasksTable({ tasks }) {
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [checked, setChecked] = useState({});

  const filtered =
    activeTab === "All Tasks" ? tasks : tasks.filter((t) => t.status === activeTab);

  function toggleCheck(id) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-6 border-b border-slate-100 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm pb-3 -mb-px border-b-2 transition-colors ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600 font-medium"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="pb-2 font-medium w-8"></th>
              <th className="pb-2 font-medium">Task</th>
              <th className="pb-2 font-medium">Project</th>
              <th className="pb-2 font-medium">Priority</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Due Date</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-slate-50">
                <td className="py-3">
                  <input
                    type="checkbox"
                    checked={!!checked[t.id]}
                    onChange={() => toggleCheck(t.id)}
                    className="rounded border-slate-300"
                  />
                </td>
                <td className={`py-3 text-slate-700 font-medium ${checked[t.id] ? "line-through text-slate-400" : ""}`}>
                  {t.name}
                </td>
                <td className="py-3 text-slate-500">{t.project}</td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[t.priority]}`}>
                    {t.priority}
                  </span>
                </td>
                <td className="py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 text-slate-500">{t.dueDate}</td>
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
        <span>Showing 1 to {filtered.length} of 18 tasks</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200"><ChevronLeft size={14} /></button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md bg-indigo-600 text-white">1</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200">2</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200">3</button>
          <button className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200"><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}
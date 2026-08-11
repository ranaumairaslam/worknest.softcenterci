import { useState } from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const TABS = ["All Tasks", "To Do", "In Progress", "Completed", "Overdue"];
const PAGE_SIZE = 5;

const priorityStyles = {
  High: "bg-rose-50 text-rose-600",
  Medium: "bg-amber-50 text-amber-600",
  Low: "bg-emerald-50 text-emerald-600",
};

const statusStyles = {
  "To Do": "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
};

function isOverdue(task) {
  if (!task.dueDate || task.status === "Completed") return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function MyTasksTable({ tasks, onToggleComplete, onDelete }) {
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = tasks.filter((t) => {
    if (activeTab === "All Tasks") return true;
    if (activeTab === "Overdue") return isOverdue(t);
    return t.status === activeTab;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function selectTab(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-6 border-b border-slate-100 mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => selectTab(tab)}
            className={`text-sm pb-3 -mb-px border-b-2 whitespace-nowrap transition-colors ${
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
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400 text-sm">
                  No tasks here.
                </td>
              </tr>
            )}
            {pageItems.map((t) => {
              const overdue = isOverdue(t);
              return (
                <tr key={t.id} className="border-t border-slate-50">
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={t.status === "Completed"}
                      onChange={() => onToggleComplete(t.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className={`py-3 text-slate-700 font-medium ${t.status === "Completed" ? "line-through text-slate-400" : ""}`}>
                    {t.name}
                  </td>
                  <td className="py-3 text-slate-500">{t.project}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[t.priority]}`}>
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        overdue ? "bg-rose-50 text-rose-600" : statusStyles[t.status]
                      }`}
                    >
                      {overdue ? "Overdue" : t.status}
                    </span>
                  </td>
                  <td className={`py-3 ${overdue ? "text-rose-500 font-medium" : "text-slate-500"}`}>
                    {formatDate(t.dueDate)}
                  </td>
                  <td className="py-3 text-right relative">
                    <button
                      onClick={() => setOpenRowMenu(openRowMenu === t.id ? null : t.id)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openRowMenu === t.id && (
                      <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 text-left">
                        <button
                          onClick={() => {
                            onDelete(t.id);
                            setOpenRowMenu(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <span>
          Showing {pageItems.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} tasks
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                n === currentPage ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
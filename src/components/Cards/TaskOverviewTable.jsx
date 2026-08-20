import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

const statusStyles = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-blue-50 text-blue-600",
  Pending: "bg-amber-50 text-amber-600",
  "Under Review": "bg-purple-50 text-purple-600",
};

const priorityStyles = {
  high: "text-rose-500",
  medium: "text-amber-500",
  low: "text-slate-400",
  High: "text-rose-500",
  Medium: "text-amber-500",
  Low: "text-slate-400",
};

const PAGE_SIZE = 5;

function FilterDropdown({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-500"
      >
        {label}
        {value !== "All" && ` (${value})`}
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
          {["All", ...options].map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => onSelect(opt)}
              className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskOverviewTable({
  tasks = [],
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [page, setPage] = useState(1);

  // API uses assignee_name
  const assignees = [
    ...new Set(
      tasks
        .map((t) => t.assignee_name)
        .filter(Boolean)
    ),
  ];

  const filtered = tasks.filter((t) => {
    // API uses title
    const matchesSearch = (t.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      t.status === statusFilter;

    // API returns lowercase priority
    const taskPriority =
      t.priority?.toLowerCase() || "";

    const matchesPriority =
      priorityFilter === "All" ||
      taskPriority === priorityFilter.toLowerCase();

    // API uses assignee_name
    const matchesAssignee =
      assigneeFilter === "All" ||
      t.assignee_name === assigneeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesAssignee
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function toggleMenu(label) {
    setOpenMenu((prev) =>
      prev === label ? null : label
    );
  }

  function selectStatus(opt) {
    setStatusFilter(opt);
    setOpenMenu(null);
    setPage(1);
  }

  function selectPriority(opt) {
    setPriorityFilter(opt);
    setOpenMenu(null);
    setPage(1);
  }

  function selectAssignee(opt) {
    setAssigneeFilter(opt);
    setOpenMenu(null);
    setPage(1);
  }

  function formatPriority(priority) {
    if (!priority) return "-";

    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1).toLowerCase()
    );
  }

  function formatDueDate(date) {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <p className="text-sm font-medium text-slate-700">
          Task Overview
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks..."
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg w-40 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Status */}
          <FilterDropdown
            label="Status"
            value={statusFilter}
            options={[
              "Completed",
              "In Progress",
              "Pending",
              "Under Review",
            ]}
            isOpen={openMenu === "Status"}
            onToggle={() => toggleMenu("Status")}
            onSelect={selectStatus}
          />

          {/* Priority */}
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            options={["High", "Medium", "Low"]}
            isOpen={openMenu === "Priority"}
            onToggle={() => toggleMenu("Priority")}
            onSelect={selectPriority}
          />

          {/* Assignee */}
          <FilterDropdown
            label="Assignee"
            value={assigneeFilter}
            options={assignees}
            isOpen={openMenu === "Assignee"}
            onToggle={() => toggleMenu("Assignee")}
            onSelect={selectAssignee}
          />
        </div>
      </div>

      {/* Table */}
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
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-slate-400 text-sm"
                >
                  No tasks match these filters.
                </td>
              </tr>
            )}

            {pageItems.map((t) => {
              const priority =
                t.priority?.toLowerCase() || "";

              const progress = Number(t.progress) || 0;

              return (
                <tr
                  key={t.id}
                  className="border-t border-slate-50"
                >
                  {/* ID */}
                  <td className="py-3 text-slate-400">
                    {t.id}
                  </td>

                  {/* TASK NAME */}
                  <td className="py-3 text-slate-700 font-medium">
                    {t.title || "Untitled Task"}
                  </td>

                  {/* PRIORITY */}
                  <td
                    className={`py-3 font-medium ${
                      priorityStyles[priority] || "text-slate-500"
                    }`}
                  >
                    {formatPriority(t.priority)}
                  </td>

                  {/* STATUS */}
                  <td className="py-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        statusStyles[t.status] ||
                        "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {t.status || "Pending"}
                    </span>
                  </td>

                  {/* ASSIGNEE */}
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
                        {t.assignee_name
                          ? t.assignee_name
                              .charAt(0)
                              .toUpperCase()
                          : "?"}
                      </div>

                      <span className="text-xs text-slate-500">
                        {t.assignee_name || "Unassigned"}
                      </span>
                    </div>
                  </td>

                  {/* DUE DATE */}
                  <td className="py-3 text-slate-500">
                    {formatDueDate(t.due_date)}
                  </td>

                  {/* PROGRESS */}
                  <td className="py-3">
                    <div className="flex items-center gap-2 w-28">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>

                      <span className="text-xs text-slate-500 w-8">
                        {progress}%
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => onEdit?.(t)}
                        aria-label={`Edit ${
                          t.title || "task"
                        }`}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          const ok = window.confirm(
                            `Delete task "${
                              t.title || "Untitled Task"
                            }"? This can't be undone.`
                          );

                          if (ok) {
                            onDelete?.(t.id);
                          }
                        }}
                        aria-label={`Delete ${
                          t.title || "task"
                        }`}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
        <span>
          Showing{" "}
          {pageItems.length === 0
            ? 0
            : (currentPage - 1) * PAGE_SIZE + 1}{" "}
          to{" "}
          {Math.min(
            currentPage * PAGE_SIZE,
            filtered.length
          )}{" "}
          of {filtered.length} results
        </span>

        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            type="button"
            onClick={() =>
              setPage((p) => Math.max(1, p - 1))
            }
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Pages */}
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setPage(n)}
              className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                n === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200"
              }`}
            >
              {n}
            </button>
          ))}

          {/* Next */}
          <button
            type="button"
            onClick={() =>
              setPage((p) =>
                Math.min(totalPages, p + 1)
              )
            }
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
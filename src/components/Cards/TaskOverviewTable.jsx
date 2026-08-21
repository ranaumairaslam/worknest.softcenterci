import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";

const statusStyles = {
  Completed:
    "bg-emerald-50 text-emerald-600",

  "In Progress":
    "bg-blue-50 text-blue-600",

  Pending:
    "bg-amber-50 text-amber-600",

  "Under Review":
    "bg-purple-50 text-purple-600",

  Review:
    "bg-purple-50 text-purple-600",
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

        {value !== "All" &&
          ` (${value})`}

        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">

          {["All", ...options].map(
            (option) => (
              <button
                type="button"
                key={option}
                onClick={() =>
                  onSelect(option)
                }
                className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                {option}
              </button>
            )
          )}

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
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [assigneeFilter, setAssigneeFilter] =
    useState("All");

  const [openMenu, setOpenMenu] =
    useState(null);

  const [page, setPage] =
    useState(1);

  /*
   * Reset page when task data changes
   */
  useEffect(() => {
    setPage(1);
  }, [tasks]);

  /*
   * Get assignee names
   *
   * Supports:
   * assignee_name
   * assigneeName
   * assignee.name
   */
  const assignees = [
    ...new Set(
      tasks
        .map((task) => {
          return (
            task.assignee_name ||
            task.assigneeName ||
            task.assignee?.name
          );
        })
        .filter(Boolean)
    ),
  ];

  /*
   * Filter tasks
   */
  const filtered = tasks.filter(
    (task) => {
      const title =
        task.title ||
        task.name ||
        "";

      const assignee =
        task.assignee_name ||
        task.assigneeName ||
        task.assignee?.name ||
        "";

      const status =
        task.status || "Pending";

      const priority =
        task.priority || "";

      const matchesSearch =
        title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter === "All" ||
        status === statusFilter ||
        (
          statusFilter ===
            "Under Review" &&
          status === "Review"
        );

      const matchesPriority =
        priorityFilter === "All" ||
        priority.toLowerCase() ===
          priorityFilter.toLowerCase();

      const matchesAssignee =
        assigneeFilter === "All" ||
        assignee === assigneeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    }
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const pageItems =
    filtered.slice(
      (currentPage - 1) *
        PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  function toggleMenu(label) {
    setOpenMenu((previous) =>
      previous === label
        ? null
        : label
    );
  }

  function selectStatus(option) {
    setStatusFilter(option);
    setOpenMenu(null);
    setPage(1);
  }

  function selectPriority(option) {
    setPriorityFilter(option);
    setOpenMenu(null);
    setPage(1);
  }

  function selectAssignee(option) {
    setAssigneeFilter(option);
    setOpenMenu(null);
    setPage(1);
  }

  function formatPriority(priority) {
    if (!priority) {
      return "-";
    }

    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1).toLowerCase()
    );
  }

  function formatDueDate(date) {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
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
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
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
            isOpen={
              openMenu === "Status"
            }
            onToggle={() =>
              toggleMenu("Status")
            }
            onSelect={
              selectStatus
            }
          />

          {/* Priority */}
          <FilterDropdown
            label="Priority"
            value={priorityFilter}
            options={[
              "High",
              "Medium",
              "Low",
            ]}
            isOpen={
              openMenu === "Priority"
            }
            onToggle={() =>
              toggleMenu("Priority")
            }
            onSelect={
              selectPriority
            }
          />

          {/* Assignee */}
          <FilterDropdown
            label="Assignee"
            value={assigneeFilter}
            options={assignees}
            isOpen={
              openMenu === "Assignee"
            }
            onToggle={() =>
              toggleMenu("Assignee")
            }
            onSelect={
              selectAssignee
            }
          />

        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">

              <th className="pb-2 font-medium">
                ID
              </th>

              <th className="pb-2 font-medium">
                Task Name
              </th>

              <th className="pb-2 font-medium">
                Priority
              </th>

              <th className="pb-2 font-medium">
                Status
              </th>

              <th className="pb-2 font-medium">
                Assignee
              </th>

              <th className="pb-2 font-medium">
                Due Date
              </th>

              <th className="pb-2 font-medium">
                Progress
              </th>

              <th className="pb-2 font-medium">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {pageItems.length === 0 && (
              <tr key="empty">

                <td
                  colSpan={8}
                  className="py-10 text-center text-slate-400 text-sm"
                >
                  No tasks found for this project.
                </td>

              </tr>
            )}

            {pageItems.map((task) => {
              const priority =
                task.priority?.toLowerCase() ||
                "";

              const progress =
                Number(task.progress) || 0;

              const title =
                task.title ||
                task.name ||
                "Untitled Task";

              const assignee =
                task.assignee_name ||
                task.assigneeName ||
                task.assignee?.name ||
                "";

              return (
                <tr
                  key={task.id}
                  className="border-t border-slate-50"
                >

                  {/* ID */}
                  <td className="py-3 text-slate-400">
                    {task.id}
                  </td>

                  {/* NAME */}
                  <td className="py-3 text-slate-700 font-medium">
                    {title}
                  </td>

                  {/* PRIORITY */}
                  <td
                    className={`py-3 font-medium ${
                      priorityStyles[
                        priority
                      ] ||
                      "text-slate-500"
                    }`}
                  >
                    {formatPriority(
                      task.priority
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="py-3">

                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        statusStyles[
                          task.status
                        ] ||
                        "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {task.status ||
                        "Pending"}
                    </span>

                  </td>

                  {/* ASSIGNEE */}
                  <td className="py-3">

                    <div className="flex items-center gap-2">

                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">

                        {assignee
                          ? assignee
                              .charAt(0)
                              .toUpperCase()
                          : "?"}

                      </div>

                      <span className="text-xs text-slate-500">
                        {assignee ||
                          "Unassigned"}
                      </span>

                    </div>

                  </td>

                  {/* DUE DATE */}
                  <td className="py-3 text-slate-500">
                    {formatDueDate(
                      task.due_date ||
                        task.dueDate
                    )}
                  </td>

                  {/* PROGRESS */}
                  <td className="py-3">

                    <div className="flex items-center gap-2 w-28">

                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">

                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                progress
                              )
                            )}%`,
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

                      <button
                        type="button"
                        onClick={() =>
                          onEdit?.(task)
                        }
                        aria-label={`Edit ${
                          title
                        }`}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil
                          size={14}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const ok =
                            window.confirm(
                              `Delete task "${title}"? This can't be undone.`
                            );

                          if (ok) {
                            onDelete?.(
                              task.id
                            );
                          }
                        }}
                        aria-label={`Delete ${
                          title
                        }`}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2
                          size={14}
                        />
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
            : (currentPage - 1) *
                PAGE_SIZE +
              1}{" "}
          to{" "}
          {Math.min(
            currentPage *
              PAGE_SIZE,
            filtered.length
          )}{" "}
          of {filtered.length}{" "}
          results
        </span>

        <div className="flex items-center gap-1">

          <button
            type="button"
            onClick={() =>
              setPage((previous) =>
                Math.max(
                  1,
                  previous - 1
                )
              )
            }
            disabled={
              currentPage === 1
            }
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"
          >
            <ChevronLeft
              size={14}
            />
          </button>

          {Array.from(
            {
              length: totalPages,
            },
            (_, index) =>
              index + 1
          ).map((number) => (
            <button
              type="button"
              key={number}
              onClick={() =>
                setPage(number)
              }
              className={`w-7 h-7 flex items-center justify-center rounded-md border ${
                number === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-slate-200"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            type="button"
            onClick={() =>
              setPage((previous) =>
                Math.min(
                  totalPages,
                  previous + 1
                )
              )
            }
            disabled={
              currentPage === totalPages
            }
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 disabled:opacity-40"
          >
            <ChevronRight
              size={14}
            />
          </button>

        </div>

      </div>

    </div>
  );
}
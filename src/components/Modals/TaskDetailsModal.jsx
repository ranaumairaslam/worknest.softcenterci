import { X } from "lucide-react";

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Task Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">

          <div>
            <p className="text-xs font-medium text-slate-400">
              TASK TITLE
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-1">
              {task.title || "Untitled Task"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              DESCRIPTION
            </p>
            <p className="text-sm text-slate-600 mt-1">
              {task.description || "No description available."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-xs font-medium text-slate-400">
                STATUS
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {task.status || "Pending"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                ASSIGNED TO
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {task.assigneeName ||
                  task.assignee?.name ||
                  "Unassigned"}
              </p>
            </div>

          </div>

          {task.priority && (
            <div>
              <p className="text-xs font-medium text-slate-400">
                PRIORITY
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {task.priority}
              </p>
            </div>
          )}

          {task.dueDate && (
            <div>
              <p className="text-xs font-medium text-slate-400">
                DUE DATE
              </p>
              <p className="text-sm text-slate-700 mt-1">
                {task.dueDate}
              </p>
            </div>
          )}

        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 rounded-lg"
        >
          Close
        </button>

      </div>
    </div>
  );
}
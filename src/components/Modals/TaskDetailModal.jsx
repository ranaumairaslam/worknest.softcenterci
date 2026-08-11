// src/components/Modals/TaskDetailModal.jsx
import { useState } from "react";
import { X, Upload, Play } from "lucide-react";

export default function TaskDetailModal({ task, onClose, onSubmit, onStart }) {
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);

  if (!task) return null;

  // Status label + color mapping
  const statusMap = {
    todo: { label: "To Do", color: "bg-slate-100 text-slate-600" },
    in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-600" },
    under_review: { label: "Under Review", color: "bg-amber-100 text-amber-600" },
    completed: { label: "Completed", color: "bg-emerald-100 text-emerald-600" },
  };
  const statusInfo = statusMap[task.status] || statusMap.todo;

  const isTodo = task.status === "todo";
  const canSubmit = task.status === "in_progress";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-800">{task.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          {task.project && (
            <span className="ml-2 text-xs text-slate-500">• {task.project}</span>
          )}
        </div>

        {/* START TASK BUTTON — Only when status is "todo" */}
        {isTodo && (
          <button
            onClick={() => onStart?.(task.id)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition-colors text-white text-sm font-medium py-2.5 rounded-lg mb-4"
          >
            <Play size={16} />
            Start Task
          </button>
        )}

        {/* SUBMIT SECTION — Only when task is in_progress */}
        {canSubmit && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Upload Proof of Work</p>
              <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg px-3 py-3 text-sm text-slate-500 cursor-pointer hover:border-blue-400">
                <Upload size={16} />
                {file ? file.name : "Upload Proof of Work"}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <p className="text-xs text-slate-400 mt-1">Upload limit: 25MB</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Submission Comments</p>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                placeholder="Add any notes about this submission..."
              />
            </div>

            <button
              onClick={() =>
                onSubmit?.({
                  taskId: task.id,
                  comment: comments,
                  attachments: file ? [{ name: file.name, size: file.size }] : [],
                })
              }
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 rounded-lg"
            >
              Submit for Review
            </button>
          </div>
        )}

        {/* INFO MESSAGE — When task is already submitted/completed */}
        {!isTodo && !canSubmit && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-600">
              This task is <span className="font-medium">{statusInfo.label.toLowerCase()}</span>.
              No further action needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
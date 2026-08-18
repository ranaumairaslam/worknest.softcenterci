import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function TaskDetailModal({ task, onClose, onSubmit }) {
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">{task.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

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
            onClick={() => onSubmit?.({ taskId: task.id, file, comments })}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
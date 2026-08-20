import { useState } from "react";
import { X, Upload } from "lucide-react";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export default function TaskDetailModal({ task, onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  if (!task) return null;

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0] || null;

    setError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be 15MB or less.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  }

  async function handleSubmit() {
    setError("");

    if (!description.trim()) {
      setError("Submission description is required.");
      return;
    }

    try {
      await onSubmit?.({
        taskId: task.id,
        file,
        description: description.trim(),
      });
    } catch (err) {
      setError(err?.message || "Failed to submit task.");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-slate-800">
            {task.title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">

          {/* Upload */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              Upload Proof of Work
            </p>

            <label className="flex items-center gap-2 border border-dashed border-slate-300 rounded-lg px-3 py-3 text-sm text-slate-500 cursor-pointer hover:border-blue-400">
              <Upload size={16} />

              <span className="truncate">
                {file ? file.name : "Upload Proof of Work"}
              </span>

              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileChange}
              />
            </label>

            <p className="text-xs text-slate-400 mt-1">
              Image, PDF, DOC, DOCX, XLS, XLSX, PPT or PPTX — Max 15MB
            </p>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              Submission Description
            </p>

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              rows={4}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Describe your completed work..."
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function TaskDetailModal({ task, onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!task) return null;

  const handleSubmit = async () => {
    setError("");

    // File required
    if (!file) {
      setError("Please upload a proof of work file.");
      return;
    }

    // Description required
    if (!description.trim()) {
      setError("Please enter a submission description.");
      return;
    }

    // 15 MB limit
    if (file.size > 15 * 1024 * 1024) {
      setError("File size must be less than 15MB.");
      return;
    }

    try {
      setSubmitting(true);

      console.log("📤 Submitting from modal:", {
        taskId: task.id,
        description,
        file: file.name,
      });

      await onSubmit?.({
        taskId: task.id,
        file,
        description: description.trim(),
      });

      // Clear only after successful submission
      setDescription("");
      setFile(null);
      onClose();
    } catch (err) {
      console.error("❌ Submission failed:", err);
      setError(err?.message || "Failed to submit task.");
    } finally {
      setSubmitting(false);
    }
  };

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
            disabled={submitting}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">

          {/* File */}
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
                accept="
                  image/*,
                  application/pdf,
                  .doc,
                  .docx,
                  .xls,
                  .xlsx,
                  .ppt,
                  .pptx
                "
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null;
                  setFile(selectedFile);
                  setError("");
                }}
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
                setError("");
              }}
              rows={5}
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Describe your completed work..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-white text-sm font-medium py-3 rounded-lg"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
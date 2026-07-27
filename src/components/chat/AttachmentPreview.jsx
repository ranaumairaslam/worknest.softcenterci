import { FileText, X } from "lucide-react";

export default function AttachmentPreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="mb-3 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-3">
        <FileText className="text-[#016472]" />

        <div>
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-slate-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>

      <button onClick={onRemove}>
        <X size={18} />
      </button>
    </div>
  );
}
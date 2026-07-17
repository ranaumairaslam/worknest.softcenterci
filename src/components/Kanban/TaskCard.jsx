import React from "react";
import { FileText } from "lucide-react";

export default function TaskCard({ task, onClick }) {
  return (
    <button
      onClick={() => onClick?.(task)}
      className="w-full text-left bg-white rounded-xl border border-slate-100 shadow-sm p-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2 mb-3">
        <FileText size={14} className="text-slate-400 mt-0.5 shrink-0" />
        <p className="text-sm font-medium text-slate-700 leading-snug">{task.title}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-medium flex items-center justify-center">
          {task.assignee.avatar}
        </div>
        <span className="text-xs text-slate-500">{task.assignee.name}</span>
      </div>
    </button>
  );
}
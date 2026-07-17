import React from "react";

export default function ProgressBar({ value }) {
  return (
    <div className="flex items-center gap-2 w-40">
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-9">{value}%</span>
    </div>
  );
}
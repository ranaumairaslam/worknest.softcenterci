import React from "react";
import { Check } from "lucide-react";

export default function ProjectTimeline({ steps = [] }) {
  // ✅ Ensure steps is always an array to prevent crashes
  const safeSteps = Array.isArray(steps) ? steps : [];
  const current = safeSteps.find((s) => s?.state === "current");

  if (safeSteps.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-sm font-medium text-slate-700 mb-2">Project Timeline</p>
        <p className="text-xs text-slate-400">No timeline data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-medium text-slate-700 mb-6">Project Timeline</p>
      <div className="flex items-center justify-between mb-2">
        {safeSteps.map((step, i) => (
          <React.Fragment key={step.id || i}>
            <div className="flex flex-col items-center text-center w-20">
              <p className="text-xs text-slate-500 mb-1">{step.label}</p>
              <p className="text-xs text-slate-400 mb-2">{step.date}</p>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs
                  ${step.state === "done" ? "bg-emerald-500" : ""}
                  ${step.state === "current" ? "bg-blue-600 ring-4 ring-blue-100" : ""}
                  ${step.state === "upcoming" ? "bg-slate-200" : ""}`}
              >
                {step.state === "done" && <Check size={12} />}
              </div>
            </div>
            {i < safeSteps.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-100 -mt-6" />
            )}
          </React.Fragment>
        ))}
      </div>

      {current && (
        <div className="mt-4 bg-blue-50 text-center rounded-lg py-3">
          <p className="text-sm font-semibold text-blue-700">You are here</p>
          <p className="text-xs text-blue-500">
            {current.label} phase is in progress
          </p>
        </div>
      )}
    </div>
  );
}
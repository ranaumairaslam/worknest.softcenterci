import React from "react";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

export default function ProgressTable({ title, rows }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-medium text-slate-700 mb-4">{title}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Project Name</th>
              <th className="pb-3 font-medium">Assigned Team</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-t border-slate-50">
                <td className="py-3 text-slate-700 font-medium">{r.name}</td>
                <td className="py-3 text-slate-500">{r.team}</td>
                <td className="py-3"><StatusBadge status={r.status} /></td>
                <td className="py-3"><ProgressBar value={r.progress} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
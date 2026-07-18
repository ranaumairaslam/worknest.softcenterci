import React from "react";

export default function StatCard({ label, value, note, icon, iconBg }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-3xl font-semibold text-slate-800 mt-1">{value}</p>
        <p className="text-xs text-emerald-500 font-medium mt-1">{note}</p>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}
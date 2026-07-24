import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function ClientStatsCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
     
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 transition-transform duration-300 group-hover:scale-125" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {value}
          </h2>

          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} />
            <span>Updated today</span>
          </div>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md ${color}`}
        >
          {Icon && <Icon size={28} strokeWidth={2.2} />}
        </div>
      </div>
    </div>
  );
}
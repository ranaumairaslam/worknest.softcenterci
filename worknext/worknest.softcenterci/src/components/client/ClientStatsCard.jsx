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
        <div className="flex flex-col">
         
          <p className="min-h-[44px] max-w-[120px] text-sm font-medium leading-7 text-slate-500">
            {title}
          </p>

      
          <h2 className="mt-1 text-3xl font-bold text-slate-800">
            {value}
          </h2>

         
          <div className="mt-8 flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <ArrowUpRight size={14} />
            <span>Updated today</span>
          </div>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md ${color}`}
        >
          {Icon && <Icon size={20} strokeWidth={2.2} />}
        </div>
      </div>
    </div>
  );
}
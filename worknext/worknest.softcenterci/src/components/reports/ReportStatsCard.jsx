import react from "react";




export default function ReportStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}) {
  return (
    <div className="group rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>

          <p className="mt-2 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
}
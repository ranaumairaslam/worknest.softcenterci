import React from "react";
import * as Icons from "lucide-react";

const colorMap = {
  slate: "bg-slate-50 text-slate-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
  indigo: "bg-indigo-50 text-indigo-600",
  cyan: "bg-cyan-50 text-cyan-600",
  orange: "bg-orange-50 text-orange-600",
};

export default function StatCardTrend({ label, value, trend, trendValue, icon, color = "slate" }) {
  const Icon = Icons[icon] || Icons.Circle;
  const TrendIcon = trend === "up" ? Icons.ArrowUp : Icons.ArrowDown;
  const trendColor = trend === "up" ? "text-emerald-500" : "text-rose-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-800 mt-1">{value}</p>
      <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${trendColor}`}>
        <TrendIcon size={12} /> {trendValue} from last week
      </p>
    </div>
  );
}
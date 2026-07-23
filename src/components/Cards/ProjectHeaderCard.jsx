
import { Star, Filter, Download, Plus } from "lucide-react";

export default function ProjectHeaderCard({ summary }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-[220px]">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-800">{summary.name}</h2>
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {summary.status}
          </span>
          <Star size={14} className="text-amber-400 fill-amber-400" />
        </div>
        <p className="text-sm text-slate-500 mt-1 max-w-md">{summary.description}</p>
      </div>

      <div className="min-w-[180px]">
        <p className="text-xs text-slate-500 mb-1">Overall Progress</p>
        <p className="text-xl font-semibold text-slate-800">{summary.progress}%</p>
        <div className="w-40 h-2 rounded-full bg-slate-100 overflow-hidden mt-1">
          <div className="h-full rounded-full bg-blue-600" style={{ width: `${summary.progress}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {summary.tasksCompleted} of {summary.tasksTotal} tasks completed
        </p>
      </div>

      <div className="flex gap-6 text-sm">
        <div>
          <p className="text-xs text-slate-400">Start Date</p>
          <p className="text-slate-700 font-medium">{summary.startDate}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">End Date</p>
          <p className="text-slate-700 font-medium">{summary.endDate}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Days Remaining</p>
          <p className="text-emerald-600 font-medium">{summary.daysRemaining} Days</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-50">
          <Filter size={14} /> Filter
        </button>
        <button className="flex items-center gap-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-50">
          <Download size={14} /> Export
        </button>
        <button className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5">
          <Plus size={14} /> Create Task
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Star, Filter,  Plus, Check } from "lucide-react";
import ProjectSearchSelect from "./ProjectSearchSelect";

const FILTERS = ["All", "High", "Medium", "Low"];

export default function ProjectHeaderCard({ summary, projects, onProjectChange, onFilterChange,  onCreateTask }) {
  const [favorited, setFavorited] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  function selectFilter(f) {
    setActiveFilter(f);
    setFilterOpen(false);
    onFilterChange?.(f);
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
<div className="min-w-[220px]">
  <div className="flex items-center gap-2 flex-wrap">
    {projects && projects.length > 0 ? (
      <ProjectSearchSelect
        projects={projects}
        selectedId={summary.id}
        onSelect={onProjectChange}
      />
    ) : (
      <h2 className="text-lg font-semibold text-slate-800">{summary.name}</h2>
    )}
          <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {summary.status}
          </span>
          <button onClick={() => setFavorited((f) => !f)} aria-label="Toggle favorite">
            <Star
              size={14}
              className={favorited ? "text-amber-400 fill-amber-400" : "text-slate-300"}
            />
          </button>
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
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-50"
          >
            <Filter size={14} /> Filter {activeFilter !== "All" && `(${activeFilter})`}
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => selectFilter(f)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  {f}
                  {activeFilter === f && <Check size={14} className="text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        

        <button
          onClick={onCreateTask}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5"
        >
          <Plus size={14} /> Create Task
        </button>
      </div>
    </div>
  );
}
import {
  CalendarDays,
  UserRound,
  ArrowRight,
} from "lucide-react";

export default function ProjectProgressCard({ project }) {
  const getProgressColor = (progress) => {
    if (progress >= 75) return "bg-emerald-500";
    if (progress >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Planning":
        return "bg-amber-100 text-amber-700";
      case "Completed":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
     
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {project.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {project.description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Progress
          </span>

          <span className="font-bold text-slate-700">
            {project.progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
              project.progress
            )}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

     
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <UserRound size={18} className="text-cyan-600" />

          <div>
            <p className="text-xs text-slate-500">
              Project Leader
            </p>

            <p className="font-semibold text-slate-700">
              {project.leader}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays size={18} className="text-cyan-600" />

          <div>
            <p className="text-xs text-slate-500">
              Deadline
            </p>

            <p className="font-semibold text-slate-700">
              {project.deadline}
            </p>
          </div>
        </div>
      </div>

     
      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#016472] px-4 py-3 font-semibold text-white transition hover:bg-[#014b55]">
        View Details
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
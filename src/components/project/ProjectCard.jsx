import {
  Users,
  CalendarDays,
  Eye,
  FolderKanban,
  ArrowUpRight,
} from "lucide-react";

export default function ProjectCard({ project, onSelect }) {
  const statusStyles = {
    Active: {
      badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
    },
    Planning: {
      badge: "bg-sky-50 text-sky-700 border border-sky-200",
      dot: "bg-sky-500",
    },
    Review: {
      badge: "bg-amber-50 text-amber-700 border border-amber-200",
      dot: "bg-amber-500",
    },
    Completed: {
      badge: "bg-green-50 text-green-700 border border-green-200",
      dot: "bg-green-500",
    },
    "In Progress": {
      badge: "bg-orange-50 text-orange-700 border border-orange-200",
      dot: "bg-orange-500",
    },
  };

  const progressColor =
    project.progress >= 80
      ? "bg-emerald-500"
      : project.progress >= 50
      ? "bg-cyan-500"
      : "bg-orange-500";

  return (
   <div className="group flex h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300 hover:shadow-2xl">

      {/* Header */}

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <FolderKanban size={22} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Project
            </p>

          <h2 className="mt-1 h-14 overflow-hidden text-xl font-bold leading-7 text-slate-800 transition-colors group-hover:text-cyan-700 line-clamp-2">
              {project.name}
            </h2>
          </div>

        </div>

       
      </div>

      {/* Description */}

   <p className="mt-5 h-[78px] overflow-hidden text-sm leading-6 text-slate-500 line-clamp-3">
        {project.description}
      </p>

      {/* Progress */}

      <div className="mt-6">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-sm font-medium text-slate-600">
            Progress
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {project.progress}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

          <div
            className={`${progressColor} h-full rounded-full transition-all duration-700`}
            style={{
              width: `${project.progress}%`,
            }}
          />

        </div>

      </div>

      {/* Information */}

      <div className="mt-7 space-y-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Users size={18} />
          </div>

          <div>
            <p className="text-xs text-slate-400">Team</p>
            <p className="font-semibold text-slate-700">
              {project.team}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <CalendarDays size={18} />
          </div>

          <div>
            <p className="text-xs text-slate-400">Due Date</p>
            <p className="font-semibold text-slate-700">
              {project.dueDate}
            </p>
          </div>

        </div>

      </div>

      {/* Button */}

      <button
        onClick={() => onSelect(project)}
        className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#016472] to-[#028090] py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-200"
      >
        <Eye size={18} />

        View Project

        <ArrowUpRight
          size={18}
          className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </button>
    </div>
  );
}
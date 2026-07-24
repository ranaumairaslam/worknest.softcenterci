import {
  Users,
  CalendarDays,
  Eye,
} from "lucide-react";

export default function ProjectCard({
  project,
  onSelect,
}) {
  const statusColor = {
    Active: "bg-green-100 text-green-700",
    Planning: "bg-blue-100 text-blue-700",
    Review: "bg-yellow-100 text-yellow-700",
    Completed: "bg-emerald-100 text-emerald-700",
    "In Progress": "bg-orange-100 text-orange-700",
  };

  return (
    <div className="group rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

     <div className="flex justify-between">
  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
    Project
  </span>


  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
      statusColor[project.status]
    }`}
  >
    Status: {project.status}
  </span>

</div>

      <h2 className="mt-5 text-xl font-bold">
        {project.name}
      </h2>

      <p className="mt-2 text-sm text-gray-500 line-clamp-3">
        {project.description}
      </p>

      <div className="mt-5 space-y-2">

        <div className="flex justify-between text-sm">

          <span>Progress</span>

          <span>{project.progress}%</span>

        </div>

        <div className="h-2 rounded-full bg-gray-200">

          <div
            className={`${project.color} h-2 rounded-full`}
            style={{
              width: `${project.progress}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-5 space-y-3 text-sm">

        <div className="flex items-center gap-2">

          <Users size={18} />

          {project.team}

        </div>

        <div className="flex items-center gap-2">

          <CalendarDays size={18} />

          {project.dueDate}

        </div>

      </div>

      <button
        onClick={() => onSelect(project)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#016472] py-3 font-semibold text-white transition hover:bg-[#024d58]"
      >
        <Eye size={18} />
        View Details
      </button>
    </div>
  );
}
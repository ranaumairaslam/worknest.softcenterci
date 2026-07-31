import { X, CheckCircle2, UserRound, Users, CalendarDays } from "lucide-react";

export default function ProjectDetailsModal({
  open,
  project,
  onClose,
  onComplete,
  onAssignLeader,
  onDelete,
  isAdmin = false,
}) {
  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Project Details</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{project.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-slate-600">{project.description}</p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <UserRound className="text-[#016472]" size={18} />
            <div>
              <p className="text-xs text-slate-400">Project Leader</p>
              <p className="font-medium text-slate-800">{project.leader}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="text-[#016472]" size={18} />
            <div>
              <p className="text-xs text-slate-400">Team</p>
              <p className="font-medium text-slate-800">{project.team}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#016472]" size={18} />
            <div>
              <p className="text-xs text-slate-400">Due Date</p>
              <p className="font-medium text-slate-800">{project.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div
              className={`${project.color || "bg-cyan-500"} h-2 rounded-full`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {project.status}
          </span>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {project.priority} Priority
          </span>
        </div>

        {isAdmin && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.status !== "Completed" && (
              <button
                onClick={() => onComplete?.(project)}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                <CheckCircle2 size={16} />
                Mark Completed
              </button>
            )}
            <button
              onClick={() => {
                const leader = prompt("Enter project leader name:", project.leader);
                if (leader) onAssignLeader?.(project, leader);
              }}
              className="rounded-lg border border-[#016472] px-4 py-2 text-sm font-medium text-[#016472] hover:bg-[#016472]/5"
            >
              Assign Leader
            </button>
            <button
              onClick={() => onDelete?.(project)}
              className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
            >
              Delete Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

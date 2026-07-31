import { X, CalendarDays, UserRound } from "lucide-react";

export default function ProjectDetailsModal({
  project,
  onClose,
}) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            {project.name}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          <div>
            <h3 className="font-semibold text-slate-700">
              Description
            </h3>

            <p className="mt-2 text-slate-600">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="flex items-center gap-3">
              <UserRound className="text-cyan-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Project Leader
                </p>

                <p className="font-semibold">
                  {project.leader}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="text-cyan-600" />

              <div>
                <p className="text-sm text-slate-500">
                  Deadline
                </p>

                <p className="font-semibold">
                  {project.deadline}
                </p>
              </div>
            </div>

          </div>

          <div>
            <p className="mb-2 font-medium">
              Progress
            </p>

            <div className="h-3 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>

            <p className="mt-2 font-bold">
              {project.progress}%
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
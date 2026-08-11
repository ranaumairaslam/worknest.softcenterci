import {
  X,
  UserRound,
  Users,
  FolderKanban,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import { resolveTeamMembers } from "../../utils/teamMembers";

const infoItems = [
  {
    key: "status",
    label: "Status",
    icon: BadgeCheck,
    value: (team) => team.status,
  },
  {
    key: "leader",
    label: "Project Leader",
    icon: UserRound,
    value: (team) => team.projectLeader,
  },
  {
    key: "projects",
    label: "Active Projects",
    icon: FolderKanban,
    value: (team) => team.projects,
  },
  {
    key: "created",
    label: "Created On",
    icon: CalendarDays,
    value: (team) => team.createdAt,
  },
];

export default function TeamDetailsModal({
  open,
  team,
  employees = [],
  onClose,
}) {
  if (!open || !team) return null;

  const allMembers = resolveTeamMembers(team, employees);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Team Details
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {team.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {team.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Team Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          {infoItems.map(({ key, label, icon: Icon, value }) => (
            <div
              key={key}
              className="flex min-h-[76px] items-start gap-3 rounded-xl bg-slate-50 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#016472]/10">
                <Icon className="text-[#016472]" size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">{label}</p>

                <p className="mt-1 font-medium text-slate-800">
                  {value(team)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">
              Team Progress
            </h3>

            <span className="font-semibold text-slate-800">
              {team.progress}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-[#016472] transition-all"
              style={{ width: `${team.progress}%` }}
            />
          </div>
        </div>

        {/* Members */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <Users className="text-[#016472]" size={18} />

            <h3 className="font-semibold text-slate-900">
              Team Members ({allMembers.length}
              {team?.totalMembers ? ` / ${team.totalMembers}` : ""})
            </h3>
          </div>

          {allMembers.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No members assigned to this team yet.
            </p>
          ) : (
            <div className="space-y-3">
              {allMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-[#016472]/30 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#016472]/10 font-semibold text-[#016472]">
                      {member.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {member.name}
                      </h4>

                      <p className="text-sm text-slate-500">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      {member.email}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#016472] px-5 py-2 text-white transition hover:bg-[#014b55]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
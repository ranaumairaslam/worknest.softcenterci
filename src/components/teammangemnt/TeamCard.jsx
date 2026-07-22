import {
  Users,
  FolderKanban,
  UserRound,
  CalendarDays,
  BadgeCheck,
  Eye,
  Pencil,
  FolderPlus,
} from "lucide-react";

export default function TeamCard({
  teamName,
  description,
  status,
  leader,
  members,
  projects,
  createdAt,
}) {
  return (
    <div className="group flex h-full min-h-[470px] flex-col overflow-hidden rounded-2xl border border-[#016472]/20 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#016472] hover:shadow-2xl">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#000304] via-[#003845] to-[#016472] p-6">
        <h2 className="text-2xl font-bold text-[#A3FEFF]">
          {teamName}
        </h2>

        <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/80">
          {description}
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">

        {/* Status */}
        <div className="mb-5 flex items-center justify-between rounded-xl bg-[#A3FEFF]/10 px-4 py-3">

          <div className="flex items-center gap-2">
            <BadgeCheck className="text-[#016472]" size={19} />
            <span className="font-semibold text-gray-700">
              Status
            </span>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {status}
          </span>

        </div>

        {/* Information */}

        <div className="space-y-4">

          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#A3FEFF]/20 p-2">
              <UserRound className="text-[#016472]" size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Project Leader
              </p>

              <p className="font-semibold text-gray-800">
                {leader}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#A3FEFF]/20 p-2">
              <Users className="text-[#016472]" size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Team Members
              </p>

              <p className="font-semibold text-gray-800">
                {members}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#A3FEFF]/20 p-2">
              <FolderKanban className="text-[#016472]" size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Active Projects
              </p>

              <p className="font-semibold text-gray-800">
                {projects}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-[#A3FEFF]/20 p-2">
              <CalendarDays className="text-[#016472]" size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Created On
              </p>

              <p className="font-semibold text-gray-800">
                {createdAt}
              </p>
            </div>
          </div>

        </div>

        {/* Buttons */}

        <div className="mt-auto pt-8">
          <div className="grid grid-cols-3 gap-3">

            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#016472] px-3 py-3 text-sm font-semibold text-[#016472] transition-all duration-300 hover:bg-[#A3FEFF]/20">
              <Eye size={18} />
              View
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#016472] px-3 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#024b57]">
              <Pencil size={18} />
              Edit
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#000304] px-3 py-3 text-sm font-semibold text-[#A3FEFF] transition-all duration-300 hover:bg-[#016472]">
              <FolderPlus size={18} />
              Assign
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
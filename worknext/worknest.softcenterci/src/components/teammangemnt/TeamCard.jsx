import {

  Users,

  FolderKanban,

  UserRound,

  CalendarDays,

  BadgeCheck,

  Eye,

  FolderPlus,

  Trash2,

} from "lucide-react";



const infoRows = [

  { key: "leader", label: "Project Leader", icon: UserRound, getValue: (props) => props.leader },

  { key: "members", label: "Team Members", icon: Users, getValue: (props) => props.members },

  { key: "projects", label: "Active Projects", icon: FolderKanban, getValue: (props) => props.projects },

  { key: "created", label: "Created On", icon: CalendarDays, getValue: (props) => props.createdAt },

];



export default function TeamCard({

  teamName,

  description,

  status,

  leader,

  members,

  projects,

  progress = 0,

  createdAt,

  onView,

  onAssign,

  onDelete,

}) {

  const props = { leader, members, projects, createdAt };



  return (

    <div className="group flex h-full min-h-[470px] flex-col overflow-hidden rounded-2xl border border-[#016472]/20 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#016472] hover:shadow-2xl">

      <div className="bg-gradient-to-r from-[#000304] via-[#003845] to-[#016472] p-6">

        <h2 className="text-2xl font-bold text-[#A3FEFF]">{teamName}</h2>

        <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/80">{description}</p>

      </div>



      <div className="flex flex-1 flex-col p-6">

        <div className="mb-5 flex items-center justify-between rounded-xl bg-[#A3FEFF]/10 px-4 py-3">

          <div className="flex items-center gap-2">

            <BadgeCheck className="text-[#016472]" size={19} />

            <span className="font-semibold text-gray-700">Status</span>

          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

            {status}

          </span>

        </div>



        <div className="mb-5">

          <div className="flex items-center justify-between text-sm">

            <span className="text-gray-500">Team Progress</span>

            <span className="font-semibold text-gray-800">{progress}%</span>

          </div>

          <div className="mt-2 h-2 rounded-full bg-gray-200">

            <div className="h-2 rounded-full bg-[#016472]" style={{ width: `${progress}%` }} />

          </div>

        </div>



        <div className="space-y-3">

          {infoRows.map(({ key, label, icon: Icon, getValue }) => (
            <div key={key} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#A3FEFF]/20">
                <Icon className="text-[#016472]" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
                <p className="truncate font-semibold text-gray-800">{getValue(props)}</p>
              </div>
            </div>
          ))}

        </div>



       <div className="mt-auto flex items-center justify-end gap-3 pt-6">

  <button
    onClick={onView}
    title="View Details"
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#016472] text-white transition hover:scale-105 hover:bg-[#014b57]"
  >
    <Eye size={20} />
  </button>

  <button
    onClick={onAssign}
    title="Assign Members"
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#A3FEFF] text-[#016472] transition hover:scale-105 hover:bg-[#7ef8fb]"
  >
    <Users size={20} />
  </button>

  <button
    onClick={onDelete}
    title="Delete Team"
    className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:scale-105 hover:bg-red-100"
  >
    <Trash2 size={20} />
  </button>

</div>
      </div>

    </div>

  );

}



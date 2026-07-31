import { useMemo } from "react";
import {
  Users,
  UserRound,
  ShieldUser,
  UserCheck,
} from "lucide-react";
import { getTeamMemberCount } from "../../utils/teamMembers";

export default function TeamOverview({ teams = [], employees = [], loading, error, onAddTeam }) {
  const cards = useMemo(() => {
    const totalTeams = teams.length;
    const totalMembers = teams.reduce(
      (sum, team) => sum + getTeamMemberCount(team, employees),
      0
    );
    const projectLeaders = new Set(teams.map((team) => team.projectLeader)).size;
    const activeTeams = teams.filter((team) => team.status === "Active").length;

    return [
      { title: "Total Teams", value: String(totalTeams), icon: Users, gradient: "from-indigo-500 to-violet-500" },
      { title: "Total Members", value: String(totalMembers), icon: UserRound, gradient: "from-sky-500 to-cyan-500" },
      { title: "Project Leaders", value: String(projectLeaders), icon: ShieldUser, gradient: "from-emerald-500 to-green-400" },
      { title: "Active Teams", value: String(activeTeams), icon: UserCheck, gradient: "from-rose-500 to-pink-500" },
    ];
  }, [teams, employees]);

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading team metrics...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-500">Failed to load team metrics.</div>;
  }

  return (
    <section className="w-full px-4 py-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create teams, assign employees, and track team progress.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddTeam}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow transition hover:bg-indigo-700"
          >
            + Add Team
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
            >
              <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${card.gradient}`} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <h3 className="mt-3 text-4xl font-bold text-gray-900">{card.value}</h3>
                </div>
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg transition duration-300 group-hover:scale-110`}>
                  <Icon size={26} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

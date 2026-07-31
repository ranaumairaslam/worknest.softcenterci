import TeamCard from "./TeamCard";

import { getTeamMemberCount } from "../../utils/teamMembers";



export default function TeamDetails({ teams, employees = [], loading, error, onView, onAssign, onDelete }) {

  if (loading) {

    return <div className="p-6 text-sm text-slate-500">Loading team details...</div>;

  }



  if (error) {

    return <div className="p-6 text-sm text-rose-500">Failed to load team details.</div>;

  }



  return (

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

      {teams.map((team) => (

        <TeamCard

          key={team.id}

          teamName={team.name}

          description={team.description}

          status={team.status}

          leader={team.projectLeader}

          members={getTeamMemberCount(team, employees)}

          projects={team.projects}

          progress={team.progress}

          createdAt={team.createdAt}

          onView={() => onView?.(team)}

          onAssign={() => onAssign?.(team)}

          onDelete={() => onDelete?.(team)}

        />

      ))}

    </div>

  );

}



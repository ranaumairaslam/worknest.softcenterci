import TeamCard from "./TeamCard";
import teams from "./TeamData";

export default function TeamDetails() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard
          key={team.id}
          teamName={team.teamName}
          description={team.description}
          status={team.status}
          leader={team.projectLeader}
          members={team.totalMembers}
          projects={team.projects.length}
          createdAt={team.createdAt}
        />
      ))}
    </div>
  );
}
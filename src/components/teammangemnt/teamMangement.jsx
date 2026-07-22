import TeamOverview from "./Teamoverviews";
import TeamDetails from "./TeamDetails";

export default function TeamMangement() {
  return (
    <div className="w-full px-4 py-6 space-y-8">
      <TeamOverview />

      <TeamDetails />
    </div>
  );
}
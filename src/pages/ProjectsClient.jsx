import ProjectProgressCard from "../components/client/ProjectProgressCard";
import { clientProjects } from "../data/clientDashboardData";

export default function ProjectsClient() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          My Projects
        </h1>

        <p className="mt-2 text-slate-500">
          Track the progress of all your assigned projects.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Project Progress
        </h2>

        <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
          {clientProjects.length} Projects
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {clientProjects.map((project) => (
          <ProjectProgressCard
            key={project.id}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}
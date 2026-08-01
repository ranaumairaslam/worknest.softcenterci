import { useEffect, useState } from "react";

import ProjectProgressCard from "../components/client/ProjectProgressCard";
import ProjectDetailsModal from "../components/client/ProjectDetailsModal";
import { getClientProjects } from "../services/clientDashboardService";
import { subscribeDataChange } from "../utils/eventBus";

export default function ProjectsClient() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getClientProjects("client");
      if (mounted) {
        setProjects(data);
        setLoading(false);
      }
    }

    load();
    return subscribeDataChange(load);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <p className="text-slate-500">Loading projects...</p>
      </div>
    );
  }

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
          {projects.length} Projects
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <ProjectProgressCard
            key={project.id}
            project={project}
            onViewDetails={setSelectedProject}
          />
        ))}
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

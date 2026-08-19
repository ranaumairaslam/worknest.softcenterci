import { useEffect, useState } from "react";

import ProjectProgressCard from "../components/client/ProjectProgressCard";
import ProjectDetailsModal from "../components/client/ProjectDetailsModal";
import { getClientProjectsList } from "../services/clientDashboardService";
import { subscribeDataChange } from "../utils/eventBus";

export default function ProjectsClient() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getClientProjectsList();
        if (mounted) {
          setProjects(data || []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
        if (mounted) {
          setError("Failed to load projects. Please try refreshing the page.");
          setProjects([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    const unsubscribe = subscribeDataChange(load);
    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
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

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Project Progress
        </h2>

        <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
          {projects.length} Projects
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg bg-slate-100 p-8 text-center">
          <p className="text-slate-500">No projects assigned yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectProgressCard
              key={project.id}
              project={project}
              onViewDetails={setSelectedProject}
            />
          ))}
        </div>
      )}

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

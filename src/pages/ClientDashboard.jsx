import { useEffect, useState } from "react";
import {
  FolderKanban,
  BarChart3,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import ClientStatsCard from "../components/client/ClientStatsCard";
import ProjectProgressCard from "../components/client/ProjectProgressCard";
import ProjectDetailsModal from "../components/client/ProjectDetailsModal";
import { getClientDashboard } from "../services/clientDashboardService";
import { subscribeDataChange } from "../utils/eventBus";

export default function ClientDashboard() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const icons = [
    FolderKanban,
    BarChart3,
    CalendarDays,
    CheckCircle2,
  ];

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getClientDashboard("client");
        if (mounted) {
          setStats(data.stats || []);
          setProjects(data.projects || []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        if (mounted) {
          setError("Failed to load dashboard. Please try refreshing the page.");
          // Set default empty stats on error
          setStats([
            { id: 1, title: "Projects", value: 0, color: "bg-cyan-600" },
            { id: 2, title: "Progress", value: "0%", color: "bg-blue-600" },
            { id: 3, title: "Meetings", value: 0, color: "bg-violet-600" },
            { id: 4, title: "Tasks", value: 0, color: "bg-green-600" },
          ]);
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
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="mb-8 text-4xl font-bold text-slate-800">
        Client Dashboard
      </h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <ClientStatsCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={icons[index]}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-10">
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
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

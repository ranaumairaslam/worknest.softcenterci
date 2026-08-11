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

  const icons = [
    FolderKanban,
    BarChart3,
    CalendarDays,
    CheckCircle2,
  ];

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await getClientDashboard("client");
      if (mounted) {
        setStats(data.stats);
        setProjects(data.projects);
        setLoading(false);
      }
    }

    load();
    return subscribeDataChange(load);
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

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectProgressCard
              key={project.id}
              project={project}
              onViewDetails={setSelectedProject}
            />
          ))}
        </div>
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}

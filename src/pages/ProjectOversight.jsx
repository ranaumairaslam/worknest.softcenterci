import { useMemo, useState } from "react";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Users,
  Search,
  Plus,
} from "lucide-react";

import StatsCard from "../components/project/StatsCard";
import ProjectCard from "../components/project/ProjectCard";
import projects from "../data/projectData";

export default function ProjectOversight() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "Active").length,
      completed: projects.filter((p) => p.status === "Completed").length,
      delayed: projects.filter((p) => p.progress < 50).length,
      members: projects.reduce((sum, p) => sum + p.members, 0),
    };
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.team.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || project.status === status;

      const matchesPriority =
        priority === "All" || project.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, status, priority]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Project Oversight
          </h1>

          <p className="mt-2 text-gray-500">
            Monitor every project across your organization.
          </p>

        </div>

        <button className="flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 font-semibold text-white transition hover:bg-[#014b55]">
          <Plus size={18} />
          New Project
        </button>

      </div>

      {/* Stats */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

        <StatsCard
          title="Total Projects"
          value={stats.total}
          icon={FolderKanban}
          color="bg-cyan-600"
        />

        <StatsCard
          title="Active"
          value={stats.active}
          icon={Clock3}
          color="bg-blue-600"
        />

        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-green-600"
        />

        <StatsCard
          title="Delayed"
          value={stats.delayed}
          icon={AlertTriangle}
          color="bg-red-600"
        />

        <StatsCard
          title="Members"
          value={stats.members}
          icon={Users}
          color="bg-violet-600"
        />

      </div>

      {/* Search & Filters */}

      <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-4 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search Project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-cyan-500"
            />

          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-gray-200 px-4"
          >
            <option>All</option>
            <option>Active</option>
            <option>Planning</option>
            <option>Review</option>
            <option>Completed</option>
            <option>In Progress</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-gray-200 px-4"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

        </div>

      </div>

      {/* Project Cards */}

      <div className="mt-10">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-slate-800">
            All Projects
          </h2>

          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            {filteredProjects.length} Projects
          </span>

        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}

        </div>

      </div>

    </div>
  );
}
import { useEmployees } from "../hooks/useEmployees";

import { getAllClients } from "../services/clientService";

import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";

import StatsCard from "../components/project/StatsCard";
import ProjectCard from "../components/project/ProjectCard";
import { useProjects } from "../hooks/useProjects";
import { useTeams } from "../hooks/useTeams";
import ProjectModal from "../components/Modals/ProjectModal";
import ProjectDetailsModal from "../components/Modals/ProjectDetailsModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";


export default function ProjectOversight() {
  const location = useLocation();
  const isAdmin = location.pathname === "/projects";
    
  const { employees } = useEmployees();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      const data = await getAllClients();
      setClients(data);
    };

    loadClients();
  }, []);


  const {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    completeProject,
    setProjectLeader,
  } = useProjects();
  const { teams } = useTeams();

  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editProjectItem, setEditProjectItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [toast, setToast] = useState({ show: false, message: "" });

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => p.status === "Active" || p.status === "In Progress").length,
    completed: projects.filter((p) => p.status === "Completed").length,
    delayed: projects.filter((p) => p.progress < 50 && p.status !== "Completed").length,
    members: projects.reduce((sum, p) => sum + (p.members || 0), 0),
  }), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.team.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "All" || project.status === status;
      const matchesPriority = priority === "All" || project.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, search, status, priority]);

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleSelect = (project) => {
    setSelectedProject(project);
    setShowDetails(true);
  };

  const handleSubmit = async (project) => {
    try {
      if (editProjectItem) {
        await editProject(project.id, project);
        showSuccess("Project updated successfully.");
      } else {
        await addProject(project);
        showSuccess("Project created successfully.");
      }
      setShowModal(false);
      setEditProjectItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (project) => {
    await completeProject(project.id);
    showSuccess("Project marked as completed.");
    setShowDetails(false);
  };

  const handleAssignLeader = async (project, leader) => {
    await setProjectLeader(project.id, leader);
    showSuccess("Project leader assigned.");
    setSelectedProject({ ...project, leader });
  };

  const handleDeleteFromDetails = (project) => {
    setShowDetails(false);
    setDeleteItem(project);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeProject(deleteItem.id);
      showSuccess("Project deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading projects...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-500">Failed to load projects.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            {isAdmin ? "Project Management" : "Project Oversight"}
          </h1>
          <p className="mt-2 text-gray-500">
            {isAdmin
              ? "Create, edit, and track all company projects."
              : "Monitor every project across your organization."}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditProjectItem(null); setShowModal(true); }}
            className="flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 font-semibold text-white transition hover:bg-[#014b55]"
          >
            <Plus size={18} />
            New Project
          </button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Projects" value={stats.total} icon={FolderKanban} color="bg-cyan-600" />
        <StatsCard title="Active" value={stats.active} icon={Clock3} color="bg-blue-600" />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} color="bg-green-600" />
        <StatsCard title="Delayed" value={stats.delayed} icon={AlertTriangle} color="bg-red-600" />
        <StatsCard title="Members" value={stats.members} icon={Users} color="bg-violet-600" />
      </div>

      <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-cyan-500"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-gray-200 px-4">
            <option>All</option>
            <option>Active</option>
            <option>Planning</option>
            <option>Review</option>
            <option>Completed</option>
            <option>In Progress</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-xl border border-gray-200 px-4">
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">All Projects</h2>
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            {filteredProjects.length} Projects
          </span>
        </div>

       <div className="grid auto-rows-fr gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
           <div
  key={project.id}
  className="flex h-full flex-col rounded-3xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
>
              <ProjectCard project={project} onSelect={handleSelect} />
              {isAdmin && (
              <div className="flex gap-3 border-t border-slate-100 p-4">
                  <button
  onClick={() => {
    setEditProjectItem(project);
    setShowModal(true);
  }}
  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-600 hover:text-white"
>
  <Edit3 size={18} />
  Edit
</button>
                 <button
  onClick={() => setDeleteItem(project)}
  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white"
>
  <Trash2 size={18} />
  Delete
</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    <ProjectModal
  open={showModal}
  project={editProjectItem}
  teams={teams}
  employees={employees}
  clients={clients}
  onClose={() => {
    setShowModal(false);
    setEditProjectItem(null);
  }}
  onSubmit={handleSubmit}
/>
      <ProjectDetailsModal
        open={showDetails}
        project={selectedProject}
        isAdmin={isAdmin}
        onClose={() => setShowDetails(false)}
        onComplete={handleComplete}
        onAssignLeader={handleAssignLeader}
        onDelete={handleDeleteFromDetails}
      />

      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />
    </div>
  );
}

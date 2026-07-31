import { useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  markProjectCompleted,
  assignProjectLeader,
} from "../services/projectService";
import useRole from "./useRole";

export function useProjects() {
  const role = useRole();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAllProjects(role);
        if (isMounted) setProjects(data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [role]);

  const addProject = async (payload) => {
    const project = await createProject(payload, role);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const editProject = async (id, updates) => {
    const project = await updateProject(id, updates, role);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  const removeProject = async (id) => {
    const deleted = await deleteProject(id, role);
    if (deleted) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    return deleted;
  };

  const completeProject = async (id) => {
    const project = await markProjectCompleted(id, role);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  const setProjectLeader = async (id, leaderName) => {
    const project = await assignProjectLeader(id, leaderName, role);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  return {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject,
    completeProject,
    setProjectLeader,
  };
}

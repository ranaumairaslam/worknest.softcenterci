import { useCallback, useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  markProjectCompleted,
  assignProjectLeader,
} from "../services/projectService";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addProject = async (payload) => {
    const project = await createProject(payload);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const editProject = async (id, updates) => {
    const project = await updateProject(id, updates);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  const removeProject = async (id) => {
    const deleted = await deleteProject(id);
    if (deleted) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    return deleted;
  };

  const completeProject = async (id) => {
    const project = await markProjectCompleted(id);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  const setProjectLeader = async (id, leaderName) => {
    const project = await assignProjectLeader(id, leaderName);
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
    refresh: load,
  };
}
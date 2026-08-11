import { useCallback, useEffect, useState } from "react";
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  markProjectCompleted,
  assignProjectLeader,
} from "../services/projectService";
import { getActor } from "../services/authContext";
import { subscribeDataChange } from "../utils/eventBus";
import useRole from "./useRole";

export function useProjects() {
  const role = useRole();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllProjects(role);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
    return subscribeDataChange(load);
  }, [load]);

  const actor = getActor(role);

  const addProject = async (payload) => {
    const project = await createProject(payload, actor);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const editProject = async (id, updates) => {
    const project = await updateProject(id, updates, actor);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  const removeProject = async (id) => {
    const deleted = await deleteProject(id, actor);
    if (deleted) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    return deleted;
  };

  const completeProject = async (id) => {
    const project = await markProjectCompleted(id, actor);
    if (project) {
      setProjects((prev) => prev.map((p) => (p.id === id ? project : p)));
    }
    return project;
  };

  const setProjectLeader = async (id, leaderName) => {
    const project = await assignProjectLeader(id, leaderName, actor);
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

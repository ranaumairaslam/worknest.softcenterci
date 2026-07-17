import { useEffect, useState } from "react";
import {
  getProjects,
  getProjectTasks,
  getPendingDeliverables,
} from "../services/projectLeaderService";

export function useProjectLeaderData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects + deliverables once on mount
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [projectList, deliverableList] = await Promise.all([
          getProjects(),
          getPendingDeliverables(),
        ]);
        if (isMounted) {
          setProjects(projectList);
          setDeliverables(deliverableList);
          setSelectedProjectId(projectList[0]?.id ?? null);
        }
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
  }, []);

  // Re-fetch tasks whenever the selected project changes
  useEffect(() => {
    if (!selectedProjectId) return;
    let isMounted = true;

    getProjectTasks(selectedProjectId).then((data) => {
      if (isMounted) setTasks(data);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  return {
    projects,
    tasks,
    deliverables,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    error,
  };
}
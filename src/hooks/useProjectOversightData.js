// src/hooks/useProjectOversightData.js
import { useEffect, useState, useCallback } from "react";
import {
  getProjects,
  getProjectSummary,
  getStats,
  getTimeline,
  getTeamPerformance,
  getTaskOverview,
  getKanbanPreview,
} from "../services/projectOversightService";

const emptyProjectData = {
  summary: {
    id: "empty-project",
    name: "No project assigned",
    status: "Active",
    description: "No project data available yet.",
    startDate: "—",
    endDate: "—",
    progress: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
    daysRemaining: 0,
  },
  stats: [],
  timeline: [],
  team: [],
  tasks: [],
  kanban: { columns: [] },
};

export function useProjectOversightData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [data, setData] = useState(emptyProjectData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  // Load projects list first
  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      try {
        const list = await getProjects();
        if (!isMounted) return;
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        } else {
          // No projects at all → stop loading
          setLoading(false);
        }
        setProjectsLoaded(true);
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load project data when selectedProjectId changes
  const loadProjectData = useCallback(async () => {
    if (!selectedProjectId) return;
    setLoading(true);

    try {
      const [summary, stats, timeline, team, tasks, kanban] = await Promise.all([
        getProjectSummary(selectedProjectId),
        getStats(),
        getTimeline(selectedProjectId),
        getTeamPerformance(selectedProjectId),
        getTaskOverview(selectedProjectId),
        getKanbanPreview(selectedProjectId),
      ]);

      setData({ summary, stats, timeline, team, tasks, kanban });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectData();
    }
  }, [selectedProjectId, loadProjectData]);

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    data,
    loading,
    error,
    refresh: loadProjectData,
  };
}
import { useEffect, useState } from "react";
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

  // Load the project list once, pick the first one as default.
  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then((list) => {
        if (!isMounted) return;

        setProjects(list);
        if (list.length === 0) {
          setSelectedProjectId(null);
          setData(emptyProjectData);
          setError(null);
          return;
        }

        setSelectedProjectId(list[0]?.id ?? null);
      })
      .catch((err) => {
        if (isMounted) {
          setProjects([]);
          setSelectedProjectId(null);
          setData(emptyProjectData);
          setError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setData(emptyProjectData);
      return;
    }

    let isMounted = true;

    Promise.all([
      getProjectSummary(selectedProjectId),
      getStats(),
      getTimeline(selectedProjectId),
      getTeamPerformance(selectedProjectId),
      getTaskOverview(selectedProjectId),
      getKanbanPreview(selectedProjectId),
    ])
      .then(([summary, stats, timeline, team, tasks, kanban]) => {
        if (isMounted) {
          setData({ summary, stats, timeline, team, tasks, kanban });
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setData(emptyProjectData);
          setError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  const loading = Boolean(selectedProjectId) && (!data || data.summary.id !== selectedProjectId);

  return { projects, selectedProjectId, setSelectedProjectId, data, loading, error };
}
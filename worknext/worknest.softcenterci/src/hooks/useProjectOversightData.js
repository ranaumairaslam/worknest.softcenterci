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

export function useProjectOversightData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Load the project list once, pick the first one as default.
  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then((list) => {
        if (isMounted) {
          setProjects(list);
          setSelectedProjectId(list[0]?.id ?? null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Re-fetch everything whenever the selected project changes.
  // No setState is called synchronously here — only inside the
  // resolved promise callback, which the React Compiler allows.
  useEffect(() => {
    if (!selectedProjectId) return;
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
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  // Derived, not stored: loading is true whenever we don't yet have
  // data for the CURRENTLY selected project (e.g. right after
  // switching projects, before the new fetch resolves).
  const loading = !data || data.summary.id !== selectedProjectId;

  return { projects, selectedProjectId, setSelectedProjectId, data, loading, error };
}
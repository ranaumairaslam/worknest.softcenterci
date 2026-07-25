import { useEffect, useState } from "react";
import {
  getProjectSummary,
  getStats,
  getTimeline,
  getTeamPerformance,
  getTaskOverview,
  getKanbanPreview,
} from "../services/projectOversightService";

export function useProjectOversightData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [summary, stats, timeline, team, tasks, kanban] = await Promise.all([
          getProjectSummary(),
          getStats(),
          getTimeline(),
          getTeamPerformance(),
          getTaskOverview(),
          getKanbanPreview(),
        ]);
        if (isMounted) {
          setData({ summary, stats, timeline, team, tasks, kanban });
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

  return { data, loading, error };
}
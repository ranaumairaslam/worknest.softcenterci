import { useEffect, useState } from "react";
import {
  getReportStats,
  getTaskStatusBreakdown,
  getProjectProgress,
  getTeamProgress,
  getRecentReports,
} from "../services/reportsService";

export function useReportsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [stats, statusBreakdown, projectProgress, teamProgress, reports] = await Promise.all([
          getReportStats(),
          getTaskStatusBreakdown(),
          getProjectProgress(),
          getTeamProgress(),
          getRecentReports(),
        ]);
        if (isMounted) {
          setData({ stats, statusBreakdown, projectProgress, teamProgress, reports });
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
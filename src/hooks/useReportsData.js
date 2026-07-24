import { useEffect, useState } from "react";
import {
  getReportStats,
  getTaskStatusBreakdown,
  getProjectProgress,
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
        const [stats, statusBreakdown, projectProgress, reports] = await Promise.all([
          getReportStats(),
          getTaskStatusBreakdown(),
          getProjectProgress(),
          getRecentReports(),
        ]);
        if (isMounted) {
          setData({ stats, statusBreakdown, projectProgress, reports });
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
import { useEffect, useState } from "react";
import {
  getStats,
  getProjectProgress,
  getInvitations,
  getTeamOverview,
} from "../services/dashboardService";

export function useDashboardData() {
  const [data, setData] = useState({
    stats: [],
    projects: [],
    invitations: [],
    team: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [stats, projects, invitations, team] = await Promise.all([
          getStats(),
          getProjectProgress(),
          getInvitations(),
          getTeamOverview(),
        ]);
        if (isMounted) {
          setData({ stats, projects, invitations, team });
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

  return { ...data, loading, error };
}
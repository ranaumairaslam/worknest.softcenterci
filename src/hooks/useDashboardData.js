import { useEffect, useState } from "react";
import {
  getStats,
  getProjectProgress,
  getInvitations,
  getTeamOverview,
  getRevenueOverview,
} from "../services/dashboardService";

export function useDashboardData() {
  const [data, setData] = useState({
    stats: [],
    projects: [],
    invitations: [],
    team: [],
    revenue: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    try {
      const [stats, projects, invitations, team, revenue] = await Promise.all([
        getStats(),
        getProjectProgress(),
        getInvitations(),
        getTeamOverview(),
        getRevenueOverview(),
      ]);
      setData({ stats, projects, invitations, team, revenue });
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [stats, projects, invitations, team, revenue] = await Promise.all([
          getStats(),
          getProjectProgress(),
          getInvitations(),
          getTeamOverview(),
          getRevenueOverview(),
        ]);
        if (isMounted) {
          setData({ stats, projects, invitations, team, revenue });
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

  return { ...data, loading, error, refresh };
}

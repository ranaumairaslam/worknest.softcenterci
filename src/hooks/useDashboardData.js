import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboardService";

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
      setError(null);
      setData(await getDashboardSummary());
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const dashboard = await getDashboardSummary();
        if (isMounted) {
          setData(dashboard);
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

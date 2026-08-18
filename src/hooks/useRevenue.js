import { useCallback, useEffect, useState } from "react";
import {
  getAllRevenues,
  createRevenue,
  updateRevenue,
  deleteRevenue,
  getRevenueSummary,
} from "../services/revenueService";

export function useRevenue() {
  const [revenues, setRevenues] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    completedRevenue: 0,
    pendingRevenue: 0,
    totalEntries: 0,
    monthlyRevenue: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [data, sum] = await Promise.all([
        getAllRevenues(),
        getRevenueSummary(),
      ]);
      setRevenues(data);
      setSummary(sum);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addRevenue = async (payload) => {
    const revenue = await createRevenue(payload);
    setRevenues((prev) => [revenue, ...prev]);
    await load(); // refresh summary
    return revenue;
  };

  const editRevenue = async (id, updates) => {
    const revenue = await updateRevenue(id, updates);
    if (revenue) {
      setRevenues((prev) => prev.map((r) => (r.id === id ? revenue : r)));
      await load();
    }
    return revenue;
  };

  const removeRevenue = async (id) => {
    const deleted = await deleteRevenue(id);
    if (deleted) {
      setRevenues((prev) => prev.filter((r) => r.id !== id));
      await load();
    }
    return deleted;
  };

  return {
    revenues,
    summary,
    loading,
    error,
    addRevenue,
    editRevenue,
    removeRevenue,
    refresh: load,
  };
}

// Also export as default
export default useRevenue;
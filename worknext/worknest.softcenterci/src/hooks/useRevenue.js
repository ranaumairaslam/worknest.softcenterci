import { useEffect, useState } from "react";
import {
  getAllRevenueRecords,
  createRevenueRecord,
  updateRevenueRecord,
  deleteRevenueRecord,
  getRevenueSummary,
} from "../services/revenueService";
import { getAllProjects } from "../services/projectService";
import { getAllClients } from "../services/clientService";

export function useRevenue() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSummary = async () => {
    const [projects, clients] = await Promise.all([getAllProjects(), getAllClients()]);
    const data = await getRevenueSummary(projects, clients);
    setSummary(data);
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [data, projects, clients] = await Promise.all([
          getAllRevenueRecords(),
          getAllProjects(),
          getAllClients(),
        ]);
        const revenueSummary = await getRevenueSummary(projects, clients);
        if (isMounted) {
          setRecords(data);
          setSummary(revenueSummary);
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

  const addRevenue = async (payload) => {
    const record = await createRevenueRecord(payload);
    setRecords((prev) => [record, ...prev]);
    await refreshSummary();
    return record;
  };

  const editRevenue = async (id, updates) => {
    const record = await updateRevenueRecord(id, updates);
    if (record) {
      setRecords((prev) => prev.map((r) => (r.id === id ? record : r)));
      await refreshSummary();
    }
    return record;
  };

  const removeRevenue = async (id) => {
    const deleted = await deleteRevenueRecord(id);
    if (deleted) {
      setRecords((prev) => prev.filter((r) => r.id !== id));
      await refreshSummary();
    }
    return deleted;
  };

  return {
    records,
    summary,
    loading,
    error,
    addRevenue,
    editRevenue,
    removeRevenue,
    refreshSummary,
  };
}

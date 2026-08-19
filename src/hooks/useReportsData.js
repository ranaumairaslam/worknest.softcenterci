import { useEffect, useState } from "react";
import { getReport } from "../services/teamLeaderService";

export function useReportsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const report = await getReport();
        const summary = report.summary || {};
        const stats = [
          { id: "total", label: "Total Tasks", value: summary.total_tasks || 0, trend: "up", trendValue: "Live" },
          { id: "completed", label: "Completed", value: summary.completed_tasks || 0, trend: "up", trendValue: "Live" },
          { id: "pending", label: "Pending", value: summary.pending_tasks || 0, trend: "down", trendValue: "Live" },
          { id: "created", label: "Created After Range", value: summary.created_after_from || 0, trend: "up", trendValue: "Live" },
        ];
        const statusBreakdown = [
          { name: "Completed", value: summary.completed_tasks || 0, color: "#10b981" },
          { name: "Pending", value: summary.pending_tasks || 0, color: "#f59e0b" },
          { name: "Other", value: Math.max(0, (summary.total_tasks || 0) - (summary.completed_tasks || 0) - (summary.pending_tasks || 0)), color: "#64748b" },
        ];
        const projectProgress = [{ name: report.team || "Team", value: summary.total_tasks ? Math.round((summary.completed_tasks / summary.total_tasks) * 100) : 0 }];
        const teamProgress = projectProgress;
        const reports = [{ name: "Team report", project: report.team || "Team", generatedBy: "Team Leader", date: new Date().toLocaleDateString(), isoDate: new Date().toISOString().slice(0, 10), type: "Live" }];
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
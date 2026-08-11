import { useEffect, useState } from "react";
import {
  getExecutiveSummary,
  getProjectStatusReport,
  getTeamPerformanceReport,
  getRevenueReport,
} from "../services/reportsService";

export function useCompanyReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // Fetch all reports in parallel — MUCH FASTER!
        const [summary, projects, teams, revenue] = await Promise.all([
          getExecutiveSummary(),
          getProjectStatusReport(),
          getTeamPerformanceReport(),
          getRevenueReport(),
        ]);

        console.log("📊 Reports Data:", { summary, projects, teams, revenue });

        // Build Stats Cards
        const stats = [
          {
            title: "Total Projects",
            value: summary?.projects?.total || 0,
            subtitle: "Across all departments",
            color: "bg-cyan-600",
          },
          {
            title: "Completed",
            value: summary?.projects?.completed || 0,
            subtitle: "Finished successfully",
            color: "bg-green-600",
          },
          {
            title: "Active",
            value: summary?.projects?.active || 0,
            subtitle: "Currently running",
            color: "bg-orange-500",
          },
          {
            title: "Employees",
            value: teams.reduce((sum, t) => sum + (t.member_count || 0), 0),
            subtitle: "Company members",
            color: "bg-violet-600",
          },
          {
            title: "Tasks",
            value: summary?.tasks?.total || 0,
            subtitle: "Assigned tasks",
            color: "bg-blue-600",
          },
          {
            title: "Completed Tasks",
            value: summary?.tasks?.completed || 0,
            subtitle: "Finished tasks",
            color: "bg-emerald-600",
          },
        ];

        // Project Status Chart Data
        const statusGroups = projects.reduce((acc, p) => {
          const status = p.status || "unknown";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const projectStatusData = Object.entries(statusGroups).map(
          ([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          })
        );

        // Team Performance Chart Data
        const teamPerformance = teams.map((t) => ({
          name: t.team_name,
          progress:
            t.total_tasks > 0
              ? Math.round((t.completed_tasks / t.total_tasks) * 100)
              : 0,
        }));

        // Task Trend (based on projects)
        const taskTrend = projects.slice(0, 6).map((p) => ({
          name: p.name.substring(0, 15),
          value: p.total_tasks || 0,
        }));

        // Monthly Completion (from revenue monthly breakdown)
        const monthlyCompletion = (revenue?.monthly_breakdown || [])
          .slice()
          .reverse()
          .map((m) => ({
            month: m.month,
            value: Math.round(Number(m.revenue) / 1000) || 0,
          }));

        if (isMounted) {
          setData({
            stats,
            projectStatusData,
            teamPerformance,
            taskTrend,
            monthlyCompletion,
            revenue,
            teams,
            projects,
            summary,
          });
          setError(null);
        }
      } catch (err) {
        console.error("Reports load error:", err);
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
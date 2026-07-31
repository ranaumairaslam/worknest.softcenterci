import { useEffect, useState } from "react";
import { getAllProjects } from "../services/projectService";
import { getAllTeams } from "../services/teamService";
import { getAllEmployees } from "../services/employeeService";
import { getAllTasks, getTaskStatistics } from "../services/taskService";
import { getRevenueSummary } from "../services/revenueService";
import { getAllClients } from "../services/clientService";

export function useCompanyReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [projects, teams, employees, tasks, taskStats, clients] = await Promise.all([
          getAllProjects(),
          getAllTeams(),
          getAllEmployees(),
          getAllTasks(),
          getTaskStatistics(),
          getAllClients(),
        ]);

        const revenue = await getRevenueSummary(projects, clients);

        const completedProjects = projects.filter((p) => p.status === "Completed").length;
        const activeProjects = projects.filter((p) => p.status !== "Completed").length;
        const overdueTasks = tasks.filter((t) => t.status === "Rejected" || t.status === "Pending").length;

        const stats = [
          { title: "Total Projects", value: projects.length, subtitle: "Across all departments", color: "bg-cyan-600" },
          { title: "Completed", value: completedProjects, subtitle: "Finished successfully", color: "bg-green-600" },
          { title: "Active", value: activeProjects, subtitle: "Currently running", color: "bg-orange-500" },
          { title: "Employees", value: employees.length, subtitle: "Company members", color: "bg-violet-600" },
          { title: "Tasks", value: tasks.length, subtitle: "Assigned tasks", color: "bg-blue-600" },
          { title: "Overdue", value: overdueTasks, subtitle: "Need attention", color: "bg-red-600" },
        ];

        const projectStatusData = [
          { name: "Completed", value: completedProjects },
          { name: "In Progress", value: projects.filter((p) => p.status === "In Progress" || p.status === "Active").length },
          { name: "Planning", value: projects.filter((p) => p.status === "Planning").length },
          { name: "Review", value: projects.filter((p) => p.status === "Review").length },
        ].filter((d) => d.value > 0);

        const teamPerformance = teams.map((t) => ({
          name: t.name,
          progress: t.progress || 0,
        }));

        const taskTrend = taskStats
          .filter((s) => s.id !== "total-tasks")
          .map((s) => ({ name: s.label, value: s.value }));

        const monthlyCompletion = revenue.monthlyRevenue.map((m) => ({
          month: m.month,
          value: Math.round(m.value / 1000),
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
            employees,
            projects,
          });
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

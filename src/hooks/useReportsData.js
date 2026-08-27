import { useEffect, useState } from "react";
import {
  getReportStats,
  getTaskStatusBreakdown,
  getProjectProgress,
  getTeamProgress,
  getRecentReports,
} from "../services/reportsService";
import {
  getTeamLeaderProjects,
  getTeamLeaderMembers,
  getTeamLeaderProgress,
  getTeamLeaderReports,
} from "../services/teamLeaderService";
import useRole from "./useRole";

export function useReportsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useRole();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        if (role === "projectLeader" || role === "team_leader") {
          const [projects, members, progress, summary] = await Promise.all([
            getTeamLeaderProjects(),
            getTeamLeaderMembers(),
            getTeamLeaderProgress(),
            getTeamLeaderReports(),
          ]);

          const totalTasks = Number(progress[0]?.value ?? 0);
          const completedTasks = Number(progress[1]?.value ?? 0);
          const remainingTasks = Math.max(totalTasks - completedTasks, 0);

          const leaderData = {
            stats: progress,
            statusBreakdown: [
              { label: "Completed", value: completedTasks, percent: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0, color: "#10b981" },
              { label: "Remaining", value: remainingTasks, percent: totalTasks ? Math.round((remainingTasks / totalTasks) * 100) : 0, color: "#3b82f6" },
            ],
            projectProgress: projects.map((project) => ({
              name: project.name,
              value: project.taskCount ? 100 : 0,
            })),
            teamProgress: members.map((member) => ({
              name: member.name,
              value: 0,
            })),
            reports: [
              {
                id: summary?.team || "team-report",
                name: `${summary?.team || "Team"} summary`,
                project: summary?.team || "All projects",
                generatedBy: "Team Leader",
                date: new Date().toISOString().slice(0, 10),
                type: "Summary",
                isoDate: new Date().toISOString().slice(0, 10),
              },
            ],
          };

          if (isMounted) {
            setData(leaderData);
          }
          return;
        }

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
  }, [role]);

  return { data, loading, error };
}
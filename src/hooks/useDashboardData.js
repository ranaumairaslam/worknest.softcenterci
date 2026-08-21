import { useState, useEffect } from "react";
import { get } from "../services/apiClient";

// Employees page jaisi list (already team_leader + team_member filter)
async function fetchEmployeeCount() {
  try {
    // try common company employees endpoints
    const res = await get("/company/employees", { limit: 100 });
    const list = res?.data || res?.employees || [];
    if (!Array.isArray(list)) return 0;

    // safety: only count real staff roles (exclude company admin)
    return list.filter((e) => {
      const role = String(e.role || "").toLowerCase();
      return (
        role === "team_leader" ||
        role === "team_member" ||
        role === "team leader" ||
        role === "team member" ||
        role.includes("leader") ||
        role.includes("member")
      );
    }).length;
  } catch (err) {
    console.warn("Employee count fetch failed:", err?.message || err);
    return null; // fallback to dashboard field
  }
}

export function useDashboardData() {
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [team, setTeam] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // dashboard + employees parallel
        const [res, employeeCount] = await Promise.all([
          get("/company/dashboard"),
          fetchEmployeeCount(),
        ]);

        console.log("Full Response:", res);

        const d = res?.data?.data || res?.data || {};

        console.log("Extracted Data:", d);

        // ✅ Real employees count (matches Employees page)
        // backend d.employees often includes company admin → wrong (3)
        const backendEmp =
          d.employees?.total_employees ??
          d.employees?.total ??
          d.employees ??
          d.total_employees ??
          0;

        const totalEmployees =
          employeeCount !== null && employeeCount !== undefined
            ? employeeCount
            : Number(backendEmp) || 0;

        setCompany(d.company);

        setStats([
          {
            id: "total-projects",
            label: "Total Projects",
            value: d.projects?.total_projects ?? 0,
            note: `${d.projects?.active_projects ?? 0} active • ${
              d.projects?.completed_projects ?? 0
            } completed`,
          },
          {
            id: "total-teams",
            label: "Total Teams",
            value: d.teams?.total_teams ?? 0,
            note: `${d.teams?.teams_with_leader ?? 0} led teams`,
          },
          // ✅ FIXED: employees list count, not backend all-users count
          {
            id: "total-employees",
            label: "Total Employees",
            value: totalEmployees,
            note: `${totalEmployees} active personnel`,
          },
          {
            id: "total-clients",
            label: "Total Clients",
            value: d.clients ?? 0,
            note: "External accounts linked",
          },
          {
            id: "active-tasks",
            label: "Active Tasks",
            value: d.tasks?.active_tasks ?? 0,
            note: "Tasks currently in play",
          },
          {
            id: "completed-tasks",
            label: "Completed Tasks",
            value: d.tasks?.completed_tasks ?? 0,
            note: "Tasks moved to complete",
          },
          {
            id: "pending-tasks",
            label: "Pending Tasks",
            value: d.tasks?.pending_tasks ?? 0,
            note: "Tasks waiting to be picked up",
          },
          {
            id: "total-revenue",
            label: "Total Revenue",
            value: `$${((d.total_revenue ?? 0) / 1000).toFixed(1)}K`,
            note: "All time historical ledger",
          },
        ]);

        setProjects(
          (d.project_progress ?? []).map((p) => ({
            id: p.id,
            name: p.project_name || p.name,
            progress: p.progress ?? 0,
            status: p.status,
            team: p.team_name ?? "Unassigned",
          }))
        );

        setInvitations(
          (d.recent_activity ?? []).map((item) => ({
            id: item.id,
            label: item.title || item.message || "Activity",
            sub: item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "",
          }))
        );

        setTeam(
          (d.team_overview ?? []).map((member) => ({
            id: member.id,
            label: member.name,
            sub: member.role || "Member",
          }))
        );

        setRevenue({
          totalRevenue: d.total_revenue ?? 0,
          revenuePerProject: d.project_progress ?? [],
        });
      } catch (err) {
        console.error("API Error:", err);
        console.log("Response:", err.response);
        console.log("Data:", err.response?.data);
        console.log("Message:", err.message);

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to retrieve dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    company,
    stats,
    projects,
    invitations,
    team,
    revenue,
    loading,
    error,
  };
}
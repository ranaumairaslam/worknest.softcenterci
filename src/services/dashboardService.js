import { getAllProjects } from "./projectService.js";
import { getAllTeams } from "./teamService.js";
import { getAllEmployees } from "./employeeService.js";
import { getAllClients } from "./clientService.js";
import { getAllTasks, getTaskStatistics } from "./taskService.js";
import { getRevenueSummary } from "./revenueService.js";
import { getRecentActivity } from "./activityService.js";

export async function getStats() {
  const [projects, teams, employees, clients, taskStats, revenueData] = await Promise.all([
    getAllProjects(),
    getAllTeams(),
    getAllEmployees(),
    getAllClients(),
    getTaskStatistics(),
    getRevenueSummary(await getAllProjects(), await getAllClients()),
  ]);

  const activeTasks = (taskStats.find((s) => s.id === "in-progress-tasks")?.value || 0) +
    (taskStats.find((s) => s.id === "pending-tasks")?.value || 0) +
    (taskStats.find((s) => s.id === "review-tasks")?.value || 0);

  const completedTasks = taskStats.find((s) => s.id === "completed-tasks")?.value || 0;
  const pendingTasks = taskStats.find((s) => s.id === "pending-tasks")?.value || 0;

  return [
    { id: "total-projects", label: "Total Projects", value: String(projects.length), note: `${projects.filter((p) => p.status === "Active").length} active` },
    { id: "total-teams", label: "Total Teams", value: String(teams.length), note: `${teams.filter((t) => t.status === "Active").length} active` },
    { id: "total-employees", label: "Total Employees", value: String(employees.length), note: `${employees.filter((e) => e.status === "Active").length} active` },
    { id: "total-clients", label: "Total Clients", value: String(clients.length), note: `${clients.filter((c) => c.status === "Active").length} active` },
    { id: "active-tasks", label: "Active Tasks", value: String(activeTasks), note: "In progress & review" },
    { id: "completed-tasks", label: "Completed Tasks", value: String(completedTasks), note: "Finished work" },
    { id: "pending-tasks", label: "Pending Tasks", value: String(pendingTasks), note: "Requires action" },
    { id: "total-revenue", label: "Total Revenue", value: `$${(revenueData.totalRevenue / 1000).toFixed(0)}K`, note: "Company revenue" },
  ];
}

export async function getProjectProgress() {
  const projects = await getAllProjects();
  return projects
    .filter((p) => p.status !== "Completed")
    .slice(0, 6)
    .map((p) => ({
      name: p.name,
      team: p.team,
      status: p.status,
      progress: p.progress,
    }));
}

export async function getInvitations() {
  const activity = await getRecentActivity();
  return activity.slice(0, 5).map((item, index) => ({
    id: index + 1,
    primary: item.message || item.text || item.description,
  }));
}

export async function getTeamOverview() {
  const employees = await getAllEmployees();
  return employees.slice(0, 5).map((emp) => ({
    id: emp.id,
    primary: `${emp.name} (${emp.role})`,
    secondary: emp.email,
    action: emp.status,
  }));
}

export async function getRevenueOverview() {
  const [projects, clients] = await Promise.all([getAllProjects(), getAllClients()]);
  return getRevenueSummary(projects, clients);
}

export async function getDashboardSummary() {
  const [stats, projects, invitations, team, revenue] = await Promise.all([
    getStats(),
    getProjectProgress(),
    getInvitations(),
    getTeamOverview(),
    getRevenueOverview(),
  ]);

  return { stats, projects, invitations, team, revenue };
}

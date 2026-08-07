import { get } from './apiClient.js';

const DASHBOARD_ROUTE = '/company/dashboard';

async function fetchDashboardData() {
  const response = await get(DASHBOARD_ROUTE);
  return response?.data || {};
}

function buildStats(data) {
  const projects = data.projects || {};
  const teams = data.teams || {};
  const employees = data.employees || {};
  const tasks = data.tasks || {};

  return [
    { id: 'total-projects', label: 'Total Projects', value: String(projects.total_projects || 0), note: `${projects.active_projects || 0} active` },
    { id: 'total-teams', label: 'Total Teams', value: String(teams.total_teams || 0), note: 'All teams' },
    { id: 'total-employees', label: 'Total Employees', value: String(employees.total_employees || 0), note: 'All employees' },
    { id: 'total-clients', label: 'Total Clients', value: String(data.clients || 0), note: 'All clients' },
    { id: 'active-tasks', label: 'Active Tasks', value: String(tasks.active_tasks || 0), note: 'In progress' },
    { id: 'completed-tasks', label: 'Completed Tasks', value: String(tasks.completed_tasks || 0), note: 'Finished work' },
    { id: 'pending-tasks', label: 'Pending Tasks', value: String(tasks.pending_tasks || 0), note: 'Requires action' },
    { id: 'total-revenue', label: 'Total Revenue', value: `$${Number(data.total_revenue || 0).toLocaleString()}`, note: 'Company revenue' },
  ];
}

function buildProjectProgress(data) {
  return (data.project_progress || []).map((project) => ({
    name: project.project_name || 'Unknown Project',
    team: project.team_name || 'Unassigned',
    status: project.status || 'Unknown',
    progress: Number(project.progress || 0),
  }));
}

function buildRevenueOverview(data) {
  return {
    totalRevenue: Number(data.total_revenue || 0),
    revenuePerProject: data.project_progress || [],
  };
}

export async function getStats() {
  return buildStats(await fetchDashboardData());
}

export async function getProjectProgress() {
  return buildProjectProgress(await fetchDashboardData());
}

export async function getInvitations() {
  const response = await get('/company/notifications');
  return (response?.data || []).slice(0, 5).map((item, index) => ({
    id: index + 1,
    primary: item.message || item.text || item.description,
  }));
}

export async function getTeamOverview() {
  const response = await get('/company/employees', { limit: 5 });
  const employees = response?.data || [];
  return employees.slice(0, 5).map((emp) => ({
    id: emp.id,
    primary: `${emp.name} (${emp.role})`,
    secondary: emp.email,
    action: emp.status,
  }));
}

export async function getRevenueOverview() {
  return buildRevenueOverview(await fetchDashboardData());
}

export async function getDashboardSummary() {
  const [data, notifications, employees] = await Promise.all([
    fetchDashboardData(),
    get('/company/notifications'),
    get('/company/employees', { limit: 5 }),
  ]);

  return {
    stats: buildStats(data),
    projects: buildProjectProgress(data),
    invitations: (notifications?.data || []).slice(0, 5).map((item, index) => ({
      id: item.id || index + 1,
      primary: item.message || item.text || item.description || 'No recent activity',
    })),
    team: (employees?.data || []).map((employee) => ({
      id: employee.id,
      primary: `${employee.name} (${employee.role})`,
      secondary: employee.email,
      action: employee.status,
    })),
    revenue: buildRevenueOverview(data),
  };
}

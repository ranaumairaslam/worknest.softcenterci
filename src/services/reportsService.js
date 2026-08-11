import { get } from './apiClient.js';

const BASE = '/company/reports';

// =====================================================
// GET PROJECT STATUS REPORT
// =====================================================
export async function getProjectStatusReport() {
  try {
    const response = await get(`${BASE}/projects`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching project report:', error);
    return [];
  }
}

// =====================================================
// GET TEAM PERFORMANCE REPORT
// =====================================================
export async function getTeamPerformanceReport() {
  try {
    const response = await get(`${BASE}/teams`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching team report:', error);
    return [];
  }
}

// =====================================================
// GET CLIENT SUMMARY REPORT
// =====================================================
export async function getClientSummaryReport() {
  try {
    const response = await get(`${BASE}/clients`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching client report:', error);
    return [];
  }
}

// =====================================================
// GET REVENUE REPORT (with optional date range)
// =====================================================
export async function getRevenueReport(from, to) {
  try {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    
    const response = await get(`${BASE}/revenue`, params);
    return response?.data || { total_revenue: 0, total_transactions: 0, monthly_breakdown: [] };
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    return { total_revenue: 0, total_transactions: 0, monthly_breakdown: [] };
  }
}

// =====================================================
// GET EXECUTIVE SUMMARY (one combined call)
// =====================================================
export async function getExecutiveSummary() {
  try {
    const response = await get(`${BASE}/summary`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching executive summary:', error);
    return null;
  }
}

// =====================================================
// COMPATIBILITY FUNCTIONS (old dummy replacements)
// =====================================================

export async function getReportStats() {
  const summary = await getExecutiveSummary();
  if (!summary) return [];

  return [
    {
      id: 'total-projects',
      label: 'Total Projects',
      value: String(summary.projects?.total || 0),
      note: 'Active Projects',
      icon: 'ClipboardList',
      color: 'indigo',
    },
    {
      id: 'tasks-completed',
      label: 'Tasks Completed',
      value: String(summary.tasks?.completed || 0),
      note: `${summary.tasks?.total || 0} total tasks`,
      icon: 'CheckCircle2',
      color: 'emerald',
    },
    {
      id: 'active-projects',
      label: 'Active Projects',
      value: String(summary.projects?.active || 0),
      note: 'Currently running',
      icon: 'Hourglass',
      color: 'amber',
    },
    {
      id: 'teams',
      label: 'Total Teams',
      value: String(summary.teams || 0),
      note: 'Company teams',
      icon: 'Users',
      color: 'blue',
    },
  ];
}

export async function getTaskStatusBreakdown() {
  const summary = await getExecutiveSummary();
  const total = summary?.tasks?.total || 0;
  const completed = summary?.tasks?.completed || 0;
  const remaining = total - completed;

  return [
    {
      label: 'Completed',
      value: completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
      color: '#10b981',
    },
    {
      label: 'Remaining',
      value: remaining,
      percent: total ? Math.round((remaining / total) * 100) : 0,
      color: '#3b82f6',
    },
  ];
}

export async function getProjectProgress() {
  const projects = await getProjectStatusReport();
  return projects.slice(0, 5).map((p) => ({
    name: p.name,
    value: p.progress_percent || 0,
  }));
}

export async function getTeamProgress() {
  const teams = await getTeamPerformanceReport();
  return teams.slice(0, 5).map((t) => ({
    name: t.team_name,
    value:
      t.total_tasks > 0
        ? Math.round((t.completed_tasks / t.total_tasks) * 100)
        : 0,
  }));
}

export async function getRecentReports() {
  // Backend doesn't have this — return empty
  return [];
}
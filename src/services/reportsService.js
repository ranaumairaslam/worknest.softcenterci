/**
 * Return report statistics. Optional `role` parameter for filtering/auditing.
 * @param {string} [role]
 */
export async function getReportStats(role) {
  console.log("API call: getReportStats", { role });
  return [
    { id: "total-projects", label: "Total Projects", value: "8", note: "Active Projects", icon: "ClipboardList", color: "indigo" },
    { id: "tasks-completed", label: "Tasks Completed", value: "128", note: "70% of total tasks", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", value: "42", note: "23% of total tasks", icon: "Hourglass", color: "amber" },
    { id: "overdue", label: "Overdue Tasks", value: "12", note: "7% of total tasks", icon: "AlertCircle", color: "rose" },
  ];
}

export async function getTaskStatusBreakdown(role) {
  console.log("API call: getTaskStatusBreakdown", { role });
  return [
    { label: "Completed", value: 128, percent: 70, color: "#10b981" },
    { label: "In Progress", value: 42, percent: 23, color: "#3b82f6" },
    { label: "Pending", value: 12, percent: 7, color: "#f59e0b" },
    { label: "Overdue", value: 8, percent: 4, color: "#ef4444" },
  ];
}

export async function getProjectProgress(role) {
  console.log("API call: getProjectProgress", { role });
  return [
    { name: "Website Redesign", value: 82 },
    { name: "Mobile  Application", value: 68 },
    { name: "Marketing Campaign", value: 55 },
    { name: "CRM Integration", value: 34 },
    { name: "Data Dashboard", value: 25 },
  ];
}

export async function getTeamProgress(role) {
  console.log("API call: getTeamProgress", { role });
  return [
    { name: "Sophia Lee", value: 88 },
    { name: "Liam Johnson", value: 72 },
    { name: "Noah Smith", value: 65 },
    { name: "Emma Davis", value: 54 },
  ];
}

export async function getRecentReports(role) {
  console.log("API call: getRecentReports", { role });
  return [
    { id: "r1", name: "Project Progress Report", project: "Website Redesign", generatedBy: "John Leader", date: "Jun 30, 2025", isoDate: "2025-06-30", type: "Progress" },
    { id: "r2", name: "Task Summary Report", project: "Mobile App", generatedBy: "John Leader", date: "Jun 28, 2025", isoDate: "2025-06-28", type: "Summary" },
    { id: "r3", name: "Team Performance Report", project: "Marketing Campaign", generatedBy: "John Leader", date: "Jun 25, 2025", isoDate: "2025-06-25", type: "Performance" },
    { id: "r4", name: "Monthly Overview Report", project: "All Projects", generatedBy: "John Leader", date: "Jun 01, 2025", isoDate: "2025-06-01", type: "Overview" },
    { id: "r5", name: "Task Distribution Report", project: "All Projects", generatedBy: "John Leader", date: "Jun 15, 2025", isoDate: "2025-06-15", type: "Summary" },
    { id: "r6", name: "Overdue Tasks Report", project: "CRM Integration", generatedBy: "John Leader", date: "Jun 10, 2025", isoDate: "2025-06-10", type: "Overview" },
  ];
}
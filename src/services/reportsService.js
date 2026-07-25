export async function getReportStats() {
  return [
    { id: "total-projects", label: "Total Projects", value: "8", note: "Active Projects", icon: "ClipboardList", color: "indigo" },
    { id: "tasks-completed", label: "Tasks Completed", value: "128", note: "70% of total tasks", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", value: "42", note: "23% of total tasks", icon: "Hourglass", color: "amber" },
    { id: "overdue", label: "Overdue Tasks", value: "12", note: "7% of total tasks", icon: "AlertCircle", color: "rose" },
  ];
}

export async function getTaskStatusBreakdown() {
  return [
    { label: "Completed", value: 128, percent: 70, color: "#10b981" },
    { label: "In Progress", value: 42, percent: 23, color: "#3b82f6" },
    { label: "Pending", value: 12, percent: 7, color: "#f59e0b" },
    { label: "Overdue", value: 8, percent: 4, color: "#ef4444" },
  ];
}

export async function getProjectProgress() {
  return [
    { name: "Website Redesign", value: 82 },
    { name: "Mobile App", value: 68 },
    { name: "Marketing Campaign", value: 55 },
    { name: "CRM Integration", value: 34 },
    { name: "Data Dashboard", value: 25 },
  ];
}

export async function getRecentReports() {
  return [
    { id: "r1", name: "Project Progress Report", project: "Website Redesign", generatedBy: "John Leader", date: "Jun 30, 2025", type: "Progress" },
    { id: "r2", name: "Task Summary Report", project: "Mobile App", generatedBy: "John Leader", date: "Jun 28, 2025", type: "Summary" },
    { id: "r3", name: "Team Performance Report", project: "Marketing Campaign", generatedBy: "John Leader", date: "Jun 25, 2025", type: "Performance" },
    { id: "r4", name: "Monthly Overview Report", project: "All Projects", generatedBy: "John Leader", date: "Jun 01, 2025", type: "Overview" },
  ];
}
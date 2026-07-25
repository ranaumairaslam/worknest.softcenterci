export async function getProjectSummary() {
  return {
    id: "proj-1",
    name: "Website Redesign",
    status: "On Track",
    description: "Redesign and improve the company website with modern UI/UX and better performance.",
    progress: 68,
    tasksCompleted: 34,
    tasksTotal: 50,
    startDate: "May 10, 2025",
    endDate: "Aug 15, 2025",
    daysRemaining: 23,
  };
}

export async function getStats() {
  return [
    { id: "total", label: "Total Tasks", value: "50", trend: "up", trendValue: "12%", icon: "ClipboardList", color: "slate" },
    { id: "completed", label: "Completed", value: "34", trend: "up", trendValue: "15%", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", value: "8", trend: "up", trendValue: "5%", icon: "Clock", color: "blue" },
    { id: "pending", label: "Pending", value: "5", trend: "down", trendValue: "5%", icon: "Hourglass", color: "amber" },
    { id: "overdue", label: "Overdue", value: "3", trend: "down", trendValue: "25%", icon: "AlertCircle", color: "rose" },
    { id: "team", label: "Team Members", value: "12", trend: "up", trendValue: "8%", icon: "Users2", color: "indigo" },
    { id: "completion", label: "Completion", value: "68%", trend: "up", trendValue: "10%", icon: "TrendingUp", color: "cyan" },
    { id: "remaining", label: "Remaining Days", value: "23", trend: "down", trendValue: "4 days", icon: "CalendarDays", color: "orange" },
  ];
}

export async function getTimeline() {
  return [
    { id: "kickoff", label: "Kickoff", date: "May 10", state: "done" },
    { id: "design", label: "Design", date: "May 20", state: "done" },
    { id: "development", label: "Development", date: "Jun 01", state: "current" },
    { id: "testing", label: "Testing", date: "Jul 10", state: "upcoming" },
    { id: "launch", label: "Launch", date: "Aug 15", state: "upcoming" },
  ];
}

export async function getTeamPerformance() {
  return [
    { id: "m1", name: "Sophia Lee", role: "Frontend Dev", presence: "online", tasks: 12, done: 8, pending: 2, progress: 85 },
    { id: "m2", name: "Liam Johnson", role: "Backend Dev", presence: "away", tasks: 10, done: 6, pending: 4, progress: 65 },
    { id: "m3", name: "Noah Smith", role: "UI/UX Designer", presence: "online", tasks: 8, done: 6, pending: 2, progress: 75 },
    { id: "m4", name: "Emma Davis", role: "QA Engineer", presence: "offline", tasks: 6, done: 4, pending: 2, progress: 60 },
  ];
}

export async function getTaskOverview() {
  return [
    { id: "TASK-101", name: "Create Wireframes", priority: "High", status: "Completed", assignee: "SL", dueDate: "May 20, 2025", progress: 100, category: "Design" },
    { id: "TASK-102", name: "Develop Homepage", priority: "High", status: "In Progress", assignee: "LJ", dueDate: "May 28, 2025", progress: 70, category: "Development" },
    { id: "TASK-103", name: "API Integration", priority: "Medium", status: "In Progress", assignee: "NS", dueDate: "Jun 02, 2025", progress: 40, category: "Backend" },
    { id: "TASK-104", name: "Testing & Bug Fixes", priority: "High", status: "Pending", assignee: "ED", dueDate: "Jun 07, 2025", progress: 0, category: "Testing" },
    { id: "TASK-105", name: "Deployment", priority: "Low", status: "Pending", assignee: "SL", dueDate: "Jun 15, 2025", progress: 0, category: "DevOps" },
  ];
}

export async function getKanbanPreview() {
  return {
    columns: [
      { key: "backlog", title: "Backlog", count: 6, cards: ["Site Map Creation", "Competitor Analysis", "Content Strategy"] },
      { key: "todo", title: "Todo", count: 6, cards: ["Create Design System", "Landing Page Design", "Responsive Design"] },
      { key: "in_progress", title: "In Progress", count: 8, cards: ["Homepage Development", "User Dashboard Development", "API Integration"] },
      { key: "review", title: "Review", count: 4, cards: ["UI Component Review", "Code Review - Sprint 2", "Security Testing"] },
      { key: "testing", title: "Testing", count: 3, cards: ["Cross Browser Testing", "Mobile Testing", "Performance Testing"] },
      { key: "completed", title: "Completed", count: 24, cards: ["Project Kickoff", "Database Completed"] },
    ],
  };
}
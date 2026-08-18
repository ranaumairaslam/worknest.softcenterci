const PROJECTS = {
  p1: {
    id: "p1",
    name: "Website Redesign",
    status: "On Track",
    description: "Redesign and improve the company website with modern UI/UX and better performance.",
    startDate: "May 10, 2025",
    endDate: "Aug 15, 2025",
    daysRemaining: 23,
  },
  p2: {
    id: "p2",
    name: "Mobile App",
    status: "At Risk",
    description: "Build the companion mobile app for iOS and Android with feature parity to web.",
    startDate: "Apr 01, 2025",
    endDate: "Sep 30, 2025",
    daysRemaining: 61,
  },
  p3: {
    id: "p3",
    name: "CRM Integration",
    status: "On Track",
    description: "Integrate the internal CRM with the customer support and sales pipelines.",
    startDate: "Jun 01, 2025",
    endDate: "Jul 20, 2025",
    daysRemaining: 8,
  },
};

export async function getProjects() {
  return Object.values(PROJECTS).map((p) => ({ id: p.id, name: p.name }));
}

export async function getProjectSummary(projectId = "p1") {
  return PROJECTS[projectId] ?? PROJECTS.p1;
}

export async function getStats() {
  return [
    { id: "total", label: "Total Tasks", trend: "up", trendValue: "12%", icon: "ClipboardList", color: "slate" },
    { id: "completed", label: "Completed", trend: "up", trendValue: "15%", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", trend: "up", trendValue: "5%", icon: "Clock", color: "blue" },
    { id: "pending", label: "Pending", trend: "down", trendValue: "5%", icon: "Hourglass", color: "amber" },
    { id: "overdue", label: "Overdue", value: "3", trend: "down", trendValue: "25%", icon: "AlertCircle", color: "rose" },
    { id: "team", label: "Team Members", value: "12", trend: "up", trendValue: "8%", icon: "Users2", color: "indigo" },
    { id: "completion", label: "Completion", trend: "up", trendValue: "10%", icon: "TrendingUp", color: "cyan" },
    { id: "remaining", label: "Remaining Days", value: "23", trend: "down", trendValue: "4 days", icon: "CalendarDays", color: "orange" },
  ];
}

export async function getTimeline(projectId = "p1") {
  const timelines = {
    p1: [
      { id: "kickoff", label: "Kickoff", date: "May 10", state: "done" },
      { id: "design", label: "Design", date: "May 20", state: "done" },
      { id: "development", label: "Development", date: "Jun 01", state: "current" },
      { id: "testing", label: "Testing", date: "Jul 10", state: "upcoming" },
      { id: "launch", label: "Launch", date: "Aug 15", state: "upcoming" },
    ],
    p2: [
      { id: "kickoff", label: "Kickoff", date: "Apr 01", state: "done" },
      { id: "design", label: "Design", date: "Apr 20", state: "current" },
      { id: "development", label: "Development", date: "Jun 15", state: "upcoming" },
      { id: "testing", label: "Testing", date: "Aug 20", state: "upcoming" },
      { id: "launch", label: "Launch", date: "Sep 30", state: "upcoming" },
    ],
    p3: [
      { id: "kickoff", label: "Kickoff", date: "Jun 01", state: "done" },
      { id: "design", label: "Design", date: "Jun 05", state: "done" },
      { id: "development", label: "Development", date: "Jun 10", state: "done" },
      { id: "testing", label: "Testing", date: "Jul 05", state: "current" },
      { id: "launch", label: "Launch", date: "Jul 20", state: "upcoming" },
    ],
  };
  return timelines[projectId] ?? timelines.p1;
}

export async function getTeamPerformance(projectId = "p1") {
  const teams = {
    p1: [
      { id: "m1", name: "Sophia Lee", role: "Frontend Dev", presence: "online", tasks: 12, done: 8, pending: 2, progress: 85 },
      { id: "m2", name: "Liam Johnson", role: "Backend Dev", presence: "away", tasks: 10, done: 6, pending: 4, progress: 65 },
      { id: "m3", name: "Noah Smith", role: "UI/UX Designer", presence: "online", tasks: 8, done: 6, pending: 2, progress: 75 },
      { id: "m4", name: "Emma Davis", role: "QA Engineer", presence: "offline", tasks: 6, done: 4, pending: 2, progress: 60 },
    ],
    p2: [
      { id: "m5", name: "Ava Chen", role: "Mobile Dev (iOS)", presence: "online", tasks: 14, done: 5, pending: 9, progress: 36 },
      { id: "m6", name: "Ryan Patel", role: "Mobile Dev (Android)", presence: "online", tasks: 13, done: 4, pending: 9, progress: 31 },
    ],
    p3: [
      { id: "m7", name: "Maya Torres", role: "Integration Engineer", presence: "online", tasks: 9, done: 8, pending: 1, progress: 89 },
      { id: "m8", name: "Ethan Brooks", role: "Backend Dev", presence: "away", tasks: 7, done: 6, pending: 1, progress: 86 },
    ],
  };
  return teams[projectId] ?? teams.p1;
}

export async function getTaskOverview(projectId = "p1") {
  const taskSets = {
    p1: [
      { id: "TASK-101", name: "Create Wireframes", priority: "High", status: "Completed", assignee: "SL", dueDate: "May 20, 2025", progress: 100, category: "Design" },
      { id: "TASK-102", name: "Develop Homepage", priority: "High", status: "In Progress", assignee: "LJ", dueDate: "May 28, 2025", progress: 70, category: "Development" },
      { id: "TASK-103", name: "API Integration", priority: "Medium", status: "In Progress", assignee: "NS", dueDate: "Jun 02, 2025", progress: 40, category: "Backend" },
      { id: "TASK-104", name: "Testing & Bug Fixes", priority: "High", status: "Pending", assignee: "ED", dueDate: "Jun 07, 2025", progress: 0, category: "Testing" },
      { id: "TASK-105", name: "Deployment", priority: "Low", status: "Pending", assignee: "SL", dueDate: "Jun 15, 2025", progress: 0, category: "DevOps" },
    ],
    p2: [
      { id: "TASK-201", name: "iOS Login Screen", priority: "High", status: "In Progress", assignee: "AC", dueDate: "Jun 10, 2025", progress: 50, category: "Design" },
      { id: "TASK-202", name: "Android Login Screen", priority: "High", status: "Pending", assignee: "RP", dueDate: "Jun 12, 2025", progress: 0, category: "Design" },
      { id: "TASK-203", name: "Push Notifications", priority: "Medium", status: "Pending", assignee: "AC", dueDate: "Jul 01, 2025", progress: 0, category: "Backend" },
    ],
    p3: [
      { id: "TASK-301", name: "CRM API Mapping", priority: "High", status: "Completed", assignee: "MT", dueDate: "Jun 15, 2025", progress: 100, category: "Backend" },
      { id: "TASK-302", name: "Data Sync Job", priority: "Medium", status: "Completed", assignee: "EB", dueDate: "Jun 20, 2025", progress: 100, category: "Backend" },
      { id: "TASK-303", name: "Support Ticket Sync", priority: "Low", status: "In Progress", assignee: "MT", dueDate: "Jul 05, 2025", progress: 60, category: "Integration" },
    ],
  };
  return taskSets[projectId] ?? taskSets.p1;
}

export async function getKanbanPreview(projectId = "p1") {
  const boards = {
    p1: {
      columns: [
        { key: "backlog", title: "Backlog", count: 6, cards: ["Site Map Creation", "Competitor Analysis", "Content Strategy"] },
        { key: "todo", title: "Todo", count: 6, cards: ["Create Design System", "Landing Page Design", "Responsive Design"] },
        { key: "in_progress", title: "In Progress", count: 8, cards: ["Homepage Development", "User Dashboard Development", "API Integration"] },
        { key: "review", title: "Review", count: 4, cards: ["UI Component Review", "Code Review - Sprint 2", "Security Testing"] },
        { key: "testing", title: "Testing", count: 3, cards: ["Cross Browser Testing", "Mobile Testing", "Performance Testing"] },
        { key: "completed", title: "Completed", count: 24, cards: ["Project Kickoff", "Database Completed"] },
      ],
    },
    p2: {
      columns: [
        { key: "backlog", title: "Backlog", count: 3, cards: ["App Store Assets", "Privacy Policy"] },
        { key: "todo", title: "Todo", count: 5, cards: ["Push Notifications", "Onboarding Flow"] },
        { key: "in_progress", title: "In Progress", count: 4, cards: ["iOS Login Screen", "Android Login Screen"] },
        { key: "review", title: "Review", count: 1, cards: ["Design QA"] },
        { key: "testing", title: "Testing", count: 0, cards: [] },
        { key: "completed", title: "Completed", count: 2, cards: ["Kickoff", "Wireframes"] },
      ],
    },
    p3: {
      columns: [
        { key: "backlog", title: "Backlog", count: 1, cards: ["Legacy System Audit"] },
        { key: "todo", title: "Todo", count: 2, cards: ["Support Ticket Sync"] },
        { key: "in_progress", title: "In Progress", count: 1, cards: ["Support Ticket Sync"] },
        { key: "review", title: "Review", count: 0, cards: [] },
        { key: "testing", title: "Testing", count: 1, cards: ["Data Validation"] },
        { key: "completed", title: "Completed", count: 5, cards: ["CRM API Mapping", "Data Sync Job"] },
      ],
    },
  };
  return boards[projectId] ?? boards.p1;
}
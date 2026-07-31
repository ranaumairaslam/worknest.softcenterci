let projects = [
  {
    id: "p1",
    name: "Alpha Platform Rebrand",
    description: "Modernize the company website with a new design and improved user experience.",
    leader: "Sarah Khan",
    team: "Web Development",
    members: 8,
    progress: 72,
    status: "Active",
    priority: "High",
    dueDate: "31 Aug 2026",
    completedTasks: 18,
    totalTasks: 25,
    color: "bg-cyan-500",
    revenue: 85000,
  },
  {
    id: "p2",
    name: "CRM Dashboard",
    description: "Develop an analytics dashboard for customer relationship management.",
    leader: "Ahmed Ali",
    team: "Backend Team",
    members: 6,
    progress: 94,
    status: "Review",
    priority: "Medium",
    dueDate: "28 Jul 2026",
    completedTasks: 32,
    totalTasks: 34,
    color: "bg-emerald-500",
    revenue: 120000,
  },
  {
    id: "p3",
    name: "HR Management System",
    description: "Build an employee management and payroll solution.",
    leader: "Bilal Ahmed",
    team: "HR Team",
    members: 5,
    progress: 43,
    status: "In Progress",
    priority: "High",
    dueDate: "15 Sep 2026",
    completedTasks: 9,
    totalTasks: 21,
    color: "bg-orange-500",
    revenue: 65000,
  },
  {
    id: "p4",
    name: "Inventory System",
    description: "Centralize inventory and warehouse management.",
    leader: "Areeba Noor",
    team: "ERP Team",
    members: 7,
    progress: 88,
    status: "Active",
    priority: "Low",
    dueDate: "20 Aug 2026",
    completedTasks: 22,
    totalTasks: 25,
    color: "bg-violet-500",
    revenue: 95000,
  },
  {
    id: "p5",
    name: "Mobile Banking App",
    description: "Cross-platform banking application with secure authentication.",
    leader: "Usman Tariq",
    team: "Mobile Team",
    members: 10,
    progress: 61,
    status: "In Progress",
    priority: "High",
    dueDate: "10 Oct 2026",
    completedTasks: 17,
    totalTasks: 28,
    color: "bg-pink-500",
    revenue: 150000,
  },
  {
    id: "p6",
    name: "AI Recommendation Engine",
    description: "Machine learning powered recommendation system.",
    leader: "Waleed Hassan",
    team: "AI Team",
    members: 5,
    progress: 38,
    status: "Planning",
    priority: "High",
    dueDate: "25 Oct 2026",
    completedTasks: 5,
    totalTasks: 18,
    color: "bg-indigo-500",
    revenue: 110000,
  },
  {
    id: "p7",
    name: "Finance Portal",
    description: "Company expense tracking and finance management.",
    leader: "Hamza Khan",
    team: "Finance Team",
    members: 4,
    progress: 97,
    status: "Completed",
    priority: "Medium",
    dueDate: "12 Jul 2026",
    completedTasks: 40,
    totalTasks: 40,
    color: "bg-green-500",
    revenue: 78000,
  },
  {
    id: "p8",
    name: "Customer Support Portal",
    description: "Ticketing and customer complaint management platform.",
    leader: "Zain Ahmed",
    team: "Support Team",
    members: 6,
    progress: 79,
    status: "Active",
    priority: "Medium",
    dueDate: "18 Aug 2026",
    completedTasks: 19,
    totalTasks: 24,
    color: "bg-sky-500",
    revenue: 62000,
  },
];

export async function getAllProjects() {
  return projects.map((p) => ({ ...p }));
}

export async function getProjectById(id) {
  return projects.find((p) => p.id === id) || null;
}

export async function createProject(payload) {
  const newProject = {
    id: `p${Date.now()}`,
    name: payload.name,
    description: payload.description || "",
    leader: payload.leader || "Unassigned",
    team: payload.team || "Unassigned",
    members: payload.members || 0,
    progress: payload.progress || 0,
    status: payload.status || "Planning",
    priority: payload.priority || "Medium",
    dueDate: payload.dueDate || "TBD",
    completedTasks: payload.completedTasks || 0,
    totalTasks: payload.totalTasks || 0,
    color: payload.color || "bg-cyan-500",
    revenue: payload.revenue || 0,
  };

  projects.push(newProject);
  return { ...newProject };
}

export async function updateProject(id, updates) {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  projects[index] = { ...projects[index], ...updates };
  return { ...projects[index] };
}

export async function deleteProject(id) {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;

  projects.splice(index, 1);
  return true;
}

export async function markProjectCompleted(id) {
  return updateProject(id, { status: "Completed", progress: 100 });
}

export async function assignProjectLeader(id, leaderName) {
  return updateProject(id, { leader: leaderName });
}

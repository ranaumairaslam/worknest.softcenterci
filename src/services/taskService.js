let tasks = [
  {
    id: "t1",
    name: "API Documentation",
    project: "Alpha Platform Rebrand",
    priority: "High",
    status: "Pending",
    dueDate: "2026-07-28",
    assignee: "Sarah Khan",
    progress: 0,
  },
  {
    id: "t2",
    name: "Homepage Wireframe",
    project: "CRM Dashboard",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-07-30",
    assignee: "Areeba Noor",
    progress: 45,
  },
  {
    id: "t3",
    name: "Backend API Integration",
    project: "AI Recommendation Engine",
    priority: "High",
    status: "Under Review",
    dueDate: "2026-07-29",
    assignee: "Ahmed Ali",
    progress: 85,
  },
  {
    id: "t4",
    name: "Payroll System Testing",
    project: "HR Management System",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-07-25",
    assignee: "Bilal Ahmed",
    progress: 100,
  },
  {
    id: "t5",
    name: "Client Review Prep",
    project: "Finance Portal",
    priority: "Medium",
    status: "Rejected",
    dueDate: "2026-07-24",
    assignee: "Zain Ahmed",
    progress: 20,
  },
];

export async function getAllTasks() {
  return tasks.map((task) => ({ ...task }));
}

export async function getTaskById(id) {
  return tasks.find((task) => task.id === id) || null;
}

export async function createTask(payload) {
  const newTask = {
    id: `t${Date.now()}`,
    name: payload.name,
    project: payload.project || "Unassigned",
    priority: payload.priority || "Medium",
    status: payload.status || "Pending",
    dueDate: payload.dueDate || "TBD",
    assignee: payload.assignee || "Unassigned",
    progress: payload.progress || 0,
  };

  tasks.push(newTask);
  return { ...newTask };
}

export async function updateTask(id, updates) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  tasks[index] = {
    ...tasks[index],
    ...updates,
  };

  return { ...tasks[index] };
}

export async function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

export async function getTasksByStatus(status) {
  if (status === "All") return getAllTasks();
  return tasks.filter((task) => task.status === status).map((task) => ({ ...task }));
}

export async function getTaskStatistics() {
  const counts = tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  return [
    { id: "total-tasks", label: "Total Tasks", value: counts.total, note: "Updated live" },
    { id: "pending-tasks", label: "Pending Tasks", value: counts.Pending || 0, note: "Requires action" },
    { id: "in-progress-tasks", label: "In Progress", value: counts["In Progress"] || 0, note: "On track" },
    { id: "review-tasks", label: "Under Review", value: counts["Under Review"] || 0, note: "Needs approval" },
    { id: "completed-tasks", label: "Completed Tasks", value: counts.Completed || 0, note: "Finished work" },
    { id: "rejected-tasks", label: "Rejected Tasks", value: counts.Rejected || 0, note: "Needs rework" },
  ];
}

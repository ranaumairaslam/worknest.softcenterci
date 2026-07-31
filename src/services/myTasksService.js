export async function getTaskStats() {
  // Kept for reference/fallback — the hook now derives live stats
  // from the actual task list instead of using these fixed numbers.
  return [
    { id: "total", label: "Total Tasks", icon: "ClipboardList", color: "indigo" },
    { id: "completed", label: "Completed", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", icon: "Clock", color: "amber" },
    { id: "todo", label: "To Do", icon: "CalendarDays", color: "rose" },
  ];
}

export async function getMyTasks() {
  return [
    { id: "t1", name: "Design homepage layout", project: "Website Redesign", priority: "High", status: "In Progress", dueDate: "2026-07-24" },
    { id: "t2", name: "Implement user authentication", project: "Web App Development", priority: "High", status: "In Progress", dueDate: "2026-07-25" },
    { id: "t3", name: "Fix dashboard responsive issues", project: "Dashboard Project", priority: "Medium", status: "To Do", dueDate: "2026-07-26" },
    { id: "t4", name: "API integration for projects", project: "Web App Development", priority: "High", status: "In Progress", dueDate: "2026-07-27" },
    { id: "t5", name: "Write unit tests", project: "Web App Development", priority: "Medium", status: "To Do", dueDate: "2026-07-15" },
    { id: "t6", name: "Update project documentation", project: "Dashboard Project", priority: "Low", status: "Completed", dueDate: "2026-07-20" },
    { id: "t7", name: "Bug fixes in task module", project: "Dashboard Project", priority: "High", status: "Completed", dueDate: "2026-07-19" },
    { id: "t8", name: "Team meeting and feedback", project: "General", priority: "Low", status: "Completed", dueDate: "2026-07-18" },
  ];
}

export async function updateTaskStatus(taskId, status, role) {
  console.log("API call: update task status", { taskId, status, role });
  return { taskId, status, role };
}

export async function createTask(task, role) {
  console.log("API call: create my-task", { task, role });
  return { ...task, id: `t${Date.now()}`, role: role || undefined };
}

export async function deleteTask(taskId, role) {
  console.log("API call: delete my-task", { taskId, role });
  return { taskId, deleted: true, role };
}
export async function getTaskStats() {
  return [
    { id: "total", label: "Total Tasks", value: "18", note: "All assigned tasks", icon: "ClipboardList", color: "indigo" },
    { id: "completed", label: "Completed", value: "7", note: "Tasks completed", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", value: "6", note: "Tasks in progress", icon: "Clock", color: "amber" },
    { id: "todo", label: "To Do", value: "5", note: "Tasks to do", icon: "CalendarDays", color: "rose" },
  ];
}

export async function getMyTasks() {
  return [
    { id: "t1", name: "Design homepage layout", project: "Website Redesign", priority: "High", status: "In Progress", dueDate: "Jul 24, 2026" },
    { id: "t2", name: "Implement user authentication", project: "Web App Development", priority: "High", status: "In Progress", dueDate: "Jul 25, 2026" },
    { id: "t3", name: "Fix dashboard responsive issues", project: "Dashboard Project", priority: "Medium", status: "To Do", dueDate: "Jul 26, 2026" },
    { id: "t4", name: "API integration for projects", project: "Web App Development", priority: "High", status: "In Progress", dueDate: "Jul 27, 2026" },
    { id: "t5", name: "Write unit tests", project: "Web App Development", priority: "Medium", status: "To Do", dueDate: "Jul 28, 2026" },
    { id: "t6", name: "Update project documentation", project: "Dashboard Project", priority: "Low", status: "Completed", dueDate: "Jul 20, 2026" },
    { id: "t7", name: "Bug fixes in task module", project: "Dashboard Project", priority: "High", status: "Completed", dueDate: "Jul 19, 2026" },
    { id: "t8", name: "Team meeting and feedback", project: "General", priority: "Low", status: "Completed", dueDate: "Jul 18, 2026" },
  ];
}
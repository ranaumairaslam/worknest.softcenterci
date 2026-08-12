import {
  getTeamLeaderProjects,
  getTeamLeaderMembers,
  getTeamLeaderTasks,
  getTeamLeaderProgress,
  getTeamLeaderReports,
} from "./teamLeaderService";

function normalizeStatus(status) {
  if (!status) return "Pending";
  const map = {
    todo: "Pending",
    in_progress: "In Progress",
    under_review: "In Progress",
    submitted: "In Progress",
    done: "Completed",
    blocked: "Pending",
  };
  return map[status] || "Pending";
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function getProjects() {
  const projects = await getTeamLeaderProjects();
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status || "Active",
  }));
}

export async function getProjectSummary(projectId = null) {
  const projects = await getTeamLeaderProjects();
  const selected = projects.find((project) => String(project.id) === String(projectId)) || projects[0];

  if (!selected) {
    return {
      id: projectId || "team-leader-project",
      name: "Team Leader Project",
      status: "Active",
      description: "Project data is loading from the team leader API.",
      startDate: "—",
      endDate: "—",
      progress: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
      daysRemaining: 0,
    };
  }

  const tasks = await getTeamLeaderTasks({ projectId: selected.id });
  const total = tasks.length;
  const done = tasks.filter((task) => task.status === "done").length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  return {
    id: selected.id,
    name: selected.name,
    status: selected.status || "Active",
    description: selected.description || "Team project overview",
    startDate: formatDate(selected.startDate || selected.start_date),
    endDate: formatDate(selected.dueDate || selected.due_date),
    progress,
    tasksCompleted: done,
    tasksTotal: total,
    daysRemaining: 0,
  };
}

export async function getStats(projectId = null) {
  const progress = await getTeamLeaderProgress();
  const teamData = await getTeamLeaderProjects();
  const teamMembers = await getTeamLeaderMembers();

  return [
    { id: "total", label: "Total Tasks", value: String(progress[0]?.value ?? 0), trend: "up", trendValue: "Live", icon: "ClipboardList", color: "slate" },
    { id: "completed", label: "Completed", value: String(progress[1]?.value ?? 0), trend: "up", trendValue: "Live", icon: "CheckCircle2", color: "emerald" },
    { id: "in-progress", label: "In Progress", value: String(progress[2]?.value ?? 0), trend: "up", trendValue: "Live", icon: "Clock", color: "blue" },
    { id: "pending", label: "Pending", value: String(progress[3]?.value ?? 0), trend: "down", trendValue: "Team", icon: "Hourglass", color: "amber" },
    { id: "blocked", label: "Blocked", value: String(progress[4]?.value ?? 0), trend: "down", trendValue: "Needs review", icon: "AlertCircle", color: "rose" },
    { id: "team", label: "Team Members", value: String(teamMembers.length || teamData.length || 0), trend: "up", trendValue: "Active", icon: "Users2", color: "indigo" },
  ];
}

export async function getTimeline(projectId = null) {
  const project = await getProjectSummary(projectId);
  const phases = [
    { id: "kickoff", label: "Kickoff", date: project.startDate || "Today", state: "done" },
    { id: "execution", label: "Execution", date: "Current", state: "current" },
    { id: "review", label: "Review", date: project.endDate || "Review", state: "upcoming" },
    { id: "delivery", label: "Delivery", date: project.endDate || "Delivery", state: "upcoming" },
  ];
  return phases;
}

export async function getTeamPerformance(projectId = null) {
  const teamMembers = await getTeamLeaderMembers();
  const tasks = await getTeamLeaderTasks(projectId ? { projectId } : {});

  return teamMembers.map((member, index) => {
    const memberTasks = tasks.filter((task) => task.assignee === member.name);
    const done = memberTasks.filter((task) => task.status === "done").length;
    const pending = memberTasks.filter((task) => task.status !== "done").length;
    const progress = memberTasks.length ? Math.round((done / memberTasks.length) * 100) : 0;

    return {
      id: member.id,
      name: member.name,
      role: member.role || "Team Member",
      presence: ["online", "away", "offline"][index % 3],
      tasks: memberTasks.length,
      done,
      pending,
      progress,
    };
  });
}

export async function getTaskOverview(projectId = null) {
  const tasks = await getTeamLeaderTasks(projectId ? { projectId } : {});
  return tasks.map((task) => ({
    id: task.id,
    name: task.title,
    priority: task.priority || "Medium",
    status: normalizeStatus(task.status),
    assignee: task.assignee || "Unassigned",
    dueDate: formatDate(task.dueDate),
    progress: task.progress || 0,
    category: task.projectName || "Team task",
  }));
}

export async function getKanbanPreview(projectId = null) {
  const tasks = await getTaskOverview(projectId);
  const grouped = {
    todo: { key: "todo", title: "To Do", cards: [] },
    in_progress: { key: "in_progress", title: "In Progress", cards: [] },
    review: { key: "review", title: "Review", cards: [] },
    completed: { key: "completed", title: "Completed", cards: [] },
  };

  tasks.forEach((task) => {
    const bucket = task.status === "Completed" ? "completed" : task.status === "In Progress" ? "in_progress" : task.status === "Pending" ? "todo" : "review";
    grouped[bucket].cards.push(task.name);
  });

  return {
    columns: Object.values(grouped).map((column) => ({
      ...column,
      count: column.cards.length,
    })),
  };
}

export async function getTeamLeaderReportSummary() {
  const summary = await getTeamLeaderReports();
  return summary;
}
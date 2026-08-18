// src/services/projectOversightService.js
import { get, post } from "./apiClient.js";

const BASE = "/team-leader";

// ============ HELPERS ============

function getInitials(name = "?") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(from, to) {
  if (!from || !to) return 0;
  const start = new Date(from);
  const end = new Date(to);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

// Map backend status → frontend display
function mapTaskStatus(status) {
  const map = {
    todo: "Pending",
    in_progress: "In Progress",
    submitted: "In Progress",
    under_review: "In Progress",
    done: "Completed",
    blocked: "Pending",
  };
  return map[status] || "Pending";
}

// Task status → progress percentage
function statusToProgress(status) {
  const map = {
    todo: 0,
    in_progress: 50,
    submitted: 85,
    under_review: 85,
    done: 100,
    blocked: 20,
  };
  return map[status] || 0;
}

function mapPriority(priority) {
  if (!priority) return "Medium";
  const p = String(priority).toLowerCase();
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function mapProjectStatus(status) {
  const map = {
    pending: "On Track",
    active: "On Track",
    in_progress: "On Track",
    completed: "Completed",
    on_hold: "At Risk",
    blocked: "At Risk",
  };
  return map[String(status).toLowerCase()] || "On Track";
}

// ============ PROJECTS LIST ============
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
  try {
    const res = await get(`${BASE}/projects`);
    return (res?.data || []).map((p) => ({
      id: p.id,
      name: p.name,
    }));
  } catch (err) {
    console.error("getProjects error:", err);
    return [];
  }
}

// ============ PROJECT SUMMARY ============
  const projects = await getTeamLeaderProjects();
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status || "Active",
  }));
}

export async function getProjectSummary(projectId) {
  try {
    const res = await get(`${BASE}/projects`);
    const projects = res?.data || [];
    const project = projects.find((p) => String(p.id) === String(projectId));

    if (!project) {
      return {
        id: projectId,
        name: "Unknown Project",
        status: "On Track",
        description: "",
        startDate: "TBD",
        endDate: "TBD",
        daysRemaining: 0,
        progress: 0,
        tasksCompleted: 0,
        tasksTotal: 0,
      };
    }

    // Get tasks for this project to compute progress
    const tasksRes = await get(`${BASE}/tasks`, {
      projectId: project.id,
      limit: 100,
    });
    const tasks = tasksRes?.data || [];
    const completed = tasks.filter((t) => t.status === "done").length;
    const total = tasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: project.id,
      name: project.name,
      status: mapProjectStatus(project.status),
      description: project.description || "No description available.",
      startDate: formatDate(project.start_date),
      endDate: formatDate(project.due_date),
      daysRemaining: daysBetween(new Date(), project.due_date),
      progress,
      tasksCompleted: completed,
      tasksTotal: total,
    };
  } catch (err) {
    console.error("getProjectSummary error:", err);
    return {
      id: projectId,
      name: "Error loading",
      status: "On Track",
      description: "",
      startDate: "TBD",
      endDate: "TBD",
      daysRemaining: 0,
      progress: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
    };
  }
}

// ============ STATS ============
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

export async function getStats() {
  try {
    const res = await get(`${BASE}/progress`);
    const stats = res?.data || {};
    return [
      {
        id: "total",
        label: "Total Tasks",
        value: String(stats.total_tasks || 0),
        icon: "ClipboardList",
        color: "slate",
      },
      {
        id: "completed",
        label: "Completed",
        value: String(stats.completed_tasks || 0),
        icon: "CheckCircle2",
        color: "emerald",
      },
      {
        id: "in-progress",
        label: "In Progress",
        value: String(stats.in_progress_tasks || 0),
        icon: "Clock",
        color: "blue",
      },
      {
        id: "pending",
        label: "Pending",
        value: String(stats.pending_tasks || 0),
        icon: "Hourglass",
        color: "amber",
      },
    ];
  } catch (err) {
    console.error("getStats error:", err);
    return [];
  }
}

// ============ TIMELINE (Not in backend — return empty or basic) ============

export async function getTimeline(projectId) {
  // Backend has no timeline endpoint for team_leader yet
  // Return empty or basic milestones for now
  return [];
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

// ============ TEAM PERFORMANCE ============

export async function getTeamPerformance(projectId) {
  try {
    const [membersRes, tasksRes] = await Promise.all([
      get(`${BASE}/team-members`),
      get(`${BASE}/tasks`, { projectId, limit: 200 }),
    ]);

    const members = (membersRes?.data || []).filter(
      (m) => m.role === "team_member"
    );
    const tasks = tasksRes?.data || [];

    return members.map((m) => {
      const memberTasks = tasks.filter(
        (t) => String(t.assignee_id) === String(m.id)
      );
      const done = memberTasks.filter((t) => t.status === "done").length;
      const pending = memberTasks.length - done;
      const progress =
        memberTasks.length > 0
          ? Math.round((done / memberTasks.length) * 100)
          : 0;

      return {
        id: m.id,
        name: m.name,
        role: "Team Member",
        presence: m.status === "active" ? "online" : "offline",
        tasks: memberTasks.length,
        done,
        pending,
        progress,
      };
    });
  } catch (err) {
    console.error("getTeamPerformance error:", err);
    return [];
  }
}

// ============ TASK OVERVIEW ============
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

export async function getTaskOverview(projectId) {
  try {
    const res = await get(`${BASE}/tasks`, { projectId, limit: 100 });
    const tasks = res?.data || [];

    return tasks.map((t) => ({
      id: `TASK-${t.id}`,
      rawId: t.id,
      name: t.title,
      priority: mapPriority(t.priority),
      status: mapTaskStatus(t.status),
      assignee: getInitials(t.assignee_name || "?"),
      assigneeName: t.assignee_name || "Unassigned",
      assigneeId: t.assignee_id,
      dueDate: formatDate(t.due_date),
      progress: statusToProgress(t.status),
      category: t.project_name || "General",
      projectId: t.project_id,
      raw: t,
    }));
  } catch (err) {
    console.error("getTaskOverview error:", err);
    return [];
  }
}

// ============ KANBAN PREVIEW ============
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

export async function getKanbanPreview(projectId) {
  try {
    const res = await get(`${BASE}/tasks`, { projectId, limit: 100 });
    const tasks = res?.data || [];

    const columns = [
      { key: "todo", title: "To Do" },
      { key: "in_progress", title: "In Progress" },
      { key: "submitted", title: "Under Review" },
      { key: "done", title: "Completed" },
      { key: "blocked", title: "Blocked" },
    ];

    return {
      columns: columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return {
          key: col.key,
          title: col.title,
          count: colTasks.length,
          cards: colTasks.map((t) => t.title),
        };
      }),
    };
  } catch (err) {
    console.error("getKanbanPreview error:", err);
    return { columns: [] };
  }
}
// ============ CREATE TASK ============

const PRIORITY_TO_BACKEND = {
  High: "high",
  Medium: "medium",
  Low: "low",
};
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

export async function createTask(payload) {
  try {
    const body = {
      title: payload.name || payload.title,
      description: payload.description || "",
      projectId: Number(payload.projectId),
      assigneeId: payload.assigneeId ? Number(payload.assigneeId) : null,
      dueDate:
        payload.dueDate && payload.dueDate !== "TBD" ? payload.dueDate : null,
      priority: PRIORITY_TO_BACKEND[payload.priority] || "medium",
    };

    console.log("📤 Creating task:", body);

    const res = await post("/team-leader/tasks", body);
    const task = res?.data;

    if (!task) throw new Error("No data returned from server");

    return {
      id: `TASK-${task.id}`,
      rawId: task.id,
      name: task.title,
      priority: payload.priority,
      status: "Pending",
      assignee: payload.assigneeName
        ? payload.assigneeName
            .split(" ")
            .map((n) => n[0])
            .join("")
        : "?",
      assigneeId: task.assignee_id,
      dueDate: payload.dueDate || "TBD",
      progress: 0,
      category: "New",
      projectId: task.project_id,
    };
  } catch (err) {
    console.error("createTask error:", err);
    throw err;
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
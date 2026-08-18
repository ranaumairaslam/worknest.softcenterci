// src/services/projectLeaderService.js
import { get,  put } from "./apiClient.js";
import { createProject as createCanonicalProject } from "./projectService";
import { getActor } from "./authContext";

const BASE = "/team-leader";

// ============ HELPERS ============

function mapStatusToKanban(status) {
  const map = {
    todo: "todo",
    in_progress: "in_progress",
    submitted: "under_review",
    under_review: "under_review",
    done: "completed",
    blocked: "in_progress",
  };
  return map[status] || "todo";
}

function getInitials(name = "?") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapTaskForLeader(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: mapStatusToKanban(task.status),
    priority: task.priority,
    dueDate: task.due_date,
    projectId: task.project_id,
    projectName: task.project_name,
    assigneeId: task.assignee_id,
    assignee: {
      name: task.assignee_name || "Unassigned",
      avatar: getInitials(task.assignee_name || "?"),
    },
    raw: task,
  };
}

function mapMember(m) {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    avatar: getInitials(m.name),
  };
}

function mapProject(p) {
  return {
    id: p.id,
    name: p.name,
    status: p.status,
    startDate: p.start_date,
    dueDate: p.due_date,
    taskCount: p.task_count || 0,
    members: 0,
    memberIds: [],
    createdAt: p.created_at,
  };
}

// ============ DASHBOARD ============

export async function getDashboardData() {
  try {
    const res = await get(`${BASE}/dashboard`);
    const data = res?.data || {};
    return {
      team: data.team,
      stats: data.stats || {},
      projects: (data.projects || []).map(mapProject),
      // ✅ Filter: only team_member role
      members: (data.members || [])
        .filter((m) => m.role === "team_member")
        .map(mapMember),
      recentTasks: (data.recentTasks || []).map(mapTaskForLeader),
    };
  } catch (err) {
    console.error("Dashboard error:", err);
    throw err;
  }
}
// ============ PROJECTS ============

export async function getProjects() {
  try {
    const res = await get(`${BASE}/projects`);
    return (res?.data || []).map(mapProject);
  } catch (err) {
    console.error("Projects error:", err);
    return [];
  }
}

// ============ TASKS ============

export async function getProjectTasks(projectId) {
  try {
    const res = await get(`${BASE}/tasks`, { projectId, limit: 100 });
    return (res?.data || []).map(mapTaskForLeader);
  } catch (err) {
    console.error("Tasks error:", err);
    return [];
  }
}

// ============ DELIVERABLES ============

export async function getPendingDeliverables(projectId) {
  try {
    const res = await get(`${BASE}/tasks/submitted`);
    const items = (res?.data || []).map((t) => ({
      id: `d-${t.id}`,
      taskId: t.id,
      title: t.title,
      description: t.description,
      projectId: t.project_id,
      member: {
        name: t.assignee_name || "Unknown",
        avatar: getInitials(t.assignee_name || "?"),
      },
      project: t.project_name,
      submittedAt: t.created_at,
      fileLabel: "Attached files",
      linkLabel: "View files",
      url: "#",
    }));
    // Filter to selected project if provided
    if (projectId) {
      return items.filter((i) => String(i.projectId) === String(projectId));
    }
    return items;
  } catch (err) {
    console.error("Deliverables error:", err);
    return [];
  }
}

export async function approveDeliverable(id, comment = "") {
  const taskId = String(id).replace(/^d-/, "");
  const res = await put(`${BASE}/tasks/${taskId}/approve`, { comment });
  return { id, status: "approved", ...res?.data };
}

export async function rejectDeliverable(id, comment = "") {
  const taskId = String(id).replace(/^d-/, "");
  const res = await put(`${BASE}/tasks/${taskId}/revision`, {
    reviewNote: comment,
  });
  return { id, status: "rejected", ...res?.data };
}

// ============ TEAM MEMBERS ============

export async function getTeamMembers() {
  try {
    const res = await get(`${BASE}/team-members`);
    const members = res?.data || [];
    // ✅ Filter: only team_member role (exclude leaders)
    return members
      .filter((m) => m.role === "team_member")
      .map(mapMember);
  } catch (err) {
    console.error("Team members error:", err);
    return [];
  }
}


// ============ REASSIGN ============

export async function reassignTask(taskId, memberId) {
  const res = await put(`${BASE}/tasks/${taskId}/assign`, {
    assignedTo: memberId,
  });
  return res?.data;
}

// ============ TASK PRIORITY UPDATE ============

export async function updateTaskPriority(taskId, priority) {
  const res = await put(`${BASE}/tasks/${taskId}/priority`, { priority });
  return res?.data;
}

// ============ STATS ============

export async function getTeamProgressStats() {
  try {
    const res = await get(`${BASE}/progress`);
    const stats = res?.data || {};
    return [
      {
        id: "team-members",
        label: "Team Members",
        value: String(stats.total_members || 0),
        note: "Active",
      },
      {
        id: "in-progress",
        label: "Tasks in Progress",
        value: String(stats.in_progress_tasks || 0),
        note: "Ongoing",
      },
      {
        id: "overdue",
        label: "Blocked Tasks",
        value: String(stats.blocked_tasks || 0),
        note: "Needs attention",
      },
      {
        id: "completion",
        label: "Completed",
        value: String(stats.completed_tasks || 0),
        note: "Total done",
      },
    ];
  } catch (err) {
    console.error("Stats error:", err);
    return [];
  }
}

// ============ CREATE PROJECT ============

export async function createProject(project, role) {
  return createCanonicalProject(project, getActor(role));
}
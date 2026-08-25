import { get, post } from "./apiClient.js";

// =====================================================
// STATUS MAP
// =====================================================
const STATUS_MAP = {
  todo: "todo",
  pending: "todo",
  in_progress: "in_progress",
  under_review: "under_review",
  done: "completed",
  completed: "completed",
  blocked: "in_progress",

  // Capitalized / label variants
  Pending: "todo",
  "To Do": "todo",
  "In Progress": "in_progress",
  Review: "under_review",
  "Under Review": "under_review",
  Completed: "completed",
  Done: "completed",
  Rejected: "in_progress",
};

// =====================================================
// HELPERS
// =====================================================
function getInitials(name) {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Backend har endpoint pe alag shape bhejta hai:
 *  - team-member API : assigneeName / assigneeId   (flat)
 *  - team-leader API : assignedTo { id, name }     (nested)
 * Ye function dono ko handle karta hai.
 */
function resolveAssignee(task) {
  const name =
    task.assigneeName ||
    task.assignee_name ||
    task.assignedTo?.name ||
    task.assignedTo?.fullName ||
    task.assigned_to?.name ||
    task.assignee?.name ||
    task.user?.name ||
    (typeof task.assignee === "string" ? task.assignee : null) ||
    null;

  const id =
    task.assigneeId ??
    task.assignee_id ??
    task.assignedTo?.id ??
    task.assignedTo?._id ??
    task.assigned_to?.id ??
    task.assignee?.id ??
    task.user?.id ??
    null;

  return { id, name };
}

function resolveProject(task) {
  const name =
    task.projectName ||
    task.project_name ||
    task.project?.name ||
    (typeof task.project === "string" ? task.project : null) ||
    "Unknown Project";

  const id =
    task.projectId ??
    task.project_id ??
    task.project?.id ??
    null;

  return { id, name };
}

// =====================================================
// TASK MAPPER  (Kanban ready)
// =====================================================
function mapTaskForKanban(task) {
  const assignee = resolveAssignee(task);
  const project = resolveProject(task);

  const displayName = assignee.name || "Unassigned";
  const initials = assignee.name ? getInitials(assignee.name) : "U";

  return {
    // keep everything original (nothing lost)
    ...task,

    // ---- IDs ----
    id: task.taskId ?? task.id,
    taskId: task.taskId ?? task.id,

    // ---- Basic ----
    title: task.title || task.name || "Untitled Task",
    description: task.description || "",
    priority: task.priority || "medium",
    dueDate: task.dueDate ?? task.due_date ?? null,
    createdAt: task.createdAt ?? null,
    updatedAt: task.updatedAt ?? null,

    // ---- Status ----
    status: STATUS_MAP[task.status] || "todo",
    rawStatus: task.status,

    // ---- Project (flat + nested aliases) ----
    project: project.name,
    projectName: project.name,
    projectId: project.id,

    // ---- Assignee (flat) ----
    assigneeId: assignee.id,
    assigneeName: assignee.name, // null if truly unassigned

    // ---- Assignee (nested aliases so ANY UI key works) ----
    assignee: {
      id: assignee.id,
      name: displayName,
      avatar: initials,
      initials,
    },

    assignedTo: assignee.name
      ? { id: assignee.id, name: assignee.name, avatar: initials }
      : null,

    // ---- Convenience for direct render ----
    assigneeDisplayName: displayName,
    assigneeInitials: initials,
  };
}

// =====================================================
// GET MY ASSIGNED TASKS
// =====================================================
export async function getMyTasks() {
  try {
    const response = await get("/team-member/tasks/assigned", { limit: 100 });
    const tasks = response?.data || [];

    console.log("📥 RAW MY TASKS:", tasks);

    const mapped = tasks.map(mapTaskForKanban);

    console.log(
      "✅ MAPPED MY TASKS:",
      mapped.map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        assignee: t.assigneeDisplayName,
        project: t.project,
      }))
    );

    return mapped;
  } catch (error) {
    console.error("❌ Error fetching assigned tasks:", error);
    throw error;
  }
}

// =====================================================
// GET TEAM TASKS
// =====================================================
export async function getTeamTasks() {
  try {
    const response = await get("/team-member/tasks/assigned", { limit: 100 });
    const tasks = response?.data || [];

    return tasks.map(mapTaskForKanban);
  } catch (error) {
    console.error("❌ Error fetching team tasks:", error);
    throw error;
  }
}

// =====================================================
// SUBMIT TASK
// =====================================================
export async function submitTaskWork(taskId, payload = {}) {
  const token = localStorage.getItem("worknest_token");

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  if (!taskId) {
    throw new Error("Task ID is missing. Cannot submit.");
  }

  const formData = new FormData();
  formData.append("taskId", String(taskId));
  formData.append("description", String(payload.description || "").trim());

  if (payload.file) {
    formData.append("file", payload.file);
  }

  console.log("📤 SUBMIT TASK →", {
    taskId,
    description: payload.description,
    file: payload.file?.name,
  });

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const response = await fetch(`${API_BASE_URL}/team-member/submit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const result = await response.json().catch(() => null);

  console.log("📥 Submit response:", response.status, result);

  if (!response.ok) {
    const error = new Error(
      result?.message || result?.error || "Failed to submit task"
    );
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}
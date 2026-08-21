import { get, post } from "./apiClient.js";

function mapTaskForKanban(task) {
  const statusMap = {
    todo: "todo",
    pending: "todo",

    in_progress: "in_progress",

    under_review: "under_review",

    done: "completed",
    completed: "completed",

    blocked: "in_progress",

    Pending: "todo",
    "To Do": "todo",
    "In Progress": "in_progress",
    Review: "under_review",
    "Under Review": "under_review",
    Completed: "completed",
    Rejected: "in_progress",
  };

  const assigneeName =
    task.assigneeName ||
    task.assignee_name ||
    task.assignee ||
    "Unassigned";

  const initials = assigneeName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: task.taskId ?? task.id,
    title: task.title || task.name || "",

    // IMPORTANT:
    // backend "under_review" => frontend "under_review"
    status: statusMap[task.status] || "todo",

    project:
      task.projectName ||
      task.project_name ||
      task.project ||
      "Unassigned",

    assignee: {
      name: assigneeName,
      avatar: initials,
    },
  };
}


// =====================================================
// GET MY ASSIGNED TASKS
// =====================================================
export async function getMyTasks() {
  try {
    const response = await get("/team-member/tasks/assigned", {
      limit: 100,
    });

    const tasks = response?.data || [];

    console.log("📥 MY ASSIGNED TASKS:", tasks);

    return tasks.map(mapTaskForKanban);
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
    const response = await get("/team-member/tasks/assigned", {
      limit: 100,
    });

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

  const formData = new FormData();

  // REQUIRED BY BACKEND
  formData.append("taskId", String(taskId));

  formData.append(
    "description",
    String(payload.description || "").trim()
  );

  if (payload.file) {
    formData.append("file", payload.file);
  }

  console.log("📤 SUBMIT TASK");
  console.log("Task ID:", taskId);
  console.log("Description:", payload.description);
  console.log("File:", payload.file);

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const response = await fetch(
    `${API_BASE_URL}/team-member/submit`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const result = await response.json().catch(() => null);

  console.log(
    "📥 Submit response:",
    response.status,
    result
  );

  if (!response.ok) {
    const error = new Error(
      result?.message ||
      result?.error ||
      "Failed to submit task"
    );

    error.status = response.status;
    error.data = result;

    throw error;
  }

  return result;
}
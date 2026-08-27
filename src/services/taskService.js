import { get, post, put, patch, del } from "./apiClient.js";

const BASE = "/company/tasks";

// =====================================================
// STATUS MAPPING
// =====================================================
const STATUS_TO_BACKEND = {
  Pending: "todo",
  "To Do": "todo",
  Todo: "todo",
  "In Progress": "in_progress",
  "Under Review": "in_progress",
  Review: "in_progress",
  Completed: "done",
  Rejected: "blocked",
  Blocked: "blocked",
};

const STATUS_TO_FRONTEND = {
  todo: "Pending",
  pending: "Pending",
  in_progress: "In Progress",
  review: "Under Review",
  under_review: "Under Review",
  done: "Completed",
  completed: "Completed",
  blocked: "Rejected",
  rejected: "Rejected",
};

// =====================================================
// PRIORITY MAPPING
// =====================================================
const PRIORITY_TO_BACKEND = {
  Low: "low",
  Medium: "medium",
  High: "high",
};

const PRIORITY_TO_FRONTEND = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

// =====================================================
// STATUS PROGRESS
// =====================================================
const STATUS_PROGRESS = {
  Pending: 0,
  "In Progress": 50,
  "Under Review": 85,
  Completed: 100,
  Rejected: 20,
};

// =====================================================
// HELPERS
// =====================================================
function toBackendStatus(status) {
  if (!status) return "todo";

  if (STATUS_TO_BACKEND[status]) {
    return STATUS_TO_BACKEND[status];
  }

  const normalized = String(status)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  switch (normalized) {
    case "pending":
    case "todo":
      return "todo";

    case "in_progress":
    case "in-progress":
      return "in_progress";

    case "under_review":
    case "review":
      return "in_progress";

    case "completed":
    case "done":
      return "done";

    case "rejected":
    case "blocked":
      return "blocked";

    default:
      return normalized;
  }
}

function toBackendPriority(priority) {
  if (!priority) return "medium";

  if (PRIORITY_TO_BACKEND[priority]) {
    return PRIORITY_TO_BACKEND[priority];
  }

  return String(priority).toLowerCase();
}

function normalizeDateForApi(value) {
  if (!value || value === "TBD" || value === "Unassigned") {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
    return String(value).slice(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

// =====================================================
// GET ALL TASKS
// =====================================================
export async function getAllTasks() {
  try {
    const response = await get(BASE, {
      limit: 100,
    });

    const tasks = Array.isArray(response?.data)
      ? response.data
      : [];

    return tasks
      .map(transformTask)
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

// =====================================================
// GET SINGLE TASK
// =====================================================
export async function getTaskById(id) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    const response = await get(`${BASE}/${id}`);

    return transformTask(response?.data);
  } catch (error) {
    console.error("Error fetching task:", error);
    return null;
  }
}

// =====================================================
// GET TASKS BY PROJECT
// =====================================================
export async function getTasksByProject(projectId) {
  try {
    if (!projectId) {
      return [];
    }

    /*
     * Use the generic company task endpoint with projectId
     * so it remains compatible with the current backend API.
     */
    const response = await get(BASE, {
      projectId,
      project_id: projectId,
      limit: 100,
    });

    const tasks = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];

    return tasks
      .map(transformTask)
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return [];
  }
}

// =====================================================
// GET TASKS BY ASSIGNEE
// =====================================================
export async function getTasksByAssignee(assigneeId) {
  try {
    if (!assigneeId) {
      return [];
    }

    const response = await get(BASE, {
      assigneeId,
      limit: 100,
    });

    const tasks = Array.isArray(response?.data)
      ? response.data
      : [];

    return tasks
      .map(transformTask)
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching assignee tasks:", error);
    return [];
  }
}

// =====================================================
// GET TASKS BY STATUS
// =====================================================
export async function getTasksByStatus(status) {
  try {
    if (status === "All") {
      return getAllTasks();
    }

    const backendStatus = toBackendStatus(status);

    const response = await get(BASE, {
      status: backendStatus,
      limit: 100,
    });

    const tasks = Array.isArray(response?.data)
      ? response.data
      : [];

    return tasks
      .map(transformTask)
      .filter(Boolean);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    return [];
  }
}

// =====================================================
// CREATE TASK
// =====================================================
export async function createTask(payload) {
  try {
    const projectId = payload.projectId || null;

    if (!projectId) {
      throw new Error("Please select a project for this task.");
    }

    const body = {
      TaskName: payload.name || payload.title || "",
      title: payload.name || payload.title || "",
      description: payload.description || "",

      projectId,
      project_id: projectId,

      priority: toBackendPriority(payload.priority),

      dueDate: normalizeDateForApi(payload.dueDate),
      due_date: normalizeDateForApi(payload.dueDate),
    };

    if (payload.assigneeId) {
      body.assigneeId = payload.assigneeId;
      body.assignee_id = payload.assigneeId;
    } else if (
      payload.assignee &&
      payload.assignee !== "Unassigned"
    ) {
      body.EmployeeName = payload.assignee;
      body.assigneeName = payload.assignee;
    }

    if (payload.status) {
      body.status = toBackendStatus(payload.status);
    }

    const response = await post(BASE, body);

    return transformTask(response?.data);
  } catch (error) {
    console.error("Error creating task:", error);

    if (
      error?.data?.errors &&
      Array.isArray(error.data.errors)
    ) {
      const errorMessages = error.data.errors
        .map(
          (item) =>
            `${item.field}: ${item.message}`
        )
        .join("\n");

      const newError = new Error(errorMessages);

      newError.backendErrors = error.data.errors;

      throw newError;
    }

    throw error;
  }
}

// =====================================================
// UPDATE COMPANY TASK
// =====================================================
export async function updateTask(id, updates) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    const body = {};

    // Task name
    if (
      updates.name !== undefined ||
      updates.title !== undefined
    ) {
      const name =
        updates.name ?? updates.title ?? "";

      body.TaskName = name;
      body.title = name;
    }

    // Description
    if (updates.description !== undefined) {
      body.description = updates.description;
    }

    // Project
    if (
      updates.projectId !== undefined &&
      updates.projectId !== null &&
      updates.projectId !== ""
    ) {
      body.projectId = updates.projectId;
      body.project_id = updates.projectId;
    }

    if (
      updates.project !== undefined &&
      updates.project !== "Unassigned"
    ) {
      body.projectName = updates.project;
      body.project_name = updates.project;
    }

    // Due date
    if (updates.dueDate !== undefined) {
      const date = normalizeDateForApi(
        updates.dueDate
      );

      body.dueDate = date;
      body.due_date = date;
    }

    // Priority
    if (updates.priority !== undefined) {
      body.priority = toBackendPriority(
        updates.priority
      );
    }

    // Status
    let backendStatus = null;

    if (updates.status !== undefined) {
      backendStatus = toBackendStatus(
        updates.status
      );

      body.status = backendStatus;
      body.TaskStatus = backendStatus;
    }

    // Assignee
    if (updates.assigneeId !== undefined) {
      const assigneeId =
        updates.assigneeId === ""
          ? null
          : updates.assigneeId;

      body.assigneeId = assigneeId;
      body.assignee_id = assigneeId;
    }

    if (
      updates.assignee !== undefined &&
      updates.assignee !== "Unassigned"
    ) {
      body.EmployeeName = updates.assignee;
      body.assigneeName = updates.assignee;
    }

    const response = await put(
      `${BASE}/${id}`,
      body
    );

    /*
     * Some backend versions require a separate
     * status endpoint. Try it only when a status
     * update was actually requested.
     */
    if (backendStatus) {
      try {
        await patch(
          `${BASE}/${id}/status`,
          {
            status: backendStatus,
          }
        );
      } catch {
        try {
          await patch(
            `${BASE}/${id}`,
            {
              status: backendStatus,
            }
          );
        } catch {
          // Main PUT already completed.
        }
      }
    }

    // Fetch fresh task for UI synchronization.
    try {
      const fresh = await get(
        `${BASE}/${id}`
      );

      return transformTask(
        fresh?.data || response?.data
      );
    } catch {
      return transformTask(
        response?.data
      );
    }
  } catch (error) {
    console.error("Error updating Company task:", error);

    if (
      error?.data?.errors &&
      Array.isArray(error.data.errors)
    ) {
      const errorMessages = error.data.errors
        .map(
          (item) =>
            `${item.field}: ${item.message}`
        )
        .join("\n");

      const newError = new Error(errorMessages);

      newError.backendErrors = error.data.errors;

      throw newError;
    }

    throw error;
  }
}

// =====================================================
// UPDATE TEAM MEMBER TASK
// =====================================================
export async function updateTeamMemberTask(
  id,
  updates
) {
  return updateTask(id, updates);
}

// =====================================================
// UPDATE TEAM LEADER TASK
// =====================================================
export async function updateTeamLeaderTask(
  id,
  updates
) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    const body = {};

    // Task name
    if (
      updates.name !== undefined ||
      updates.title !== undefined
    ) {
      const name =
        updates.name ?? updates.title ?? "";

      body.TaskName = name;
    }

    // Description
    if (updates.description !== undefined) {
      body.description = updates.description;
    }

    // Assignee
    if (updates.assigneeName !== undefined) {
      body.AssigneeName =
        updates.assigneeName;
    }

    if (updates.assignee !== undefined) {
      body.AssigneeName =
        updates.assignee;
    }

    if (updates.assigneeId !== undefined) {
      body.assigneeId =
        updates.assigneeId;
    }

    // Priority
    if (updates.priority !== undefined) {
      body.Priority =
        toBackendPriority(
          updates.priority
        );

      // Keep lowercase key too for backend
      // compatibility.
      body.priority =
        toBackendPriority(
          updates.priority
        );
    }

    // Due date
    if (updates.dueDate !== undefined) {
      const date =
        normalizeDateForApi(
          updates.dueDate
        );

      body.DueDate = date;
      body.dueDate = date;
    }

    // Status
    if (updates.status !== undefined) {
      const status =
        toBackendStatus(
          updates.status
        );

      body.status = status;
      body.TaskStatus = status;
    }

    const response = await put(
      `/team-leader/tasks/${id}`,
      body
    );

    return transformTask(
      response?.data
    );
  } catch (error) {
    console.error(
      "Error updating Team Leader task:",
      error
    );

    throw error;
  }
}

// =====================================================
// UPDATE TASK STATUS ONLY
// =====================================================
export async function updateTaskStatus(
  id,
  status
) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    const backendStatus =
      toBackendStatus(status);

    const response = await patch(
      `${BASE}/${id}/status`,
      {
        status: backendStatus,
      }
    );

    return transformTask(
      response?.data
    );
  } catch (error) {
    console.error(
      "Error updating task status:",
      error
    );

    throw error;
  }
}

// =====================================================
// DELETE TASK
// =====================================================
export async function deleteTask(id) {
  try {
    if (!id) {
      throw new Error("Task ID is required.");
    }

    /*
     * Company task endpoint is used here because
     * this service's generic CRUD is based on
     * /company/tasks.
     */
    await del(`${BASE}/${id}`);

    return true;
  } catch (error) {
    console.error(
      "Error deleting task:",
      error
    );

    return false;
  }
}

// =====================================================
// TASK STATISTICS
// =====================================================
export async function getTaskStatistics() {
  try {
    const all = await getAllTasks();

    const counts = all.reduce(
      (acc, task) => {
        acc.total += 1;

        acc[task.status] =
          (acc[task.status] || 0) + 1;

        return acc;
      },
      {
        total: 0,
      }
    );

    return [
      {
        id: "total-tasks",
        label: "Total Tasks",
        value: counts.total,
        note: "Updated live",
      },
      {
        id: "pending-tasks",
        label: "Pending Tasks",
        value: counts.Pending || 0,
        note: "Requires action",
      },
      {
        id: "in-progress-tasks",
        label: "In Progress",
        value:
          counts["In Progress"] || 0,
        note: "On track",
      },
      {
        id: "review-tasks",
        label: "Under Review",
        value:
          (counts.Review || 0) +
          (counts["Under Review"] || 0),
        note: "Needs approval",
      },
      {
        id: "completed-tasks",
        label: "Completed Tasks",
        value:
          counts.Completed || 0,
        note: "Finished work",
      },
      {
        id: "rejected-tasks",
        label: "Rejected Tasks",
        value:
          counts.Rejected || 0,
        note: "Needs rework",
      },
    ];
  } catch (error) {
    console.error(
      "Error building task statistics:",
      error
    );

    return [];
  }
}

// =====================================================
// TRANSFORM BACKEND TASK
// =====================================================
function transformTask(task) {
  if (!task) {
    return null;
  }

  const rawStatus =
    task.status ||
    task.TaskStatus ||
    "todo";

  const normalizedStatus =
    String(rawStatus)
      .toLowerCase()
      .trim();

  const frontendStatus =
    STATUS_TO_FRONTEND[
      rawStatus
    ] ||
    STATUS_TO_FRONTEND[
      normalizedStatus
    ] ||
    "Pending";

  const rawPriority =
    task.priority ||
    task.Priority ||
    "medium";

  const normalizedPriority =
    String(rawPriority)
      .toLowerCase()
      .trim();

  const frontendPriority =
    PRIORITY_TO_FRONTEND[
      rawPriority
    ] ||
    PRIORITY_TO_FRONTEND[
      normalizedPriority
    ] ||
    "Medium";

  const rawDue =
    task.due_date ||
    task.dueDate ||
    task.DueDate ||
    null;

  return {
    id: task.id,

    name:
      task.title ||
      task.TaskName ||
      task.name ||
      "",

    title:
      task.title ||
      task.TaskName ||
      task.name ||
      "",

    description:
      task.description || "",

    project:
      task.project_name ||
      task.projectName ||
      task.project ||
      "Unassigned",

    projectId:
      task.project_id ||
      task.projectId ||
      null,

    priority:
      frontendPriority,

    status:
      frontendStatus,

    dueDate:
      formatDate(rawDue),

    dueDateRaw:
      rawDue,

    assignee:
      task.assignee_name ||
      task.assigneeName ||
      task.EmployeeName ||
      task.AssigneeName ||
      "Unassigned",

    assigneeId:
      task.assignee_id ||
      task.assigneeId ||
      null,

    assigneeEmail:
      task.assignee_email ||
      task.assigneeEmail ||
      null,

    progress:
      STATUS_PROGRESS[
        frontendStatus
      ] ?? 0,

    createdAt:
      formatDate(
        task.created_at
      ),

    updatedAt:
      formatDate(
        task.updated_at
      ),
  };
}

// =====================================================
// FORMAT DATE
// =====================================================
function formatDate(dateString) {
  if (!dateString) {
    return "TBD";
  }

  try {
    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "TBD";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  } catch {
    return "TBD";
  }
}
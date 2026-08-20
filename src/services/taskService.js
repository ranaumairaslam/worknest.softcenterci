import { get, post, put, patch, del } from './apiClient.js';

const BASE = '/company/tasks';

// =====================================================
// Status Mapping (Frontend ↔ Backend)
// =====================================================
const STATUS_TO_BACKEND = {
  Pending: 'todo',
  'In Progress': 'in_progress',
  'Under Review': 'in_progress', // backend has no separate review in current map
  Review: 'in_progress',
  Completed: 'done',
  Rejected: 'blocked',
  Blocked: 'blocked',
  Todo: 'todo',
};

const STATUS_TO_FRONTEND = {
  todo: 'Pending',
  pending: 'Pending',
  in_progress: 'In Progress',
  review: 'Under Review',
  under_review: 'Under Review',
  done: 'Completed',
  completed: 'Completed',
  blocked: 'Rejected',
  rejected: 'Rejected',
};

const PRIORITY_TO_BACKEND = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
};

const PRIORITY_TO_FRONTEND = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

// Status → Progress percentage
const STATUS_PROGRESS = {
  Pending: 0,
  'In Progress': 50,
  'Under Review': 85,
  Review: 85,
  Completed: 100,
  Rejected: 20,
};

function toBackendStatus(status) {
  if (!status) return 'todo';
  if (STATUS_TO_BACKEND[status]) return STATUS_TO_BACKEND[status];
  const s = String(status).toLowerCase().trim().replace(/\s+/g, '_');
  if (s === 'pending' || s === 'todo') return 'todo';
  if (s === 'in_progress' || s === 'in-progress') return 'in_progress';
  if (s === 'under_review' || s === 'review') return 'in_progress';
  if (s === 'completed' || s === 'done') return 'done';
  if (s === 'rejected' || s === 'blocked') return 'blocked';
  return s;
}

function toBackendPriority(priority) {
  if (!priority) return 'medium';
  if (PRIORITY_TO_BACKEND[priority]) return PRIORITY_TO_BACKEND[priority];
  return String(priority).toLowerCase();
}

function normalizeDateForApi(value) {
  if (!value || value === 'TBD' || value === 'Unassigned') return null;
  // already yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}/.test(String(value))) {
    return String(value).slice(0, 10);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// =====================================================
// GET ALL TASKS
// =====================================================
export async function getAllTasks() {
  try {
    const response = await get(BASE, { limit: 100 });
    const tasksData = response?.data || [];
    return tasksData.map(transformTask);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

// =====================================================
// GET SINGLE TASK
// =====================================================
export async function getTaskById(id) {
  try {
    const response = await get(`${BASE}/${id}`);
    return transformTask(response?.data);
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
}

// =====================================================
// GET TASKS BY PROJECT
// =====================================================
export async function getTasksByProject(projectId) {
  try {
    const response = await get(`${BASE}/projectId/${projectId}`);
    return (response?.data || []).map(transformTask);
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }
}

// =====================================================
// GET TASKS BY ASSIGNEE
// =====================================================
export async function getTasksByAssignee(assigneeId) {
  try {
    const response = await get(BASE, { assigneeId, limit: 100 });
    return (response?.data || []).map(transformTask);
  } catch (error) {
    console.error('Error fetching assignee tasks:', error);
    return [];
  }
}

// =====================================================
// GET TASKS BY STATUS
// =====================================================
export async function getTasksByStatus(status) {
  try {
    if (status === 'All') return getAllTasks();
    const backendStatus = toBackendStatus(status);
    const response = await get(BASE, { status: backendStatus, limit: 100 });
    return (response?.data || []).map(transformTask);
  } catch (error) {
    console.error('Error fetching tasks by status:', error);
    return [];
  }
}

// =====================================================
// CREATE TASK
// =====================================================
export async function createTask(payload) {
  try {
    const body = {
      TaskName: payload.name || payload.title,
      title: payload.name || payload.title,
      description: payload.description || '',
      projectId: payload.projectId || null,
      project_id: payload.projectId || null,
      priority: toBackendPriority(payload.priority),
      dueDate: normalizeDateForApi(payload.dueDate),
      due_date: normalizeDateForApi(payload.dueDate),
    };

    if (payload.assigneeId) {
      body.assigneeId = payload.assigneeId;
      body.assignee_id = payload.assigneeId;
    } else if (payload.assignee && payload.assignee !== 'Unassigned') {
      body.EmployeeName = payload.assignee;
      body.assigneeName = payload.assignee;
    }

    if (payload.status) {
      body.status = toBackendStatus(payload.status);
    }

    if (!body.projectId) {
      throw new Error('Please select a project for this task.');
    }

    console.log('📤 Creating task with body:', body);

    const response = await post(BASE, body);
    return transformTask(response?.data);
  } catch (error) {
    console.error('Error creating task:', error);

    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }

    throw error;
  }
}

// =====================================================
// UPDATE TASK  ✅ FIXED status + project + assignee + date
// =====================================================
export async function updateTask(id, updates) {
  try {
    const body = {};

    if (updates.name !== undefined || updates.title !== undefined) {
      body.TaskName = updates.name || updates.title;
      body.title = updates.name || updates.title;
    }

    if (updates.description !== undefined) {
      body.description = updates.description;
    }

    // ✅ Project
    if (updates.projectId !== undefined && updates.projectId !== null && updates.projectId !== '') {
      body.projectId = updates.projectId;
      body.project_id = updates.projectId;
    }
    if (updates.project && updates.project !== 'Unassigned') {
      body.projectName = updates.project;
      body.project_name = updates.project;
    }

    // ✅ Due date
    if (updates.dueDate !== undefined) {
      const d = normalizeDateForApi(updates.dueDate);
      body.dueDate = d;
      body.due_date = d;
    }

    // ✅ Priority
    if (updates.priority !== undefined) {
      body.priority = toBackendPriority(updates.priority);
    }

    // ✅ Status (multiple keys for backend compatibility)
    let backendStatus = null;
    if (updates.status !== undefined) {
      backendStatus = toBackendStatus(updates.status);
      body.status = backendStatus;
      body.TaskStatus = backendStatus;
    }

    // ✅ Assignee
    if (updates.assigneeId !== undefined) {
      if (updates.assigneeId === null || updates.assigneeId === '') {
        body.assigneeId = null;
        body.assignee_id = null;
      } else {
        body.assigneeId = updates.assigneeId;
        body.assignee_id = updates.assigneeId;
      }
    }
    if (updates.assignee !== undefined && updates.assignee !== 'Unassigned') {
      body.EmployeeName = updates.assignee;
      body.assigneeName = updates.assignee;
    }

    console.log('📤 Updating task:', id, body);

    const response = await put(`${BASE}/${id}`, body);

    // ✅ IMPORTANT: many backends only update status via PATCH
    if (backendStatus) {
      try {
        await patch(`${BASE}/${id}/status`, { status: backendStatus });
      } catch (e) {
        // fallback some APIs use PUT only / different path
        try {
          await patch(`${BASE}/${id}`, { status: backendStatus });
        } catch (e2) {
          console.warn('Status patch optional failed:', e2?.message || e2);
        }
      }
    }

    // Fresh fetch so UI gets saved status/project/assignee
    try {
      const fresh = await get(`${BASE}/${id}`);
      return transformTask(fresh?.data || response?.data);
    } catch {
      return transformTask(response?.data);
    }
  } catch (error) {
    console.error('Error updating task:', error);

    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }

    throw error;
  }
}

export async function updateTeamMemberTask(id, updates) {
  return updateTask(id, updates);
}

// =====================================================
// UPDATE TASK STATUS ONLY (PATCH)
// =====================================================
export async function updateTaskStatus(id, status) {
  try {
    const backendStatus = toBackendStatus(status);
    const response = await patch(`${BASE}/${id}/status`, {
      status: backendStatus,
    });
    return transformTask(response?.data);
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}

// =====================================================
// DELETE TASK
// =====================================================
export async function deleteTask(id) {
  try {
    console.log('🗑️ Deleting task:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
    return false;
  }
}

// =====================================================
// GET TASK STATISTICS
// =====================================================
export async function getTaskStatistics() {
  try {
    const all = await getAllTasks();
    const counts = all.reduce(
      (acc, task) => {
        acc.total += 1;
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { total: 0 }
    );

    return [
      {
        id: 'total-tasks',
        label: 'Total Tasks',
        value: counts.total,
        note: 'Updated live',
      },
      {
        id: 'pending-tasks',
        label: 'Pending Tasks',
        value: counts.Pending || 0,
        note: 'Requires action',
      },
      {
        id: 'in-progress-tasks',
        label: 'In Progress',
        value: counts['In Progress'] || 0,
        note: 'On track',
      },
      {
        id: 'review-tasks',
        label: 'Under Review',
        value: (counts.Review || 0) + (counts['Under Review'] || 0),
        note: 'Needs approval',
      },
      {
        id: 'completed-tasks',
        label: 'Completed Tasks',
        value: counts.Completed || 0,
        note: 'Finished work',
      },
      {
        id: 'rejected-tasks',
        label: 'Rejected Tasks',
        value: counts.Rejected || 0,
        note: 'Needs rework',
      },
    ];
  } catch (error) {
    console.error('Error building task statistics:', error);
    return [];
  }
}

// =====================================================
// HELPER: Transform backend task → frontend format
// =====================================================
function transformTask(task) {
  if (!task) return null;

  const rawStatus = task.status || task.TaskStatus || 'todo';
  const frontendStatus =
    STATUS_TO_FRONTEND[rawStatus] ||
    STATUS_TO_FRONTEND[String(rawStatus).toLowerCase()] ||
    'Pending';

  const rawPriority = task.priority || 'medium';
  const frontendPriority =
    PRIORITY_TO_FRONTEND[rawPriority] ||
    PRIORITY_TO_FRONTEND[String(rawPriority).toLowerCase()] ||
    'Medium';

  const rawDue = task.due_date || task.dueDate || null;

  return {
    id: task.id,
    name: task.title || task.TaskName || task.name || '',
    title: task.title || task.TaskName || task.name || '',
    description: task.description || '',
    project: task.project_name || task.projectName || task.project || 'Unassigned',
    projectId: task.project_id || task.projectId || null,
    priority: frontendPriority,
    status: frontendStatus,
    dueDate: formatDate(rawDue),
    dueDateRaw: rawDue,
    assignee: task.assignee_name || task.assigneeName || task.EmployeeName || 'Unassigned',
    assigneeId: task.assignee_id || task.assigneeId || null,
    assigneeEmail: task.assignee_email || null,
    progress: STATUS_PROGRESS[frontendStatus] ?? 0,
    createdAt: formatDate(task.created_at),
    updatedAt: formatDate(task.updated_at),
  };
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'TBD';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'TBD';
  }
}
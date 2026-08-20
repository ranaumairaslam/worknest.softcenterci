import { get, post, put, patch, del } from './apiClient.js';

const BASE = '/company/tasks';

// =====================================================
// Status Mapping (Frontend ↔ Backend)
// =====================================================
const STATUS_TO_BACKEND = {
  Pending: 'todo',
  'In Progress': 'in_progress',
  'Under Review': 'in_progress',
  Review: 'in_progress',
  Completed: 'done',
  Rejected: 'blocked',
  Blocked: 'blocked',
  Todo: 'todo',
};

const STATUS_TO_FRONTEND = {
  todo: 'Pending',
  in_progress: 'In Progress',
  done: 'Completed',
  blocked: 'Rejected',
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
    const backendStatus = STATUS_TO_BACKEND[status];
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
      description: payload.description || '',
      projectId: payload.projectId || null,
      priority: PRIORITY_TO_BACKEND[payload.priority] || 'medium',
      dueDate: payload.dueDate || null,
    };

    // Add assignee if provided
    if (payload.assigneeId) {
      body.assigneeId = payload.assigneeId;
    } else if (payload.assignee) {
      body.EmployeeName = payload.assignee;
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
// UPDATE TASK
// =====================================================
export async function updateTask(id, updates) {
  try {
    const body = {};
    
    if (updates.name !== undefined || updates.title !== undefined) {
      body.TaskName = updates.name || updates.title;
    }
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.dueDate !== undefined) body.dueDate = updates.dueDate;
    if (updates.priority !== undefined) {
      body.priority = PRIORITY_TO_BACKEND[updates.priority] || updates.priority.toLowerCase();
    }
    if (updates.status !== undefined) {
      body.status = STATUS_TO_BACKEND[updates.status] || 'todo';
    }
    
    // Handle assignee change
    if (updates.assigneeId !== undefined) {
      body.assigneeId = updates.assigneeId;
    } else if (updates.assignee !== undefined) {
      body.EmployeeName = updates.assignee;
    }

    console.log('📤 Updating task:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformTask(response?.data);
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
  try {
    const body = {};

    if (updates.name !== undefined || updates.title !== undefined) {
      body.TaskName = updates.name ?? updates.title;
    }

    if (updates.description !== undefined) {
      body.description = updates.description;
    }

    if (updates.dueDate !== undefined) {
      body.dueDate = updates.dueDate;
    }

    if (updates.priority !== undefined) {
      body.priority =
        PRIORITY_TO_BACKEND[updates.priority] ||
        String(updates.priority).toLowerCase();
    }

    if (updates.status !== undefined) {
      body.status =
        STATUS_TO_BACKEND[updates.status] || "todo";
    }

    console.log("📤 Updating Team Member task:", id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformTask(response?.data);
  } catch (error) {
    console.error("Error updating Team Member task:", error);
    throw error;
  }
}

// =====================================================
// UPDATE TASK STATUS ONLY (PATCH)
// =====================================================
export async function updateTaskStatus(id, status) {
  try {
    const backendStatus = STATUS_TO_BACKEND[status] || 'todo';
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
// DELETE TASK ⭐ (Now Works!)
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

  const frontendStatus = STATUS_TO_FRONTEND[task.status] || 'Pending';
  const frontendPriority = PRIORITY_TO_FRONTEND[task.priority] || 'Medium';

  return {
    id: task.id,
    name: task.title || '',
    title: task.title || '',
    description: task.description || '',
    project: task.project_name || 'Unassigned',
    projectId: task.project_id || null,
    priority: frontendPriority,
    status: frontendStatus,
    dueDate: formatDate(task.due_date),
    assignee: task.assignee_name || 'Unassigned',
    assigneeId: task.assignee_id || null,
    assigneeEmail: task.assignee_email || null,
    progress: STATUS_PROGRESS[frontendStatus] ?? 0,
    createdAt: formatDate(task.created_at),
    updatedAt: formatDate(task.updated_at),
  };
}

// Helper: Format date
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
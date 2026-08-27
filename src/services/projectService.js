import { get, post, put, del } from './apiClient.js';

const BASE = '/company/projects';

// =====================================================
// Status/Priority Mapping
// =====================================================
const STATUS_TO_BACKEND = {
  Planning: 'pending',
  Active: 'active',
  'In Progress': 'active',
  Review: 'active',
  Completed: 'completed',
  Pending: 'pending',
  'On Hold': 'on_hold',
  Inactive: 'inactive',
};

const STATUS_TO_FRONTEND = {
  pending: 'Planning',
  active: 'Active',
  completed: 'Completed',
  on_hold: 'On Hold',
  inactive: 'Inactive',
};

const PRIORITY_TO_BACKEND = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
  Urgent: 'urgent',
};

// =====================================================
// GET ALL PROJECTS
// =====================================================
export async function getAllProjects() {
  try {
    const response = await get(BASE);
    const projects = response?.data || [];
    return projects.map(transformProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// =====================================================
// GET SINGLE PROJECT
// =====================================================
export async function getProjectById(id) {
  try {
    const response = await get(`${BASE}/${id}`);
    return transformProject(response?.data);
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// =====================================================
// GET PROJECTS BY CLIENT
// =====================================================
export async function getProjectsByClient(clientId) {
  const all = await getAllProjects();
  return all.filter((p) => p.clientId === clientId);
}

// =====================================================
// GET PROJECT CLIENT
// =====================================================
export async function getProjectClient(projectId) {
  try {
    const response = await get(`${BASE}/${projectId}/client`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching project client:', error);
    return null;
  }
}

// =====================================================
// GET PROJECT TASKS
// =====================================================
export async function getProjectTasks(projectId) {
  try {
    const response = await get(`${BASE}/${projectId}/tasks`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching project tasks:', error);
    return [];
  }
}

// =====================================================
// CREATE TASK FOR PROJECT
// =====================================================
export async function createProjectTask(projectId, taskPayload) {
  try {
    const body = {
      title: taskPayload.title || taskPayload.name,
      description: taskPayload.description || '',
      assigneeId: taskPayload.assigneeId || null,
      dueDate: taskPayload.dueDate || null,
      priority: (taskPayload.priority || 'medium').toLowerCase(),
    };

    const response = await post(`${BASE}/${projectId}/tasks`, body);
    return response?.data;
  } catch (error) {
    console.error('Error creating project task:', error);
    throw error;
  }
}

// =====================================================
// CREATE PROJECT
// =====================================================
export async function createProject(payload) {
  try {
    const body = {
      projectName: payload.name,
      description: payload.description,
      TeamLeaderName: payload.leader,
      ProjectTeam: payload.team,
      ProjectStatus: STATUS_TO_BACKEND[payload.status] || 'pending',
      ProjectPriority: PRIORITY_TO_BACKEND[payload.priority] || 'medium',
      date: payload.dueDate,
      clientName: payload.client,
      teamId: payload.teamId || null,
      leaderId: payload.leaderId || null,
      clientId: payload.clientId || null,
    };

    console.log('📤 Creating project with body:', body);

    const response = await post(BASE, body);
    return transformProject(response?.data);
  } catch (error) {
    console.error('Error creating project:', error);
    
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
// UPDATE PROJECT (FIXED: team/client/leader/date/progress)
// =====================================================
export async function updateProject(id, updates) {
  try {
    const body = {};

    if (updates.name !== undefined) {
      body.name = updates.name;
      body.projectName = updates.name;
    }

    if (updates.description !== undefined) {
      body.description = updates.description;
    }

    // ✅ Team name + id
    if (updates.team !== undefined) {
      body.ProjectTeam = updates.team;
      body.team = updates.team;
      body.teamName = updates.team;
    }
    if (updates.teamId !== undefined && updates.teamId !== null && updates.teamId !== "") {
      body.teamId = updates.teamId;
      body.TeamId = updates.teamId;
      body.team_id = updates.teamId;
    }

    // ✅ Leader name + id
    if (updates.leader !== undefined) {
      body.TeamLeaderName = updates.leader;
      body.project_leader_name = updates.leader;
      body.leader = updates.leader;
    }
    if (updates.leaderId !== undefined && updates.leaderId !== null && updates.leaderId !== "") {
      body.teamLeaderId = updates.leaderId;
      body.project_leader_id = updates.leaderId;
      body.leaderId = updates.leaderId;
    }

    // ✅ Client name + id
    if (updates.client !== undefined) {
      body.clientName = updates.client;
      body.client_name = updates.client;
      body.client = updates.client;
    }
    if (updates.clientId !== undefined && updates.clientId !== null && updates.clientId !== "") {
      body.clientId = updates.clientId;
      body.client_id = updates.clientId;
    }

    if (updates.status !== undefined) {
      body.status = STATUS_TO_BACKEND[updates.status] || String(updates.status).toLowerCase();
      body.ProjectStatus = body.status;
    }

    if (updates.priority !== undefined) {
      body.priority =
        PRIORITY_TO_BACKEND[updates.priority] || String(updates.priority).toLowerCase();
      body.ProjectPriority = body.priority;
    }

    if (updates.dueDate !== undefined) {
      body.dueDate = updates.dueDate;
      body.date = updates.dueDate;
      body.due_date = updates.dueDate;
    }

    if (updates.startDate !== undefined) {
      body.startDate = updates.startDate;
      body.start_date = updates.startDate;
    }

    // ✅ PROGRESS (ye missing tha)
    if (updates.progress !== undefined) {
      const progressValue = Number(updates.progress);
      body.progress = Number.isFinite(progressValue)
        ? Math.min(100, Math.max(0, progressValue))
        : 0;
    }

    console.log("📤 Updating project:", id, body);

    const response = await put(`${BASE}/${id}`, body);

    // optional assign-team
    if (updates.teamId && updates.leaderId) {
      try {
        await put(`${BASE}/${id}/assign-team`, {
          teamId: updates.teamId,
          leaderId: updates.leaderId,
        });
      } catch (e) {
        console.warn("Optional assign-team call bypassed:", e?.message || e);
      }
    }

    // fresh data
    try {
      const fresh = await get(`${BASE}/${id}`);
      return transformProject(fresh?.data || response?.data);
    } catch {
      return transformProject(response?.data);
    }
  } catch (error) {
    console.error("Error updating project:", error);

    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join("\n");
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }

    throw error;
  }
}

// =====================================================
// DELETE PROJECT
// =====================================================
export async function deleteProject(id) {
  try {
    console.log('🗑️ Deleting project:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
    return false;
  }
}

// =====================================================
// MARK PROJECT AS COMPLETED
// =====================================================
export async function markProjectCompleted(id) {
  try {
    const response = await put(`${BASE}/${id}`, {
      status: 'completed',
    });
    return transformProject(response?.data);
  } catch (error) {
    console.error('Error completing project:', error);
    throw error;
  }
}

// =====================================================
// ASSIGN PROJECT LEADER (Restored Export)
// =====================================================
export async function assignProjectLeader(id, leaderName) {
  try {
    return await getProjectById(id);
  } catch (error) {
    console.error('Error assigning leader:', error);
    throw error;
  }
}

// =====================================================
// ASSIGN TEAM + LEADER TO PROJECT
// =====================================================
export async function assignTeamToProject(projectId, teamId, leaderId) {
  try {
    const response = await put(`${BASE}/${projectId}/assign-team`, {
      teamId,
      leaderId,
    });
    return response?.data;
  } catch (error) {
    console.error('Error assigning team:', error);
    throw error;
  }
}

// =====================================================
// GET COMPANY EMPLOYEES
// =====================================================
export async function getCompanyEmployees() {
  try {
    const response = await get(`${BASE}/company/employees`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

// =====================================================
// GET PROJECT TEAM MEMBERS
// =====================================================
export async function getProjectTeamMembers(projectId, teamId) {
  try {
    const response = await get(`${BASE}/${projectId}/team/${teamId}/employees`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// =====================================================
// COMPATIBILITY
// =====================================================
export async function incrementTaskCount(projectId) {
  return null;
}

export async function recalculateProgress(projectId) {
  return await getProjectById(projectId);
}

// =====================================================
// HELPER: Transform backend project → frontend format
// =====================================================
function transformProject(project) {
  if (!project) return null;

  const statusRaw = project.ProjectStatus || project.status || 'pending';
  const priorityRaw = project.ProjectPriority || project.priority || 'medium';
  const frontendStatus = STATUS_TO_FRONTEND[statusRaw] || capitalize(statusRaw);

  const rawDue = project.date || project.due_date || project.dueDate || null;
  const rawStart = project.start_date || project.startDate || null;

  const teamName =
    project.ProjectTeam || project.team_name || project.teamName || project.team || null;
  const clientName =
    project.clientName ||
    project.client_company_name ||
    project.client_name ||
    project.client ||
    null;
  const leaderName =
    project.TeamLeaderName ||
    project.project_leader_name ||
    project.project_leader ||
    project.leader ||
    null;

  return {
    id: project.id,
    name: project.projectName || project.name || '',
    description: project.description || '',
    leader: leaderName || 'Unassigned',
    leaderId: project.teamLeaderId || project.project_leader_id || project.leaderId || null,
    team: teamName || 'Unassigned',
    teamId: project.teamId || project.team_id || null,
    client: clientName || null,
    clientId: project.clientId || project.client_id || null,
    status: frontendStatus,
    priority: capitalize(priorityRaw),
    progress: Number(project.progress) || 0,
    dueDate: formatDate(rawDue),
    dueDateRaw: rawDue,
    startDate: formatDate(rawStart),
    startDateRaw: rawStart,
    completedTasks: project.completed_tasks || 0,
    totalTasks: project.total_tasks || 0,
    members: project.members_count || 0,
    memberIds: project.member_ids || [],
    color: getColorById(project.id),
    revenue: project.revenue || 0,
    createdAt: formatDate(project.created_at || project.createdAt),
    updatedAt: formatDate(project.updated_at),
  };
}

function capitalize(str) {
  if (!str) return '';
  const s = String(str);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
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

function getColorById(id) {
  const colors = [
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-orange-500',
    'bg-violet-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-green-500',
    'bg-sky-500',
    'bg-rose-500',
    'bg-teal-500',
  ];
  return colors[Number(id) % colors.length];
}
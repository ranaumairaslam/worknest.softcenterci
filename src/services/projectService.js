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
// GET PROJECT CLIENT (NEW!)
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
// GET PROJECT TASKS (NEW!)
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
// CREATE TASK FOR PROJECT (NEW!)
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
// UPDATE PROJECT
// =====================================================
export async function updateProject(id, updates) {
  try {
    const body = {};
    
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.clientId !== undefined) body.clientId = updates.clientId;
    if (updates.startDate !== undefined) body.startDate = updates.startDate;
    if (updates.dueDate !== undefined) body.dueDate = updates.dueDate;
    if (updates.status !== undefined) {
      body.status = STATUS_TO_BACKEND[updates.status] || updates.status.toLowerCase();
    }

    console.log('📤 Updating project:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformProject(response?.data);
  } catch (error) {
    console.error('Error updating project:', error);
    
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
// ASSIGN PROJECT LEADER
// =====================================================
export async function assignProjectLeader(id, leaderName) {
  try {
    return getProjectById(id);
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
// GET COMPANY EMPLOYEES (for leader selection)
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

  return {
    id: project.id,
    name: project.projectName || project.name || '',
    description: project.description || '',
    leader: project.TeamLeaderName || project.project_leader_name || project.project_leader || 'Unassigned',
    leaderId: project.teamLeaderId || project.project_leader_id || null,
    team: project.ProjectTeam || project.team_name || 'Unassigned',
    teamId: project.teamId || project.team_id || null,
    client: project.clientName || project.client_company_name || project.client_name || null,
    clientId: project.clientId || project.client_id || null,
    status: frontendStatus,
    priority: capitalize(priorityRaw),
    progress: Number(project.progress) || 0,
    dueDate: formatDate(project.date || project.due_date),
    startDate: formatDate(project.start_date),
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
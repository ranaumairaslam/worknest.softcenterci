import { get, post, put, del } from './apiClient.js';

const BASE = '/company/projects';

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
// CREATE PROJECT
// =====================================================
export async function createProject(payload) {
  try {
    // Frontend form data ko backend format mein convert karein
    const body = {
      name: payload.name,
      description: payload.description || '',
      clientId: payload.clientId || null,
      startDate: payload.startDate || null,
      dueDate: payload.dueDate || null,
    };

    const response = await post(BASE, body);
    return transformProject(response?.data);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// =====================================================
// UPDATE PROJECT
// =====================================================
export async function updateProject(id, updates) {
  try {
    const body = {
      name: updates.name,
      description: updates.description,
      status: updates.status?.toLowerCase(),
      priority: updates.priority,
      startDate: updates.startDate,
      dueDate: updates.dueDate,
      progress: updates.progress,
    };

    const response = await put(`${BASE}/${id}`, body);
    return transformProject(response?.data);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// =====================================================
// DELETE PROJECT
// =====================================================
export async function deleteProject(id) {
  try {
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
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
      progress: 100,
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
    // Get project and update with leader
    const response = await put(`${BASE}/${id}`, {
      leader: leaderName,
    });
    return transformProject(response?.data);
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
// HELPER: Transform backend project to frontend format
// =====================================================
function transformProject(project) {
  if (!project) return null;

  return {
    id: project.id,
    name: project.name || '',
    description: project.description || '',
    leader: project.project_leader_name || 'Unassigned',
    leaderId: project.project_leader_id || null,
    team: project.team_name || 'Unassigned',
    teamId: project.team_id || null,
    client: project.client_name || null,
    clientId: project.client_id || null,
    status: capitalize(project.status || 'pending'),
    priority: project.priority || 'Medium',
    progress: Number(project.progress) || 0,
    dueDate: formatDate(project.due_date),
    startDate: formatDate(project.start_date),
    completedTasks: project.completed_tasks || 0,
    totalTasks: project.total_tasks || 0,
    members: project.members_count || 0,
    memberIds: project.member_ids || [],
    color: getColorById(project.id),
    revenue: project.revenue || 0,
  };
}

// Helper: Capitalize first letter
function capitalize(str) {
  if (!str) return '';
  const s = String(str);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

// Helper: Format date to readable format
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

// Helper: Get color based on ID
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

// =====================================================
// INCREMENT TASK COUNT (for compatibility with old code)
// =====================================================
export async function incrementTaskCount(projectId) {
  // Backend handles this automatically when task is created
  return null;
}

// =====================================================
// RECALCULATE PROGRESS (for compatibility with old code)
// =====================================================
export async function recalculateProgress(projectId) {
  // Backend handles this automatically
  return await getProjectById(projectId);
}

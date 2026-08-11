import { get, post, put, del } from './apiClient.js';

const BASE = '/company/teams';

// =====================================================
// GET ALL TEAMS
// =====================================================
export async function getAllTeams() {
  try {
    const response = await get(BASE);
    const teams = response?.data || [];
    return teams.map(transformTeam);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
}

// =====================================================
// GET SINGLE TEAM (with members)
// =====================================================
export async function getTeamById(id) {
  try {
    const response = await get(`${BASE}/${id}`);
    return transformTeam(response?.data);
  } catch (error) {
    console.error('Error fetching team:', error);
    return null;
  }
}

// =====================================================
// GET TEAM BY NAME
// =====================================================
export async function getTeamByName(name) {
  const all = await getAllTeams();
  return all.find((t) => t.name === name) || null;
}

// =====================================================
// CREATE TEAM
// =====================================================
export async function createTeam(payload) {
  try {
    const body = {
      name: payload.name,
      description: payload.description || '',
    };

    const response = await post(BASE, body);
    return transformTeam(response?.data);
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
}

// =====================================================
// UPDATE TEAM
// =====================================================
export async function updateTeam(id, updates) {
  try {
    const body = {
      name: updates.name,
      description: updates.description,
    };

    const response = await put(`${BASE}/${id}`, body);
    return transformTeam(response?.data);
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
}

// =====================================================
// DELETE TEAM
// (Backend route missing — will 404 until added)
// =====================================================
export async function deleteTeam(id) {
  try {
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    return false;
  }
}

// =====================================================
// REGISTER NEW MEMBER (creates user + adds to team)
// =====================================================
export async function registerTeamMember(teamId, memberData) {
  try {
    const body = {
      name: memberData.name,
      email: memberData.email || null,
      password: memberData.password || null,
      role: memberData.role || 'team_member', // or 'team_leader'
    };

    const response = await post(`${BASE}/${teamId}/register-member`, body);
    return response?.data;
  } catch (error) {
    console.error('Error registering team member:', error);
    throw error;
  }
}

// =====================================================
// ADD EXISTING MEMBER TO TEAM (compatibility function)
// =====================================================
export async function addTeamMember(teamId, employeeId) {
  // Backend does not have this exact route yet
  // Refresh team after action
  return getTeamById(teamId);
}

// =====================================================
// REMOVE MEMBER FROM TEAM (compatibility function)
// =====================================================
export async function removeTeamMember(teamId, employeeId) {
  return getTeamById(teamId);
}

// =====================================================
// ASSIGN TEAM LEADER (promote existing user)
// =====================================================
export async function assignTeamLeader(teamId, userId) {
  try {
    const response = await put(`${BASE}/${teamId}/assign-leader`, {
      userId,
    });
    return response?.data;
  } catch (error) {
    console.error('Error assigning leader:', error);
    throw error;
  }
}

// =====================================================
// ASSIGN PROJECT LEADER (compatibility with old code)
// =====================================================
export async function assignProjectLeader(teamId, leaderName) {
  // Old code passes leader NAME, but backend needs USER ID
  // Just refresh the team for now
  return getTeamById(teamId);
}

// =====================================================
// LINK / UNLINK PROJECT (compatibility with old code)
// Backend handles this automatically via project assignment
// =====================================================
export async function linkProject(teamId, projectId) {
  return getTeamById(teamId);
}

export async function unlinkProject(teamId, projectId) {
  return getTeamById(teamId);
}

// =====================================================
// HELPER: Transform backend team → frontend format
// =====================================================
function transformTeam(team) {
  if (!team) return null;

  const memberCount = Number(team.member_count) || (team.members?.length || 0);

  return {
    id: team.id,
    name: team.name || '',
    description: team.description || '',
    status: 'Active',
    projectLeader: team.leader_name || 'Unassigned',
    leaderId: team.leader_id || null,
    leaderEmail: team.leader_email || null,
    totalMembers: memberCount,
    members: (team.members || []).map((m) => m.id),
    memberDetails: team.members || [],
    projects: team.project_count || 0,
    projectIds: [],
    createdAt: formatDate(team.created_at),
    progress: 0,
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
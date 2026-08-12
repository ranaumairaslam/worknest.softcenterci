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
// Backend requires: teamName (or name), description, TeamLeaderName (optional)
// =====================================================
export async function createTeam(payload) {
  try {
    const body = {
      teamName: payload.name,
      description: payload.description || '',
    };
    
    // Optional: If leader name provided
    if (payload.leaderName && String(payload.leaderName).trim()) {
      body.TeamLeaderName = payload.leaderName;
    }

    console.log('📤 Creating team with body:', body);

    const response = await post(BASE, body);
    return transformTeam(response?.data);
  } catch (error) {
    console.error('Error creating team:', error);
    
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
// UPDATE TEAM
// =====================================================
export async function updateTeam(id, updates) {
  try {
    const body = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.description !== undefined) body.description = updates.description;

    console.log('📤 Updating team:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformTeam(response?.data);
  } catch (error) {
    console.error('Error updating team:', error);
    
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
// DELETE TEAM
// =====================================================
export async function deleteTeam(id) {
  try {
    console.log('🗑️ Deleting team:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting team:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
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
      role: memberData.role || 'team_member',
    };

    const response = await post(`${BASE}/${teamId}/register-member`, body);
    return response?.data;
  } catch (error) {
    console.error('Error registering team member:', error);
    throw error;
  }
}

// =====================================================
// ADD EXISTING MEMBER TO TEAM
// (Backend doesn't have dedicated route, so refresh team)
// =====================================================
export async function addTeamMember(teamId, employeeId) {
  try {
    // Backend uses register-member endpoint or assign-leader
    // For adding existing member without login creation, no route yet
    console.warn('addTeamMember: No dedicated backend route yet');
    return getTeamById(teamId);
  } catch (error) {
    console.error('Error adding team member:', error);
    return getTeamById(teamId);
  }
}

// =====================================================
// REMOVE MEMBER FROM TEAM
// =====================================================
export async function removeTeamMember(teamId, employeeId) {
  try {
    console.warn('removeTeamMember: No dedicated backend route yet');
    return getTeamById(teamId);
  } catch (error) {
    console.error('Error removing team member:', error);
    return getTeamById(teamId);
  }
}

// =====================================================
// ASSIGN TEAM LEADER (promote existing user)
// Backend: PUT /company/teams/:teamId/assign-leader
// Body: { userId: 21 }
// =====================================================
export async function assignTeamLeader(teamId, userId) {
  try {
    console.log('📤 Assigning leader:', teamId, userId);
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
// COMPATIBILITY FUNCTIONS
// =====================================================
export async function assignProjectLeader(teamId, leaderName) {
  return getTeamById(teamId);
}

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
  const memberIds = (team.members || []).map((m) => m.id);

  return {
    id: team.id,
    name: team.name || '',
    description: team.description || '',
    status: 'Active',
    projectLeader: team.leader_name || 'Unassigned',
    leaderId: team.leader_id || null,
    leaderEmail: team.leader_email || null,
    totalMembers: memberCount,
    members: memberIds,
    memberDetails: team.members || [],
    projects: team.project_count || 0,
    projectIds: [],
    createdAt: formatDate(team.created_at),
    updatedAt: formatDate(team.updated_at),
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
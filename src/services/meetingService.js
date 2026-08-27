import { get, post, put, del } from './apiClient.js';

const BASE = '/company/meetings';

// =====================================================
// Meeting Type Mapping (Updated for new backend)
// =====================================================
const TYPE_TO_BACKEND = {
  Team: 'Team Meeting',
  'Team Meeting': 'Team Meeting',
  Client: 'Client',
  Leaders: 'Project Leader',
  'Project Leader': 'Project Leader',
  'Team Leads': 'Project Leader',
};

const TYPE_TO_FRONTEND = {
  'Team Meeting': 'Team',
  Client: 'Client',
  'Project Leader': 'Leaders',
  'Team Leads': 'Leaders',
};

const STATUS_TO_FRONTEND = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  live: 'Live',
};

// =====================================================
// GET ALL MEETINGS
// =====================================================
export async function getAllMeetings() {
  try {
    const response = await get(BASE);
    const meetings = response?.data || [];
    return meetings.map(transformMeeting);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return [];
  }
}

// =====================================================
// GET SINGLE MEETING
// =====================================================
export async function getMeetingById(id) {
  try {
    const response = await get(`${BASE}/${id}`);
    return transformMeeting(response?.data);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return null;
  }
}

// =====================================================
// CREATE MEETING (Smart Handling)
// =====================================================
export async function createMeeting(payload) {
  try {
    const audience = TYPE_TO_BACKEND[payload.type] || 'Team Meeting';

    const body = {
      Title: payload.title,
      toWhome: audience,
      ProjectName: payload.project || null,  // Always send project
      date: payload.date,
      time: payload.time ? convertTo24Hour(payload.time) : null,
      MeetingSource: payload.platform || 'Google Meet',
      MeetingLink: payload.meetingLink || '',
      description: payload.description || '',
    };

    // Handle audience-specific fields
    if (audience === 'Client') {
      body.ClientName = payload.meetingWith;
    } else if (audience === 'Project Leader') {
      // For Project Leader: meetingWith can be project name (use it!)
      if (payload.meetingWith) {
        body.ProjectName = payload.meetingWith;
      }
      // Backend will auto-find the leader from project
    } else {
      // Team Meeting
      body.Teams = payload.meetingWith ? [payload.meetingWith] : [];
    }

    console.log('📤 Creating meeting with body:', body);

    const response = await post(BASE, body);
    return transformMeeting(response?.data);
  } catch (error) {
    console.error('Error creating meeting:', error);
    
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }
    
    throw new Error(error.data?.message || error.message || 'Failed to create meeting');
  }
}

// =====================================================
// UPDATE MEETING
// =====================================================
export async function updateMeeting(id, updates) {
  try {
    const body = {};
    
    if (updates.title !== undefined) body.Title = updates.title;
    if (updates.type !== undefined) body.toWhome = TYPE_TO_BACKEND[updates.type];
    if (updates.project !== undefined) body.ProjectName = updates.project;
    if (updates.date !== undefined) body.date = updates.date;
    if (updates.time !== undefined) body.time = convertTo24Hour(updates.time);
    if (updates.platform !== undefined) body.MeetingSource = updates.platform;
    if (updates.meetingLink !== undefined) body.MeetingLink = updates.meetingLink;
    if (updates.description !== undefined) body.description = updates.description;
    if (updates.status !== undefined) body.status = updates.status.toLowerCase();
    
    if (updates.type && updates.meetingWith !== undefined) {
      const audience = TYPE_TO_BACKEND[updates.type];
      if (audience === 'Client') {
        body.ClientName = updates.meetingWith;
      } else if (audience === 'Project Leader') {
        body.ProjectName = updates.meetingWith;
      } else {
        body.Teams = updates.meetingWith ? [updates.meetingWith] : [];
      }
    }

    console.log('📤 Updating meeting:', id, body);

    const response = await put(`${BASE}/${id}`, body);
    return transformMeeting(response?.data);
  } catch (error) {
    console.error('Error updating meeting:', error);
    
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
// DELETE MEETING
// =====================================================
export async function deleteMeeting(id) {
  try {
    console.log('🗑️ Deleting meeting:', id);
    await del(`${BASE}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
    return false;
  }
}

// =====================================================
// CANCEL MEETING
// =====================================================
export async function cancelMeeting(id) {
  try {
    const response = await put(`${BASE}/${id}`, { status: 'cancelled' });
    return transformMeeting(response?.data);
  } catch (error) {
    console.error('Error cancelling meeting:', error);
    throw error;
  }
}

// =====================================================
// INVITE MEMBERS
// =====================================================
export async function inviteParticipants(meetingId, participants) {
  try {
    const body = {};
    
    if (Array.isArray(participants)) {
      body.Members = participants;
    } else if (typeof participants === 'object') {
      if (participants.members) body.Members = participants.members;
      if (participants.teams) body.Teams = participants.teams;
      if (participants.clientName) body.ClientName = participants.clientName;
    } else {
      body.Members = [participants];
    }

    const response = await post(`${BASE}/${meetingId}/invite`, body);
    return transformMeeting(response?.data);
  } catch (error) {
    console.error('Error inviting to meeting:', error);
    throw error;
  }
}

// =====================================================
// REMOVE PARTICIPANT
// =====================================================
export async function removeParticipant(meetingId, participants) {
  try {
    const body = {};
    if (Array.isArray(participants)) {
      body.Members = participants;
    } else {
      body.Members = [participants];
    }
    const response = await del(`${BASE}/${meetingId}/invite`, body);
    return transformMeeting(response?.data);
  } catch (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
}

// =====================================================
// HELPERS
// =====================================================
function convertTo24Hour(timeString) {
  if (!timeString) return null;
  const trimmed = String(timeString).trim();
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = match[3]?.toUpperCase();
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
  return trimmed;
}

function formatTime12(timeString) {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${period}`;
  } catch {
    return timeString;
  }
}

function formatDate(dateString) {
  if (!dateString) return 'TBD';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

function transformMeeting(meeting) {
  if (!meeting) return null;

  const teams = meeting.Teams || [];
  const members = meeting.Members || [];
  const backendType = meeting.toWhom || meeting.toWhome || 'Team Meeting';
  const frontendType = TYPE_TO_FRONTEND[backendType] || 'Team';
  
  let meetingWith = '';
  if (backendType === 'Client') {
    meetingWith = members[0]?.name || '';
  } else if (backendType === 'Project Leader' || backendType === 'Team Leads') {
    meetingWith = meeting.ProjectName || '';
  } else {
    meetingWith = teams[0]?.name || '';
  }

  return {
    id: meeting.id,
    title: meeting.Title || meeting.title || '',
    type: frontendType,
    typeBackend: backendType,
    project: meeting.ProjectName || 'Unassigned',
    projectId: meeting.project_id || null,
    date: meeting.date ? String(meeting.date).slice(0, 10) : '',
    dateFormatted: formatDate(meeting.date),
    time: meeting.time || '',
    timeFormatted: formatTime12(meeting.time),
    platform: meeting.MeetingSource || 'Google Meet',
    meetingLink: meeting.MeetingLink || '',
    organizer: 'Company Admin',
    status: STATUS_TO_FRONTEND[meeting.status] || 'Scheduled',
    description: meeting.description || '',
    meetingWith: meetingWith,
    teams: teams,
    members: members,
    participants: members,
    createdAt: formatDate(meeting.created_at),
    updatedAt: formatDate(meeting.updated_at),
  };
}
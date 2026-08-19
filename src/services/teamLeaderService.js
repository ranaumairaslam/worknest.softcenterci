import { get, post, put, patch, del } from './apiClient.js';
const BASE = "/team-leader";

/**
 * Helper:
 * API response ko safely data mein convert karta hai.
 */
const extractData = (response, fallback = []) => {
  if (response?.data !== undefined) {
    return response.data;
  }

  return response ?? fallback;
};

/**
 * GET DASHBOARD
 */
export const getTeamLeaderDashboard = async () => {
  const response = await get(`${BASE}/dashboard`);
  return extractData(response, {});
};
export const getDashboard = getTeamLeaderDashboard;

/**
 * GET PROJECTS
 */
export const getTeamLeaderProjects = async () => {
  const response = await get(`${BASE}/projects`);
  return extractData(response, []);
};
export const getProjects = getTeamLeaderProjects;

/**
 * GET MEMBERS
 */
export const getTeamLeaderMembers = async () => {
  const response = await get(`${BASE}/members`);
  return extractData(response, []);
};
export const getMembers = getTeamLeaderMembers;
/**
 * GET PROGRESS
 */
export const getTeamLeaderProgress = async () => {
  const response = await get(`${BASE}/progress`);
  const data = extractData(response, {});

  return [
    { id: 'total-tasks', label: 'Total Tasks', value: String(data.total_tasks ?? 0), note: 'This team', color: 'slate' },
    { id: 'completed', label: 'Completed', value: String(data.completed_tasks ?? 0), note: 'Done', color: 'emerald' },
    { id: 'in-progress', label: 'In Progress', value: String(data.in_progress_tasks ?? 0), note: 'Active', color: 'blue' },
    { id: 'pending', label: 'Pending', value: String(data.pending_tasks ?? 0), note: 'Needs attention', color: 'amber' },
    { id: 'blocked', label: 'Blocked', value: String(data.blocked_tasks ?? 0), note: 'At risk', color: 'rose' },
  ];
};
export const getProgress = getTeamLeaderProgress;

/**
 * GET TASKS
 */
export const getTeamLeaderTasks = async ({ projectId } = {}) => {
  const query = projectId
    ? `?projectId=${encodeURIComponent(projectId)}`
    : "";
  const response = await get(`${BASE}/tasks${query}`);
  return extractData(response, []);
};
export const getTasks = getTeamLeaderTasks;

/**
 * GET SUBMITTED TASKS
 */
export const getTeamLeaderSubmittedTasks = async () => {
  const response = await get(`${BASE}/tasks/submitted`);
  return extractData(response, []);
};
export const getSubmittedTasks = getTeamLeaderSubmittedTasks;

/**
 * APPROVE TASK
 */
export const approveTeamLeaderTask = async (taskId) => {
  const response = await post(`${BASE}/tasks/${taskId}/approve`);
  return extractData(response, {});
};
export const approveTask = approveTeamLeaderTask;

/**
 * RETURN TASK FOR REVISION
 */
export const returnTeamLeaderTaskForRevision = async (taskId, comment) => {
  const response = await post(`${BASE}/tasks/${taskId}/return`, { comment });
  return extractData(response, {});
};
export const returnTaskForRevision = returnTeamLeaderTaskForRevision;

/**
 * ASSIGN TASK
 */
export const assignTeamLeaderTask = async (taskId, memberId) => {
  const response = await post(`${BASE}/tasks/${taskId}/assign`, { memberId });
  return extractData(response, {});
};
export const assignTask = assignTeamLeaderTask;

/**
 * EDIT TASK
 */
export const editTeamLeaderTask = async (taskId, updates) => {
  const response = await put(`${BASE}/tasks/${taskId}`, updates);
  return extractData(response, {});
};
export const editTask = editTeamLeaderTask;

/**
 * DELETE TASK
 */
export const deleteTeamLeaderTask = async (taskId) => {
  const response = await del(`${BASE}/tasks/${taskId}`);
  return extractData(response, {});
};
export const deleteTask = deleteTeamLeaderTask;

/**
 * GET MEETINGS
 */
export const getTeamLeaderMeetings = async (params = {}) => {
  const response = await get(`${BASE}/meetings`, params);
  return extractData(response, []);
};

/**
 * CREATE MEETING
 */
export const createTeamLeaderMeeting = async (payload) => {
  const response = await post(`${BASE}/meetings`, payload);
  return extractData(response, {});
};

/**
 * CANCEL MEETING
 */
export const cancelTeamLeaderMeeting = async (meetingId) => {
  const response = await patch(`${BASE}/meetings/${meetingId}/cancel`, {});
  return extractData(response, {});
};
/**
 * GET REPORTS
 */
export const getTeamLeaderReports = async () => {
  const response = await get(`${BASE}/reports`);
  return extractData(response, { team: null, summary: {} });
};
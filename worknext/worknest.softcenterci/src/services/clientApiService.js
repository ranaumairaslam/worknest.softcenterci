import { get } from './apiClient.js';

const CLIENT_BASE = '/client';

export async function getClientDashboard() {
  const response = await get(`${CLIENT_BASE}/dashboard`);
  return response?.data || response || {};
}

export async function getClientProfile() {
  const response = await get(`${CLIENT_BASE}/profile`);
  return response?.data || null;
}

export async function getClientProjects() {
  const response = await get(`${CLIENT_BASE}/projects`);
  return response?.projects || [];
}

export async function getClientProject(projectId) {
  const response = await get(`${CLIENT_BASE}/projects/${projectId}`);
  return response?.project || null;
}

export async function getClientProjectProgress(projectId) {
  const response = await get(`${CLIENT_BASE}/projects/${projectId}/progress`);
  return {
    project: response?.project || null,
    progress: response?.progress || null,
    tasks: response?.tasks || [],
  };
}

export async function getClientProjectTasks(projectId) {
  const response = await get(`${CLIENT_BASE}/projects/${projectId}/tasks`);
  return {
    project: response?.project || null,
    tasks: response?.tasks || [],
  };
}

export async function getClientMeetings() {
  const response = await get(`${CLIENT_BASE}/meetings`);
  return response?.meetings || [];
}

export async function getClientMeeting(meetingId) {
  const response = await get(`${CLIENT_BASE}/meetings/${meetingId}`);
  return response?.meeting || null;
}

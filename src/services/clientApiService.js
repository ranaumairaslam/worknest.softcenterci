import { get, post, put, del } from './apiClient.js';

const BASE = '/client';

/**
 * =====================================================
 * CLIENT DASHBOARD
 * =====================================================
 */

/**
 * Get client dashboard data including stats, projects, and meetings
 * GET /api/client/dashboard
 */
export async function getClientDashboard() {
  try {
    const response = await get(`${BASE}/dashboard`);
    return response?.data || {};
  } catch (error) {
    console.error('Error fetching client dashboard:', error);
    throw error;
  }
}

/**
 * =====================================================
 * CLIENT PROJECTS
 * =====================================================
 */

/**
 * Get all client projects
 * GET /api/client/projects
 */
export async function getClientProjects() {
  try {
    const response = await get(`${BASE}/projects`);
    return response?.projects || [];
  } catch (error) {
    console.error('Error fetching client projects:', error);
    throw error;
  }
}

/**
 * Get single project details with tasks
 * GET /api/client/projects/:projectId
 */
export async function getClientProjectDetail(projectId) {
  try {
    const response = await get(`${BASE}/projects/${projectId}`);
    return response || {};
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Get project progress
 * GET /api/client/projects/:projectId/progress
 */
export async function getClientProjectProgress(projectId) {
  try {
    const response = await get(`${BASE}/projects/${projectId}/progress`);
    return response?.project || {};
  } catch (error) {
    console.error(`Error fetching project progress ${projectId}:`, error);
    throw error;
  }
}

/**
 * =====================================================
 * CLIENT MEETINGS
 * =====================================================
 */

/**
 * Get all client meetings
 * GET /api/client/meetings
 */
export async function getClientMeetings() {
  try {
    const response = await get(`${BASE}/meetings`);
    return response?.meetings || [];
  } catch (error) {
    console.error('Error fetching client meetings:', error);
    throw error;
  }
}

/**
 * Get single meeting details
 * GET /api/client/meetings/:meetingId
 */
export async function getClientMeetingDetail(meetingId) {
  try {
    const response = await get(`${BASE}/meetings/${meetingId}`);
    return response?.meeting || {};
  } catch (error) {
    console.error(`Error fetching meeting ${meetingId}:`, error);
    throw error;
  }
}

/**
 * Create a new meeting
 * POST /api/client/meetings
 */
export async function createClientMeeting(meetingData) {
  try {
    const response = await post(`${BASE}/meetings`, meetingData);
    return response?.meeting || {};
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
}

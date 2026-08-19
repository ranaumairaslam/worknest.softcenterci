import { get, post, put, patch } from './apiClient.js';

const BASE = '/team-leader';

const FRONTEND_STATUSES = {
  todo: 'todo',
  in_progress: 'in_progress',
  under_review: 'under_review',
  submitted: 'under_review',
  done: 'completed',
  blocked: 'blocked',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

function initialsFromName(name) {
  const safeName = String(name || 'Unassigned').trim();
  if (!safeName) return 'NA';
  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function mapTeamTask(task) {
  const status = FRONTEND_STATUSES[task.status] || 'todo';
  const projectId = task.project_id ?? task.projectId ?? null;
  const projectName = task.project_name || task.projectName || 'Untitled project';
  const assigneeName = task.assignee_name || task.assignee || 'Unassigned';

  return {
    id: task.id,
    title: task.title || task.name || 'Untitled task',
    name: task.title || task.name || 'Untitled task',
    status,
    priority: PRIORITY_LABELS[(task.priority || '').toLowerCase()] || 'Medium',
    dueDate: task.due_date || task.dueDate || null,
    assignee: assigneeName,
    assigneeId: task.assignee_id ?? task.assigneeId ?? null,
    projectId,
    projectName,
    progress: status === 'completed' ? 100 : status === 'under_review' ? 85 : status === 'in_progress' ? 60 : 0,
    member: {
      name: assigneeName,
      avatar: initialsFromName(assigneeName),
    },
  };
}

export async function getTeamLeaderDashboard() {
  const response = await get(`${BASE}/dashboard`);
  return response?.data || { team: {}, stats: {}, projects: [], members: [], recentTasks: [] };
}

export async function getTeamLeaderMeetings(params = {}) {
  const response = await get(`${BASE}/meetings`, params);
  return response?.data || [];
}

export async function createTeamLeaderMeeting(payload) {
  const response = await post(`${BASE}/meetings`, payload);
  return response?.data || null;
}

export async function cancelTeamLeaderMeeting(meetingId) {
  const response = await patch(`${BASE}/meetings/${meetingId}/cancel`, {});
  return response?.data || null;
}

export async function getTeamLeaderProjects() {
  const response = await get(`${BASE}/projects`);
  const projects = response?.data || [];

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    description: project.description || '',
    startDate: project.start_date || project.startDate || null,
    dueDate: project.due_date || project.dueDate || null,
    taskCount: project.task_count ?? project.taskCount ?? 0,
    tasks: project.task_count ?? project.taskCount ?? 0,
    leader: project.team_leader_name || project.leader || 'Unassigned',
  }));
}

export async function getTeamLeaderMembers() {
  const response = await get(`${BASE}/team-members`);
  const members = response?.data || [];

  return members.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    status: member.status,
    avatar: initialsFromName(member.name),
  }));
}

export async function getTeamLeaderTasks(params = {}) {
  const response = await get(`${BASE}/tasks`, params);
  const tasks = response?.data || [];
  return tasks.map(mapTeamTask);
}

export async function getTeamLeaderSubmittedTasks() {
  const response = await get(`${BASE}/tasks/submitted`);
  const tasks = response?.data || [];

  return tasks.map((task) => ({
    id: `d-${task.id}`,
    taskId: task.id,
    projectId: task.project_id ?? null,
    member: {
      name: task.assignee_name || 'Unassigned',
      avatar: initialsFromName(task.assignee_name || 'Unassigned'),
    },
    fileLabel: 'Attached files',
    linkLabel: 'View task',
    url: '#',
    title: task.title || 'Task review',
    status: task.status,
    priority: task.priority,
    projectName: task.project_name || 'Untitled project',
  }));
}

export async function getTeamLeaderProgress() {
  const response = await get(`${BASE}/progress`);
  const data = response?.data || {};

  return [
    { id: 'total-tasks', label: 'Total Tasks', value: String(data.total_tasks ?? 0), note: 'This team', color: 'slate' },
    { id: 'completed', label: 'Completed', value: String(data.completed_tasks ?? 0), note: 'Done', color: 'emerald' },
    { id: 'in-progress', label: 'In Progress', value: String(data.in_progress_tasks ?? 0), note: 'Active', color: 'blue' },
    { id: 'pending', label: 'Pending', value: String(data.pending_tasks ?? 0), note: 'Needs attention', color: 'amber' },
    { id: 'blocked', label: 'Blocked', value: String(data.blocked_tasks ?? 0), note: 'At risk', color: 'rose' },
  ];
}

export async function getTeamLeaderReports() {
  const response = await get(`${BASE}/reports`);
  return response?.data || { team: null, summary: {} };
}

export async function createTeamLeaderTask(taskPayload) {
  return post(`${BASE}/tasks`, taskPayload);
}

export async function assignTeamLeaderTask(taskId, assigneeId) {
  return put(`${BASE}/tasks/${taskId}/assign`, { assignedTo: assigneeId });
}

export async function updateTeamLeaderTaskPriority(taskId, priority) {
  return put(`${BASE}/tasks/${taskId}/priority`, { priority });
}

export async function approveTeamLeaderTask(taskId) {
  return post(`${BASE}/tasks/${taskId}/approve`, {});
}

export async function reviseTeamLeaderTask(taskId, reviewNote) {
  return post(`${BASE}/tasks/${taskId}/revision`, { reviewNote });
}

export async function addTeamLeaderMember(userId, role = 'team_member') {
  return post(`${BASE}/team-members`, { userId, role });
}

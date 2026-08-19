import { get, post, put, request } from './apiClient.js';

const BASE = '/team-leader';

const STATUS_TO_UI = {
  todo: 'todo',
  in_progress: 'in_progress',
  under_review: 'under_review',
  submitted: 'under_review',
  done: 'completed',
  blocked: 'in_progress',
};

const STATUS_TO_BACKEND = {
  todo: 'todo',
  in_progress: 'in_progress',
  under_review: 'under_review',
  completed: 'done',
};

const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
const initials = (value = '') => value.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '?';
const unwrap = (response) => response?.data ?? [];

export async function testConnection() {
  return unwrap(await get(`${BASE}/test`));
}

export async function getDashboard() {
  return unwrap(await get(`${BASE}/dashboard`));
}

export async function getProjects() {
  const projects = unwrap(await get(`${BASE}/projects`));
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    startDate: project.start_date,
    endDate: project.due_date,
    taskCount: project.task_count,
  }));
}

export async function getMembers() {
  return unwrap(await get(`${BASE}/members`));
}

export async function getLegacyMembers(path = '/team-members') {
  return unwrap(await get(`${BASE}${path}`));
}

export async function addEmployeeToTeam(employee, role = 'team_member') {
  return unwrap(await post(`${BASE}/members`, { Employee: employee, role }));
}

export async function getMembersByTeamName(teamName) {
  const data = unwrap(await get(`${BASE}/teams/members`, { TeamName: teamName }));
  return data.members || [];
}

function mapTask(task) {
  const status = STATUS_TO_UI[task.status] || 'todo';
  return {
    id: task.id,
    name: task.title,
    title: task.title,
    description: task.description || '',
    projectId: task.project_id,
    projectName: task.project_name,
    priority: titleCase(task.priority || 'medium'),
    status,
    assigneeId: task.assignee_id,
    assigneeName: task.assignee_name || 'Unassigned',
    assignee: initials(task.assignee_name),
    dueDate: task.due_date ? String(task.due_date).slice(0, 10) : 'TBD',
    progress: status === 'completed' ? 100 : status === 'under_review' ? 85 : status === 'in_progress' ? 50 : 0,
    category: task.project_name || 'Team task',
  };
}

export async function getTasks(params = {}) {
  const data = unwrap(await get(`${BASE}/tasks`, { limit: 100, ...params }));
  return data.map(mapTask);
}

export async function getSubmittedTasks() {
  const data = unwrap(await get(`${BASE}/tasks/submitted`));
  return data.map(mapTask);
}

export async function createTask(task) {
  const response = await post(`${BASE}/tasks`, {
    title: task.title || task.name,
    description: task.description || '',
    projectId: task.projectId,
    assigneeId: task.assigneeId || null,
    dueDate: task.dueDate || null,
    priority: String(task.priority || 'medium').toLowerCase(),
  });
  return mapTask(unwrap(response));
}

export async function assignTask(taskId, assigneeId) {
  return unwrap(await put(`${BASE}/tasks/${taskId}/assign`, { assignedTo: assigneeId }));
}

export async function updateTaskPriority(taskId, priority) {
  return unwrap(await put(`${BASE}/tasks/${taskId}/priority`, { priority: String(priority).toLowerCase() }));
}

export async function editTask(taskId, updates) {
  const body = { taskId };
  if (updates.name !== undefined || updates.title !== undefined) body.NewTaskName = updates.name || updates.title;
  if (updates.description !== undefined) body.TaskDescription = updates.description;
  if (updates.assigneeName !== undefined) body.TeamMemberName = updates.assigneeName;
  if (updates.priority !== undefined) body.Priority = String(updates.priority).toLowerCase();
  if (updates.dueDate !== undefined) body.Date = updates.dueDate;
  const response = await put(`${BASE}/tasks/assign`, body);
  return unwrap(response);
}

export async function deleteTask(taskId) {
  return unwrap(await request(`${BASE}/tasks/assign?taskId=${encodeURIComponent(taskId)}`, { method: 'DELETE' }));
}

export async function approveTask(taskId) {
  return unwrap(await put(`${BASE}/tasks/${taskId}/approve`, {}));
}

export async function returnTaskForRevision(taskId, reviewNote = '') {
  return unwrap(await put(`${BASE}/tasks/${taskId}/revision`, { reviewNote }));
}

export async function getProgress() {
  return unwrap(await get(`${BASE}/progress`));
}

export async function getReport(params) {
  return unwrap(await get(`${BASE}/reports`, params));
}

export function backendStatus(status) {
  return STATUS_TO_BACKEND[status] || 'todo';
}

export async function assignTaskByNames(payload) {
  return unwrap(await post(`${BASE}/tasks/assign`, payload));
}

export async function deleteTaskByNames(payload) {
  return unwrap(await request(`${BASE}/tasks/assign`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  }));
}
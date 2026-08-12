import { createProject as createCanonicalProject } from "./projectService";
import {
  getTeamLeaderDashboard,
  getTeamLeaderProjects,
  getTeamLeaderMembers,
  getTeamLeaderTasks,
  getTeamLeaderSubmittedTasks,
  getTeamLeaderProgress,
  assignTeamLeaderTask,
  approveTeamLeaderTask,
  reviseTeamLeaderTask,
  mapTeamTask,
} from "./teamLeaderService";

export async function getProjects(role) {
  return getTeamLeaderProjects();
}

export async function getProjectTasks(projectId, role) {
  const tasks = await getTeamLeaderTasks({ projectId });
  return tasks
    .filter((task) => !projectId || String(task.projectId) === String(projectId))
    .map((task) => ({
      id: task.id,
      title: task.title,
      status: task.status,
      assignee: {
        name: task.assignee,
        avatar: task.member?.avatar || "NA",
      },
      projectId: task.projectId,
      projectName: task.projectName,
      priority: task.priority,
      dueDate: task.dueDate,
    }));
}

export async function getPendingDeliverables(projectId, role) {
  const items = await getTeamLeaderSubmittedTasks();
  return items
    .filter((item) => !projectId || String(item.projectId) === String(projectId))
    .map((item) => ({
      id: item.id,
      taskId: item.taskId,
      member: item.member,
      fileLabel: item.fileLabel,
      linkLabel: item.linkLabel,
      url: item.url,
      title: item.title,
      projectName: item.projectName,
    }));
}

export async function approveDeliverable(id, comment, role) {
  const taskId = String(id).replace(/^d-/, "");
  const response = await approveTeamLeaderTask(taskId);
  return { id, status: "approved", comment, response };
}

export async function rejectDeliverable(id, comment, role) {
  const taskId = String(id).replace(/^d-/, "");
  const response = await reviseTeamLeaderTask(taskId, comment || "Needs revision");
  return { id, status: "rejected", comment, response };
}

export async function getTeamProgressStats(projectId, role) {
  const stats = await getTeamLeaderProgress();
  return stats.map((item) => ({
    ...item,
    label: item.label,
    value: String(item.value ?? 0),
  }));
}

export async function getTeamMembers(projectId) {
  const members = await getTeamLeaderMembers();
  return members.map((member) => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    role: member.role,
    email: member.email,
  }));
}

export async function reassignTask(taskId, memberId, role) {
  const response = await assignTeamLeaderTask(taskId, memberId);
  return response;
}

export async function createProject(project, role) {
  return createCanonicalProject(project);
}

export async function getLeaderDashboardData() {
  return getTeamLeaderDashboard();
}

export async function getLeaderTeamTasks(params = {}) {
  const tasks = await getTeamLeaderTasks(params);
  return tasks.map(mapTeamTask);
}

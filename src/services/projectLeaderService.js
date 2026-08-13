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
  try {
    return await getTeamLeaderProjects();
  } catch (error) {
    console.warn("Project leader projects unavailable:", error);
    return [];
  }
}

export async function getProjectTasks(projectId, role) {
  try {
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
  } catch (error) {
    console.warn("Project leader tasks unavailable:", error);
    return [];
  }
}

export async function getPendingDeliverables(projectId, role) {
  try {
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
  } catch (error) {
    console.warn("Project leader deliverables unavailable:", error);
    return [];
  }
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
  try {
    const stats = await getTeamLeaderProgress();
    return stats.map((item) => ({
      ...item,
      label: item.label,
      value: String(item.value ?? 0),
    }));
  } catch (error) {
    console.warn("Project leader progress unavailable:", error);
    return [];
  }
}

export async function getTeamMembers(projectId) {
  try {
    const members = await getTeamLeaderMembers();
    return members.map((member) => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      role: member.role,
      email: member.email,
    }));
  } catch (error) {
    console.warn("Project leader team members unavailable:", error);
    return [];
  }
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

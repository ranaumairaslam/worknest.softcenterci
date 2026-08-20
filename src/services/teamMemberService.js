import { getCurrentUser } from "./authContext.js";
import { getTasksByAssignee, getAllTasks } from "./taskService.js";
import { getAllProjects } from "./projectService.js";
import { get, post } from "./apiClient.js";

function mapTaskForKanban(task) {
  const statusMap = {
    Pending: "todo",
    "To Do": "todo",
    "In Progress": "in_progress",
    Review: "under_review",
    "Under Review": "under_review",
    Completed: "completed",
    Rejected: "in_progress",
  };

  const initials = (task.assignee || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: task.id,
    title: task.name,
    status: statusMap[task.status] || "todo",
    project: task.project,
    assignee: { name: task.assignee, avatar: initials },
  };
}

export async function getMyTasks(role) {
  const user = getCurrentUser(role);
  const tasks = await getTasksByAssignee(user.employeeId, role);
  return tasks.map(mapTaskForKanban);
}

export async function getTeamTasks(role) {
  const user = getCurrentUser(role);
  const projects = await getAllProjects(role);
  const myProjectIds = projects.map((p) => p.id);
  const allTasks = await getAllTasks(role);
  const teamTasks = allTasks.filter((t) => myProjectIds.includes(t.projectId));
  return teamTasks.map(mapTaskForKanban);
}

export async function submitTaskWork(taskId, payload) {
  const response = await post(
    `/team-member/tasks/${taskId}/submit`,
    {
      comment: payload?.comment || "",
      attachments: payload?.attachments || [],
    }
  );

  return response;
}
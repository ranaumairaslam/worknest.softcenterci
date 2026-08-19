import { getAllProjects, createProject as createCanonicalProject } from "./projectService";
import { getTasksByProject, updateTask } from "./taskService";
import { getProjectById } from "./projectService";
import { getEmployeeById } from "./employeeService";
import { getActor } from "./authContext";
import { computeLiveStats } from "../utils/projectStats";

const STATUS_MAP = {
  Pending: "todo",
  "In Progress": "in_progress",
  Review: "under_review",
  "Under Review": "under_review",
  Completed: "completed",
  Rejected: "in_progress",
};

function mapTaskForLeader(task) {
  const initials = (task.assignee || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: task.id,
    title: task.name,
    status: STATUS_MAP[task.status] || "todo",
    assignee: { name: task.assignee, avatar: initials },
  };
}

export async function getProjects(role) {
  return getAllProjects(role);
}

export async function getProjectTasks(projectId, role) {
  const tasks = await getTasksByProject(projectId, role);
  return tasks.map(mapTaskForLeader);
}

export async function getPendingDeliverables(projectId, role) {
  const tasks = await getTasksByProject(projectId, role);
  return tasks
    .filter((t) => t.status === "Review" || t.status === "Under Review")
    .map((t) => ({
      id: `d-${t.id}`,
      taskId: t.id,
      member: {
        name: t.assignee,
        avatar: (t.assignee || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      },
      fileLabel: "Attached files",
      linkLabel: "link/ZIP",
      url: "https://documents.com/ZIP",
    }));
}

export async function approveDeliverable(id, comment, role) {
  const taskId = id.replace(/^d-/, "");
  await updateTask(taskId, { status: "Completed", progress: 100 }, getActor(role));
  return { id, status: "approved", comment };
}

export async function rejectDeliverable(id, comment, role) {
  const taskId = id.replace(/^d-/, "");
  await updateTask(taskId, { status: "In Progress", progress: 50 }, getActor(role));
  return { id, status: "rejected", comment };
}

export async function getTeamProgressStats(projectId, role) {
  const [project, tasks] = await Promise.all([
    getProjectById(projectId),
    getTasksByProject(projectId, role),
  ]);

  const baseStats = [
    { id: "team-members", label: "Team Members", value: String(project?.members || 0), note: "Active" },
    { id: "in-progress", label: "Tasks in Progress", value: "0", note: "This project" },
    { id: "overdue", label: "Overdue Tasks", value: "0", note: "Needs attention" },
    { id: "completion", label: "Completion", value: "0%", note: "Live" },
  ];

  const mappedTasks = tasks.map((t) => ({
    ...t,
    status: t.status === "In Progress" ? "In Progress" : t.status,
  }));

  return computeLiveStats(baseStats, mappedTasks);
}

export async function getTeamMembers(projectId) {
  const project = await getProjectById(projectId);
  if (!project?.memberIds?.length) return [];

  const members = await Promise.all(project.memberIds.map((id) => getEmployeeById(id)));
  return members.filter(Boolean).map((m) => ({
    id: m.id,
    name: m.name,
    avatar: m.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
  }));
}

export async function reassignTask(taskId, memberId, role) {
  const member = await getEmployeeById(memberId);
  if (!member) return { taskId, memberId };
  return updateTask(taskId, { assignee: member.name, assigneeId: member.id }, getActor(role));
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

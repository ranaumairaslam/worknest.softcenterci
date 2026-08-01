import { normalizeFilters, getActor } from "./authContext";
import { filterTasks } from "../utils/roleFilter";
import { incrementTaskCount, recalculateProgress } from "./projectService";
import { getEmployeeByName, incrementTasksAssigned } from "./employeeService";
import { getProjectById } from "./projectService";
import { onTaskAssigned, onTaskStatusChanged } from "./syncService";

const STATUS_PROGRESS = {
  Pending: 0,
  "In Progress": 50,
  Review: 85,
  "Under Review": 85,
  Completed: 100,
  Rejected: 20,
};

let tasks = [
  {
    id: "t1",
    name: "API Documentation",
    project: "Alpha Platform Rebrand",
    projectId: "p1",
    priority: "High",
    status: "Pending",
    dueDate: "2026-07-28",
    assignee: "Sarah Khan",
    assigneeId: "e1",
    progress: 0,
  },
  {
    id: "t2",
    name: "Homepage Wireframe",
    project: "CRM Dashboard",
    projectId: "p2",
    priority: "Medium",
    status: "In Progress",
    dueDate: "2026-07-30",
    assignee: "Areeba Noor",
    assigneeId: "e3",
    progress: 50,
  },
  {
    id: "t3",
    name: "Backend API Integration",
    project: "AI Recommendation Engine",
    projectId: "p6",
    priority: "High",
    status: "Review",
    dueDate: "2026-07-29",
    assignee: "Ahmed Ali",
    assigneeId: "e2",
    progress: 85,
  },
  {
    id: "t4",
    name: "Payroll System Testing",
    project: "HR Management System",
    projectId: "p3",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-07-25",
    assignee: "Bilal Ahmed",
    assigneeId: "e4",
    progress: 100,
  },
  {
    id: "t5",
    name: "Client Review Prep",
    project: "Finance Portal",
    projectId: "p7",
    priority: "Medium",
    status: "Rejected",
    dueDate: "2026-07-24",
    assignee: "Zain Ahmed",
    assigneeId: null,
    progress: 20,
  },
];

async function resolveTaskPayload(payload) {
  const resolved = { ...payload };

  if (payload.project && !payload.projectId) {
    const { getAllProjects } = await import("./projectService");
    const allProjects = await getAllProjects("companyAdmin");
    const project = allProjects.find((p) => p.name === payload.project);
    if (project) resolved.projectId = project.id;
  }

  if (payload.assignee && !payload.assigneeId) {
    const employee = await getEmployeeByName(payload.assignee);
    if (employee) resolved.assigneeId = employee.id;
  }

  if (payload.status && !payload.progress) {
    resolved.progress = STATUS_PROGRESS[payload.status] ?? 0;
  }

  return resolved;
}

export async function getAllTasks(roleOrFilters) {
  const filters = normalizeFilters(roleOrFilters);
  return filterTasks(tasks, filters).map((task) => ({ ...task }));
}

export async function getTaskById(id) {
  return tasks.find((task) => task.id === id) || null;
}

export async function getTasksByProject(projectId, roleOrFilters) {
  const all = await getAllTasks(roleOrFilters);
  return all.filter((t) => t.projectId === projectId);
}

export async function getTasksByAssignee(assigneeId, roleOrFilters) {
  const all = await getAllTasks(roleOrFilters);
  return all.filter((t) => t.assigneeId === assigneeId);
}

export async function createTask(payload, roleOrActor) {
  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const resolved = await resolveTaskPayload(payload);

  const project = resolved.projectId ? await getProjectById(resolved.projectId) : null;

  const newTask = {
    id: `t${Date.now()}`,
    name: resolved.name,
    project: project?.name || resolved.project || "Unassigned",
    projectId: resolved.projectId || null,
    priority: resolved.priority || "Medium",
    status: resolved.status || "Pending",
    dueDate: resolved.dueDate || "TBD",
    assignee: resolved.assignee || "Unassigned",
    assigneeId: resolved.assigneeId || null,
    progress: resolved.progress ?? STATUS_PROGRESS[resolved.status || "Pending"] ?? 0,
  };

  tasks.push(newTask);

  if (newTask.projectId) await incrementTaskCount(newTask.projectId);
  if (newTask.assigneeId) await incrementTasksAssigned(newTask.assigneeId);
  await onTaskAssigned(newTask, actor);

  return { ...newTask };
}

export async function updateTask(id, updates, roleOrActor) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;

  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const oldStatus = tasks[index].status;
  const resolved = await resolveTaskPayload({ ...tasks[index], ...updates });

  if (resolved.status && resolved.status !== oldStatus) {
    resolved.progress = STATUS_PROGRESS[resolved.status] ?? tasks[index].progress;
  }

  tasks[index] = {
    ...tasks[index],
    ...resolved,
    lastModifiedByRole: actor.role,
  };

  if (resolved.status && resolved.status !== oldStatus) {
    if (tasks[index].projectId) await recalculateProgress(tasks[index].projectId);
    await onTaskStatusChanged(tasks[index], oldStatus, resolved.status, actor);
  }

  return { ...tasks[index] };
}

export async function deleteTask(id, roleOrActor) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;

  const task = tasks[index];
  tasks.splice(index, 1);

  if (task.projectId) await recalculateProgress(task.projectId);
  return true;
}

export async function getTasksByStatus(status, roleOrFilters) {
  const all = await getAllTasks(roleOrFilters);
  if (status === "All") return all;
  return all.filter((task) => task.status === status);
}

export async function getTaskStatistics(roleOrFilters) {
  const all = await getAllTasks(roleOrFilters);
  const counts = all.reduce(
    (acc, task) => {
      acc.total += 1;
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  return [
    { id: "total-tasks", label: "Total Tasks", value: counts.total, note: "Updated live" },
    { id: "pending-tasks", label: "Pending Tasks", value: counts.Pending || 0, note: "Requires action" },
    { id: "in-progress-tasks", label: "In Progress", value: counts["In Progress"] || 0, note: "On track" },
    { id: "review-tasks", label: "Under Review", value: (counts.Review || 0) + (counts["Under Review"] || 0), note: "Needs approval" },
    { id: "completed-tasks", label: "Completed Tasks", value: counts.Completed || 0, note: "Finished work" },
    { id: "rejected-tasks", label: "Rejected Tasks", value: counts.Rejected || 0, note: "Needs rework" },
  ];
}

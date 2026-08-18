import { getTeamByName, linkProject as linkTeamProject, unlinkProject as unlinkTeamProject } from "./teamService.js";
import { getClientByName, linkProject as linkClientProject, unlinkProject as unlinkClientProject } from "./clientService.js";
import { getEmployeeByName, assignToProject as assignEmployeeToProject, unassignFromProject } from "./employeeService.js";
import { normalizeFilters, getActor } from "./authContext.js";
import { filterProjects } from "../utils/roleFilter.js";
import {
  onProjectCreated,
  onProjectUpdated,
  onProjectDeleted,
  onProjectCompleted,
} from "./syncService.js";

let projects = [
  {
    id: "p1",
    name: "Alpha Platform Rebrand",
    description: "Modernize the company website with a new design and improved user experience.",
    leader: "Sarah Khan",
    leaderId: "e1",
    team: "Web Development",
    teamId: "tm1",
    client: "SoftCentric Ltd.",
    clientId: "c1",
    memberIds: ["e1"],
    members: 1,
    progress: 72,
    status: "Active",
    priority: "High",
    dueDate: "31 Aug 2026",
    completedTasks: 18,
    totalTasks: 25,
    color: "bg-cyan-500",
    revenue: 85000,
  },
  {
    id: "p2",
    name: "CRM Dashboard",
    description: "Develop an analytics dashboard for customer relationship management.",
    leader: "Ahmed Ali",
    leaderId: "e2",
    team: "Backend Team",
    teamId: "tm2",
    client: "Vertex Solutions",
    clientId: "c2",
    memberIds: ["e2"],
    members: 1,
    progress: 94,
    status: "Review",
    priority: "Medium",
    dueDate: "28 Jul 2026",
    completedTasks: 32,
    totalTasks: 34,
    color: "bg-emerald-500",
    revenue: 120000,
  },
  {
    id: "p3",
    name: "HR Management System",
    description: "Build an employee management and payroll solution.",
    leader: "Bilal Ahmed",
    leaderId: "e4",
    team: "HR Team",
    teamId: "tm4",
    client: "Novatech Partners",
    clientId: "c3",
    memberIds: ["e4"],
    members: 1,
    progress: 43,
    status: "In Progress",
    priority: "High",
    dueDate: "15 Sep 2026",
    completedTasks: 9,
    totalTasks: 21,
    color: "bg-orange-500",
    revenue: 65000,
  },
  {
    id: "p4",
    name: "Inventory System",
    description: "Centralize inventory and warehouse management.",
    leader: "Areeba Noor",
    leaderId: "e3",
    team: "ERP Team",
    teamId: "tm3",
    client: "Vertex Solutions",
    clientId: "c2",
    memberIds: ["e3"],
    members: 1,
    progress: 88,
    status: "Active",
    priority: "Low",
    dueDate: "20 Aug 2026",
    completedTasks: 22,
    totalTasks: 25,
    color: "bg-violet-500",
    revenue: 95000,
  },
  {
    id: "p5",
    name: "Mobile Banking App",
    description: "Cross-platform banking application with secure authentication.",
    leader: "Usman Tariq",
    leaderId: "e6",
    team: "Mobile Team",
    teamId: "tm6",
    client: "SoftCentric Ltd.",
    clientId: "c1",
    memberIds: ["e6", "e7", "e8", "e9", "e10", "e11", "e12", "e13", "e14", "e15"],
    members: 10,
    progress: 61,
    status: "In Progress",
    priority: "High",
    dueDate: "10 Oct 2026",
    completedTasks: 17,
    totalTasks: 28,
    color: "bg-pink-500",
    revenue: 150000,
  },
  {
    id: "p6",
    name: "AI Recommendation Engine",
    description: "Machine learning powered recommendation system.",
    leader: "Waleed Hassan",
    leaderId: "e5",
    team: "AI Team",
    teamId: "tm5",
    client: "Novatech Partners",
    clientId: "c3",
    memberIds: ["e5"],
    members: 1,
    progress: 38,
    status: "Planning",
    priority: "High",
    dueDate: "25 Oct 2026",
    completedTasks: 5,
    totalTasks: 18,
    color: "bg-indigo-500",
    revenue: 110000,
  },
  {
    id: "p7",
    name: "Finance Portal",
    description: "Company expense tracking and finance management.",
    leader: "Hamza Khan",
    leaderId: null,
    team: "Finance Team",
    teamId: null,
    client: null,
    clientId: null,
    memberIds: [],
    members: 4,
    progress: 97,
    status: "Completed",
    priority: "Medium",
    dueDate: "12 Jul 2026",
    completedTasks: 40,
    totalTasks: 40,
    color: "bg-green-500",
    revenue: 78000,
  },
  {
    id: "p8",
    name: "Customer Support Portal",
    description: "Ticketing and customer complaint management platform.",
    leader: "Zain Ahmed",
    leaderId: null,
    team: "Support Team",
    teamId: null,
    client: null,
    clientId: null,
    memberIds: [],
    members: 6,
    progress: 79,
    status: "Active",
    priority: "Medium",
    dueDate: "18 Aug 2026",
    completedTasks: 19,
    totalTasks: 24,
    color: "bg-sky-500",
    revenue: 62000,
  },
];

async function resolvePayload(payload) {
  const resolved = { ...payload };

  if (payload.leader && !payload.leaderId) {
    const employee = await getEmployeeByName(payload.leader);
    if (employee) resolved.leaderId = employee.id;
  }

  if (payload.team && !payload.teamId) {
    const team = await getTeamByName(payload.team);
    if (team) {
      resolved.teamId = team.id;
      resolved.memberIds = payload.memberIds || [...team.members];
      resolved.members = resolved.memberIds.length;
    }
  }

  if (payload.client && !payload.clientId) {
    const client = await getClientByName(payload.client);
    if (client) resolved.clientId = client.id;
  }

  return resolved;
}

async function syncProjectLinks(project, previous = null) {
  if (previous?.teamId && previous.teamId !== project.teamId) {
    await unlinkTeamProject(previous.teamId, project.id);
  }
  if (project.teamId) {
    await linkTeamProject(project.teamId, project.id);
  }

  if (previous?.clientId && previous.clientId !== project.clientId) {
    await unlinkClientProject(previous.clientId, project.id);
  }
  if (project.clientId) {
    await linkClientProject(project.clientId, project.id);
  }

  const previousMembers = new Set(previous?.memberIds || []);
  const currentMembers = new Set(project.memberIds || []);

  for (const memberId of previousMembers) {
    if (!currentMembers.has(memberId)) {
      await unassignFromProject(memberId, project.id);
    }
  }

  for (const memberId of currentMembers) {
    await assignEmployeeToProject(memberId, project.id);
  }

  if (project.leaderId && !currentMembers.has(project.leaderId)) {
    await assignEmployeeToProject(project.leaderId, project.id);
  }
}

export async function getAllProjects(roleOrFilters) {
  const filters = normalizeFilters(roleOrFilters);
  return filterProjects(projects, filters).map((p) => ({ ...p, memberIds: [...(p.memberIds || [])] }));
}

export async function getProjectById(id) {
  const project = projects.find((p) => p.id === id);
  return project ? { ...project, memberIds: [...(project.memberIds || [])] } : null;
}

export async function getProjectsByClient(clientId, roleOrFilters) {
  const all = await getAllProjects(roleOrFilters);
  return all.filter((p) => p.clientId === clientId);
}

export async function createProject(payload, roleOrActor) {
  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const resolved = await resolvePayload(payload);

  const newProject = {
    id: `p${Date.now()}`,
    name: resolved.name,
    description: resolved.description || "",
    leader: resolved.leader || "Unassigned",
    leaderId: resolved.leaderId || null,
    team: resolved.team || "Unassigned",
    teamId: resolved.teamId || null,
    client: resolved.client || null,
    clientId: resolved.clientId || null,
    memberIds: resolved.memberIds || [],
    members: resolved.members ?? (resolved.memberIds?.length || 0),
    progress: resolved.progress || 0,
    status: resolved.status || "Planning",
    priority: resolved.priority || "Medium",
    dueDate: resolved.dueDate || "TBD",
    completedTasks: resolved.completedTasks || 0,
    totalTasks: resolved.totalTasks || 0,
    color: resolved.color || "bg-cyan-500",
    revenue: resolved.revenue || 0,
  };

  projects.push(newProject);
  await syncProjectLinks(newProject);
  await onProjectCreated(newProject, actor);

  return { ...newProject, memberIds: [...newProject.memberIds] };
}

export async function updateProject(id, updates, roleOrActor) {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const previous = { ...projects[index], memberIds: [...(projects[index].memberIds || [])] };
  const resolved = await resolvePayload({ ...previous, ...updates });

  projects[index] = {
    ...projects[index],
    ...resolved,
    memberIds: resolved.memberIds || projects[index].memberIds || [],
    members: resolved.members ?? (resolved.memberIds?.length || projects[index].members),
    lastModifiedByRole: actor.role,
  };

  await syncProjectLinks(projects[index], previous);
  await onProjectUpdated(projects[index], actor, {
    leaderId: projects[index].leaderId,
    previousLeaderId: previous.leaderId,
  });

  return { ...projects[index], memberIds: [...projects[index].memberIds] };
}

export async function deleteProject(id, roleOrActor) {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const project = { ...projects[index] };
  projects.splice(index, 1);

  if (project.teamId) await unlinkTeamProject(project.teamId, id);
  if (project.clientId) await unlinkClientProject(project.clientId, id);
  for (const memberId of project.memberIds || []) {
    await unassignFromProject(memberId, id);
  }

  await onProjectDeleted(project, actor);
  return true;
}

export async function markProjectCompleted(id, roleOrActor) {
  const actor = typeof roleOrActor === "object" && roleOrActor?.role
    ? roleOrActor
    : getActor(typeof roleOrActor === "string" ? roleOrActor : "companyAdmin");

  const project = await updateProject(id, { status: "Completed", progress: 100 }, actor);
  if (project) await onProjectCompleted(project, actor);
  return project;
}

export async function assignProjectLeader(id, leaderName, roleOrActor) {
  const employee = await getEmployeeByName(leaderName);
  return updateProject(id, { leader: leaderName, leaderId: employee?.id || null }, roleOrActor);
}

export async function incrementTaskCount(projectId) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;
  project.totalTasks = (project.totalTasks || 0) + 1;
  return { ...project };
}

export async function recalculateProgress(projectId) {
  const { getTasksByProject } = await import("./taskService");
  const projectTasks = await getTasksByProject(projectId);
  const total = projectTasks.length;
  const completed = projectTasks.filter((t) => t.status === "Completed").length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const project = projects.find((p) => p.id === projectId);
  if (!project) return null;

  project.totalTasks = total;
  project.completedTasks = completed;
  project.progress = progress;

  return { ...project };
}

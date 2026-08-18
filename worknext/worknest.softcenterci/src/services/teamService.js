let teams = [
  {
    id: "tm1",
    name: "Web Development",
    description: "Frontend and backend web application development team.",
    status: "Active",
    projectLeader: "Sarah Khan",
    leaderId: "e1",
    totalMembers: 1,
    projects: 1,
    projectIds: ["p1"],
    createdAt: "Jan 15, 2025",
    members: ["e1"],
    progress: 72,
  },
  {
    id: "tm2",
    name: "Backend Team",
    description: "Server-side architecture and API development.",
    status: "Active",
    projectLeader: "Ahmed Ali",
    leaderId: "e2",
    totalMembers: 1,
    projects: 1,
    projectIds: ["p2"],
    createdAt: "Feb 10, 2025",
    members: ["e2"],
    progress: 85,
  },
  {
    id: "tm3",
    name: "ERP Team",
    description: "Enterprise resource planning and inventory systems.",
    status: "Active",
    projectLeader: "Areeba Noor",
    leaderId: "e3",
    totalMembers: 1,
    projects: 1,
    projectIds: ["p4"],
    createdAt: "Mar 05, 2025",
    members: ["e3"],
    progress: 68,
  },
  {
    id: "tm4",
    name: "HR Team",
    description: "Human resources and employee management.",
    status: "Active",
    projectLeader: "Bilal Ahmed",
    leaderId: "e4",
    totalMembers: 1,
    projects: 1,
    projectIds: ["p3"],
    createdAt: "Apr 20, 2025",
    members: ["e4"],
    progress: 55,
  },
  {
    id: "tm5",
    name: "AI Team",
    description: "Machine learning and AI-powered solutions.",
    status: "Active",
    projectLeader: "Waleed Hassan",
    leaderId: "e5",
    totalMembers: 1,
    projects: 1,
    projectIds: ["p6"],
    createdAt: "May 12, 2025",
    members: ["e5"],
    progress: 45,
  },
  {
    id: "tm6",
    name: "Mobile Team",
    description: "Cross-platform mobile application development.",
    status: "Active",
    projectLeader: "Usman Tariq",
    leaderId: "e6",
    totalMembers: 10,
    projects: 1,
    projectIds: ["p5"],
    createdAt: "Jun 01, 2025",
    members: ["e6", "e7", "e8", "e9", "e10", "e11", "e12", "e13", "e14", "e15"],
    progress: 61,
  },
];

export async function getAllTeams(role) {
  return teams.map((team) => ({ ...team, members: [...team.members], projectIds: [...(team.projectIds || [])], role: role || undefined }));
}

export async function getTeamById(id, role) {
  const team = teams.find((t) => t.id === id);
  return team ? { ...team, members: [...team.members], projectIds: [...(team.projectIds || [])], role: role || undefined } : null;
}

export async function getTeamByName(name, role) {
  const team = teams.find((t) => t.name === name);
  return team ? { ...team, members: [...team.members], projectIds: [...(team.projectIds || [])], role: role || undefined } : null;
}

export async function createTeam(payload, role, actor) {
  const newTeam = {
    id: `tm${Date.now()}`,
    name: payload.name,
    description: payload.description || "",
    status: payload.status || "Active",
    projectLeader: payload.projectLeader || "Unassigned",
    leaderId: payload.leaderId || null,
    totalMembers: payload.members?.length || 0,
    projects: 0,
    projectIds: [],
    createdAt: payload.createdAt || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    members: payload.members || [],
    progress: payload.progress || 0,
  };

  const entry = { ...newTeam, role: role || undefined };
  teams.push(entry);

  if (actor) {
    const { onTeamCreated } = await import("./syncService");
    await onTeamCreated(entry, actor);
  }

  return { ...entry, members: [...entry.members] };
}

export async function updateTeam(id, updates, role) {
  const index = teams.findIndex((t) => t.id === id);
  if (index === -1) return null;
  teams[index] = { ...teams[index], ...updates, lastModifiedByRole: role || teams[index].lastModifiedByRole };
  return { ...teams[index], members: [...teams[index].members], projectIds: [...(teams[index].projectIds || [])] };
}

export async function deleteTeam(id, role) {
  const index = teams.findIndex((t) => t.id === id);
  if (index === -1) return false;
  teams.splice(index, 1);
  return true;
}

export async function addTeamMember(teamId, employeeId, role) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;

  if (!team.members.includes(employeeId)) {
    team.members.push(employeeId);
    team.totalMembers = team.members.length;
  }

  return { ...team, members: [...team.members], projectIds: [...(team.projectIds || [])] };
}

export async function removeTeamMember(teamId, employeeId, role) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;

  team.members = team.members.filter((id) => id !== employeeId);
  team.totalMembers = team.members.length;

  return { ...team, members: [...team.members], projectIds: [...(team.projectIds || [])] };
}

export async function assignProjectLeader(teamId, leaderName, role) {
  return updateTeam(teamId, { projectLeader: leaderName }, role);
}

export async function linkProject(teamId, projectId) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;

  if (!team.projectIds) team.projectIds = [];
  if (!team.projectIds.includes(projectId)) {
    team.projectIds.push(projectId);
    team.projects = team.projectIds.length;
  }

  return { ...team, members: [...team.members], projectIds: [...team.projectIds] };
}

export async function unlinkProject(teamId, projectId) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;

  team.projectIds = (team.projectIds || []).filter((id) => id !== projectId);
  team.projects = team.projectIds.length;

  return { ...team, members: [...team.members], projectIds: [...team.projectIds] };
}

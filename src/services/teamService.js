let teams = [
  {
    id: "tm1",
    name: "Web Development",
    description: "Frontend and backend web application development team.",
    status: "Active",
    projectLeader: "Sarah Khan",
    totalMembers: 1,
    projects: 3,
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
    totalMembers: 1,
    projects: 2,
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
    totalMembers: 1,
    projects: 2,
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
    totalMembers: 1,
    projects: 1,
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
    totalMembers: 1,
    projects: 2,
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
    totalMembers: 10,
    projects: 1,
    createdAt: "Jun 01, 2025",
    members: ["e6", "e7", "e8", "e9", "e10", "e11", "e12", "e13", "e14", "e15"],
    progress: 61,
  },
];

/**
 * Get all teams. Optional `role` tags the request for auditing or backend filtering.
 * @param {string} [role] - Optional role performing the request.
 * @returns {Promise<Array>} teams
 */
export async function getAllTeams(role) {
  console.log("API call: getAllTeams", { role });
  return teams.map((team) => ({ ...team, members: [...team.members], role: role || undefined }));
}

/**
 * Get a team by id.
 * @param {string} id
 * @param {string} [role]
 */
export async function getTeamById(id, role) {
  const team = teams.find((t) => t.id === id);
  return team ? { ...team, members: [...team.members], role: role || undefined } : null;
}

/**
 * Get a team by name.
 * @param {string} name
 * @param {string} [role]
 */
export async function getTeamByName(name, role) {
  const team = teams.find((t) => t.name === name);
  return team ? { ...team, members: [...team.members], role: role || undefined } : null;
}

/**
 * Create a team (mock). Accepts optional `role` for audit metadata.
 * @param {object} payload
 * @param {string} [role]
 */
export async function createTeam(payload, role) {
  const newTeam = {
    id: `tm${Date.now()}`,
    name: payload.name,
    description: payload.description || "",
    status: payload.status || "Active",
    projectLeader: payload.projectLeader || "Unassigned",
    totalMembers: payload.totalMembers || 0,
    projects: payload.projects || 0,
    createdAt: payload.createdAt || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    members: payload.members || [],
    progress: payload.progress || 0,
  };

  const entry = { ...newTeam, role: role || undefined };
  teams.push(entry);
  console.log("API call: createTeam", { role, payload });
  return { ...entry, members: [...entry.members] };
}

/**
 * Update a team.
 * @param {string} id
 * @param {object} updates
 * @param {string} [role]
 */
export async function updateTeam(id, updates, role) {
  const index = teams.findIndex((t) => t.id === id);
  if (index === -1) return null;
  teams[index] = { ...teams[index], ...updates, lastModifiedByRole: role || teams[index].lastModifiedByRole };
  console.log("API call: updateTeam", { id, updates, role });
  return { ...teams[index], members: [...teams[index].members] };
}

/**
 * Delete a team.
 * @param {string} id
 * @param {string} [role]
 */
export async function deleteTeam(id, role) {
  const index = teams.findIndex((t) => t.id === id);
  if (index === -1) return false;

  teams.splice(index, 1);
  console.log("API call: deleteTeam", { id, role });
  return true;
}

/**
 * Add a member to a team.
 * @param {string} teamId
 * @param {string} employeeId
 * @param {string} [role]
 */
export async function addTeamMember(teamId, employeeId, role) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;

  if (!team.members.includes(employeeId)) {
    team.members.push(employeeId);
    team.totalMembers = team.members.length;
  }

  console.log("API call: addTeamMember", { teamId, employeeId, role });
  return { ...team, members: [...team.members] };
}

/**
 * Remove a team member.
 * @param {string} teamId
 * @param {string} employeeId
 * @param {string} [role]
 */
export async function removeTeamMember(teamId, employeeId, role) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) return null;

  team.members = team.members.filter((id) => id !== employeeId);
  team.totalMembers = team.members.length;

  console.log("API call: removeTeamMember", { teamId, employeeId, role });
  return { ...team, members: [...team.members] };
}

/**
 * Assign a project leader for a team.
 * @param {string} teamId
 * @param {string} leaderName
 * @param {string} [role]
 */
export async function assignProjectLeader(teamId, leaderName, role) {
  return updateTeam(teamId, { projectLeader: leaderName }, role);
}

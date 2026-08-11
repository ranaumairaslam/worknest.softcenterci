import { del, get, post, put } from "./apiClient.js";

const roleLabel = {
  team_leader: "Team Leader",
  team_member: "Team Member",
};

const roleValue = {
  "Team Leader": "team_leader",
  "Project Leader": "team_leader",
  "Team Member": "team_member",
};

function mapEmployee(employee, teamsById) {
  return {
    ...employee,
    role: roleLabel[employee.role] || employee.role,
    status: employee.status === "active" ? "Active" : "Inactive",
    team: teamsById.get(String(employee.team_id)) || "Unassigned",
    joinedAt: employee.created_at
      ? new Date(employee.created_at).toLocaleDateString()
      : "",
    phone: employee.phone || "",
  };
}

export async function getCompanyTeams() {
  const response = await get("/company/teams");
  return (response?.data || []).map((team) => ({ ...team, name: team.name }));
}

export async function getAllEmployees() {
  const employeeResponse = await get("/company/employees", { limit: 100 });
  let teams = [];
  try {
    teams = await getCompanyTeams();
  } catch {
    // The employee endpoint remains useful while teams are loading or an
    // older backend instance is being restarted.
  }
  const teamsById = new Map(teams.map((team) => [String(team.id), team.name]));
  return (employeeResponse?.data || []).map((employee) =>
    mapEmployee(employee, teamsById),
  );
}

export async function createEmployee(payload) {
  const teams = await getCompanyTeams();
  const selectedTeam = teams.find((item) => item.name === payload.team);
  const fallbackTeam = teams[0];
  const team = selectedTeam || fallbackTeam;

  if (!team) {
    throw new Error("No teams are available yet. Create a team first.");
  }

  const response = await post(`/company/teams/${team.id}/register-member`, {
    name: payload.name,
    email: payload.email,
    password: payload.password || undefined,
    role: roleValue[payload.role] || "team_member",
  });
  const user = response?.data?.user;
  if (!user)
    throw new Error(response?.message || "Employee could not be created.");

  return {
    ...mapEmployee(
      { ...user, status: "active" },
      new Map([[String(team.id), team.name]]),
    ),
    credentials: response.data.credentials,
  };
}

export async function updateEmployee(id, payload) {
  const teams = await getCompanyTeams();
  const team = teams.find((item) => item.name === payload.team);
  const response = await put(`/company/employees/${id}`, {
    name: payload.name,
    email: payload.email,
    role: roleValue[payload.role],
    status: payload.status?.toLowerCase() === "active" ? "active" : "inactive",
    teamId: team?.id,
  });
  return mapEmployee(
    response?.data || {},
    new Map(teams.map((item) => [String(item.id), item.name])),
  );
}

export async function deleteEmployee(id) {
  await del(`/company/teams/employees/${id}`);
  return true;
}

export async function assignToTeam(employeeId, teamName) {
  const teams = await getCompanyTeams();
  const team = teams.find((item) => item.name === teamName);
  if (!team) throw new Error("Selected team was not found.");
  const response = await post(`/company/teams/${team.id}/members`, {
    userId: employeeId,
  });
  return mapEmployee(
    response?.data || {},
    new Map([[String(team.id), team.name]]),
  );
}

// Compatibility helpers used by the remaining project/task UI. They read
// from the company API; project membership itself is managed by the project API.
export async function getEmployeeById(id) {
  const response = await get(`/company/employees/${id}`);
  const teams = await getCompanyTeams();
  return mapEmployee(
    response?.data || {},
    new Map(teams.map((team) => [String(team.id), team.name])),
  );
}

export async function getEmployeeByName(name) {
  const employees = await getAllEmployees();
  return employees.find((employee) => employee.name === name) || null;
}

export async function assignToProject(employeeId) {
  return getEmployeeById(employeeId);
}

export async function unassignFromProject(employeeId) {
  return getEmployeeById(employeeId);
}

export async function incrementTasksAssigned(employeeId) {
  return getEmployeeById(employeeId);
}

export const getAll = getAllEmployees;
export const getById = getEmployeeById;
export const create = createEmployee;
export const update = updateEmployee;
export const remove = deleteEmployee;

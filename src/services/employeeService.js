import { del, get, post, put } from "./apiClient.js";

const roleLabel = {
  team_leader: "Team Leader",
  team_member: "Team Member",
  company: "Company Admin",
};

const roleValue = {
  "Team Leader": "team_leader",
  "Project Leader": "team_leader",
  "Team Member": "team_member",
  Leader: "team_leader",
  Member: "team_member",
};

// ✅ FIXED: Handle both backend field name formats
function mapEmployee(employee, teamsById) {
  if (!employee) return null;
  
  const employeeName = employee.EmployeeName || employee.name || "";
  const teamId = employee.TeamId ?? employee.team_id ?? null;
  const teamName = employee.teamName || teamsById?.get(String(teamId)) || "Unassigned";
  const createdAt = employee.createdAt || employee.created_at;
  
  return {
    ...employee,
    id: employee.id,
    name: employeeName,
    email: employee.email || "",
    role: roleLabel[employee.role] || employee.role,
    status: employee.status === "active" ? "Active" : "Inactive",
    team: teamName,
    team_id: teamId,
    joinedAt: createdAt
      ? new Date(createdAt).toLocaleDateString()
      : "",
    phone: employee.phone || "",
  };
}

// =====================================================
// GET COMPANY TEAMS
// =====================================================
export async function getCompanyTeams() {
  try {
    const response = await get("/company/teams");
    return (response?.data || []).map((team) => ({ ...team, name: team.name }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// =====================================================
// GET ALL EMPLOYEES
// =====================================================
export async function getAllEmployees() {
  try {
    const employeeResponse = await get("/company/employees", { limit: 100 });
    let teams = [];
    try {
      teams = await getCompanyTeams();
    } catch {
      // Continue
    }
    const teamsById = new Map(teams.map((team) => [String(team.id), team.name]));
    return (employeeResponse?.data || []).map((employee) =>
      mapEmployee(employee, teamsById),
    );
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

// =====================================================
// CREATE EMPLOYEE
// ✅ NEW: Uses dedicated /company/employees POST route
// Works with or without team!
// =====================================================
export async function createEmployee(payload) {
  try {
    // Find team ID if team name provided
    let teamId = null;
    let teamName = null;
    
    if (payload.team && payload.team !== "Unassigned" && payload.team !== "") {
      const teams = await getCompanyTeams();
      const team = teams.find((item) => item.name === payload.team);
      if (team) {
        teamId = team.id;
        teamName = team.name;
      }
    }

    const body = {
      EmployeeName: payload.name,
      email: payload.email,
      password: payload.password || undefined,
      role: roleValue[payload.role] || "team_member",
    };
    
    // Only add TeamId if team was selected
    if (teamId) {
      body.TeamId = teamId;
    }

    console.log('📤 Creating employee with body:', body);

    const response = await post("/company/employees", body);
    
    const employeeData = response?.data;
    if (!employeeData) {
      throw new Error("Employee could not be created.");
    }

    const teamsById = teamName 
      ? new Map([[String(teamId), teamName]])
      : new Map();

    return {
      ...mapEmployee(employeeData, teamsById),
      credentials: employeeData.credentials,
    };
  } catch (error) {
    console.error('Error creating employee:', error);
    
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }
    
    throw new Error(error.data?.message || error.message || 'Failed to create employee');
  }
}

// =====================================================
// UPDATE EMPLOYEE
// =====================================================
export async function updateEmployee(id, payload) {
  try {
    const teams = await getCompanyTeams();
    
    const body = {};
    if (payload.name !== undefined) body.EmployeeName = payload.name;
    if (payload.email !== undefined && payload.email) body.email = payload.email;
    if (payload.role !== undefined) body.role = roleValue[payload.role] || payload.role;
    if (payload.status !== undefined) {
      body.status = payload.status?.toLowerCase() === "active" ? "active" : "inactive";
    }
    if (payload.password !== undefined && payload.password) {
      body.password = payload.password;
    }
    
    // Handle team change
    if (payload.team !== undefined) {
      if (payload.team === "" || payload.team === "Unassigned") {
        body.TeamId = null;   // Unassign from team
      } else {
        const team = teams.find((item) => item.name === payload.team);
        if (team) body.TeamId = team.id;
      }
    }

    console.log('📤 Updating employee:', id, body);

    const response = await put(`/company/employees/${id}`, body);
    
    return mapEmployee(
      response?.data || {},
      new Map(teams.map((item) => [String(item.id), item.name])),
    );
  } catch (error) {
    console.error('Error updating employee:', error);
    
    if (error.data?.errors && Array.isArray(error.data.errors)) {
      const errorMessages = error.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join('\n');
      const newError = new Error(errorMessages);
      newError.backendErrors = error.data.errors;
      throw newError;
    }
    
    throw new Error(error.data?.message || error.message || 'Failed to update employee');
  }
}

// =====================================================
// DELETE EMPLOYEE (✅ Working!)
// =====================================================
export async function deleteEmployee(id) {
  try {
    console.log('🗑️ Deleting employee:', id);
    await del(`/company/employees/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    alert(`Delete failed: ${error.data?.message || error.message || 'Unknown error'}`);
    return false;
  }
}

// =====================================================
// ASSIGN EMPLOYEE TO TEAM (via PUT update)
// =====================================================
export async function assignToTeam(employeeId, teamName) {
  try {
    const teams = await getCompanyTeams();
    const team = teams.find((item) => item.name === teamName);
    if (!team) throw new Error("Selected team was not found.");
    
    console.log('📤 Assigning employee to team:', employeeId, team.name);
    
    const response = await put(`/company/employees/${employeeId}`, {
      TeamId: team.id,
    });
    
    return mapEmployee(
      response?.data || {},
      new Map([[String(team.id), team.name]]),
    );
  } catch (error) {
    console.error('Error assigning to team:', error);
    throw error;
  }
}

// =====================================================
// GET SINGLE EMPLOYEE
// =====================================================
export async function getEmployeeById(id) {
  try {
    const response = await get(`/company/employees/${id}`);
    const teams = await getCompanyTeams();
    return mapEmployee(
      response?.data || {},
      new Map(teams.map((team) => [String(team.id), team.name])),
    );
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

// =====================================================
// GET EMPLOYEE BY NAME
// =====================================================
export async function getEmployeeByName(name) {
  const employees = await getAllEmployees();
  return employees.find((employee) => employee.name === name) || null;
}

// =====================================================
// COMPATIBILITY FUNCTIONS
// =====================================================
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
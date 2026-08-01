import { getTeamByName, addTeamMember, removeTeamMember } from "./teamService";
import { getProjectById } from "./projectService";

let employees = [
  {
    id: "e1",
    name: "Sarah Khan",
    role: "Frontend Developer",
    email: "sarah.khan@softcentric.com",
    team: "Web Development",
    status: "Active",
    joinedAt: "2025-10-01",
    tasksAssigned: 12,
    phone: "+92 300 1234567",
    projects: [],
  },
  {
    id: "e2",
    name: "Ahmed Ali",
    role: "Backend Developer",
    email: "ahmed.ali@softcentric.com",
    team: "Backend Team",
    status: "Active",
    joinedAt: "2025-09-18",
    tasksAssigned: 9,
    phone: "+92 300 2345678",
  },
  {
    id: "e3",
    name: "Areeba Noor",
    role: "ERP Specialist",
    email: "areeba.noor@softcentric.com",
    team: "ERP Team",
    status: "Active",
    joinedAt: "2025-11-05",
    tasksAssigned: 7,
    phone: "+92 300 3456789",
  },
  {
    id: "e4",
    name: "Bilal Ahmed",
    role: "HR Manager",
    email: "bilal.ahmed@softcentric.com",
    team: "HR Team",
    status: "Active",
    joinedAt: "2026-01-12",
    tasksAssigned: 5,
    phone: "+92 300 4567890",
  },
  {
    id: "e5",
    name: "Waleed Hassan",
    role: "AI Engineer",
    email: "waleed.hassan@softcentric.com",
    team: "AI Team",
    status: "Active",
    joinedAt: "2026-02-04",
    tasksAssigned: 8,
    phone: "+92 300 5678901",
  },
  {
    id: "e6",
    name: "Usman Tariq",
    role: "Mobile Team Lead",
    email: "usman.tariq@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-08-12",
    tasksAssigned: 11,
    phone: "+92 300 6789012",
  },
  {
    id: "e7",
    name: "Fatima Sheikh",
    role: "iOS Developer",
    email: "fatima.sheikh@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-09-01",
    tasksAssigned: 9,
    phone: "+92 300 7890123",
  },
  {
    id: "e8",
    name: "Hassan Raza",
    role: "Android Developer",
    email: "hassan.raza@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-09-15",
    tasksAssigned: 10,
    phone: "+92 300 8901234",
  },
  {
    id: "e9",
    name: "Zainab Malik",
    role: "React Native Developer",
    email: "zainab.malik@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-10-03",
    tasksAssigned: 8,
    phone: "+92 300 9012345",
  },
  {
    id: "e10",
    name: "Omar Siddiqui",
    role: "Flutter Developer",
    email: "omar.siddiqui@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-10-20",
    tasksAssigned: 7,
    phone: "+92 300 0123456",
  },
  {
    id: "e11",
    name: "Nadia Hussain",
    role: "UI/UX Designer",
    email: "nadia.hussain@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-11-08",
    tasksAssigned: 6,
    phone: "+92 301 1234567",
  },
  {
    id: "e12",
    name: "Imran Qureshi",
    role: "QA Engineer",
    email: "imran.qureshi@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-11-22",
    tasksAssigned: 5,
    phone: "+92 301 2345678",
  },
  {
    id: "e13",
    name: "Sana Iqbal",
    role: "Mobile Developer",
    email: "sana.iqbal@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2025-12-05",
    tasksAssigned: 8,
    phone: "+92 301 3456789",
  },
  {
    id: "e14",
    name: "Ali Raza",
    role: "DevOps Engineer",
    email: "ali.raza@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2026-01-10",
    tasksAssigned: 4,
    phone: "+92 301 4567890",
  },
  {
    id: "e15",
    name: "Maryam Khan",
    role: "Product Analyst",
    email: "maryam.khan@softcentric.com",
    team: "Mobile Team",
    status: "Active",
    joinedAt: "2026-01-25",
    tasksAssigned: 6,
    phone: "+92 301 5678901",
  },
];

export async function getAllEmployees() {
  return employees.map((employee) => ({ ...employee }));
}

export async function getEmployeeById(id) {
  return employees.find((employee) => employee.id === id) || null;
}

export async function getEmployeeByName(name) {
  return employees.find((employee) => employee.name === name) || null;
}

export async function createEmployee(payload) {
  const newEmployee = {
    id: `e${Date.now()}`,
    name: payload.name,
    role: payload.role || "Team Member",
    email: payload.email || "",
    team: payload.team || "Unassigned",
    status: payload.status || "Active",
    joinedAt: payload.joinedAt || "Today",
    tasksAssigned: payload.tasksAssigned || 0,
    phone: payload.phone || "",
    projects: payload.projects || [],
  };

  employees.push(newEmployee);

  if (newEmployee.team && newEmployee.team !== "Unassigned") {
    const team = await getTeamByName(newEmployee.team);
    if (team && !team.members.includes(newEmployee.id)) {
      await addTeamMember(team.id, newEmployee.id);
    }
  }

  return { ...newEmployee };
}

export async function updateEmployee(id, updates) {
  const index = employees.findIndex((employee) => employee.id === id);
  if (index === -1) return null;

  employees[index] = {
    ...employees[index],
    ...updates,
  };

  return { ...employees[index] };
}

export async function deleteEmployee(id) {
  const index = employees.findIndex((employee) => employee.id === id);
  if (index === -1) return false;

  const employee = employees[index];
  employees.splice(index, 1);

  if (employee.team && employee.team !== "Unassigned") {
    const team = await getTeamByName(employee.team);
    if (team) {
      await removeTeamMember(team.id, employee.id);
    }
  }

  return true;
}

export async function isEmailDuplicate(email, excludeId) {
  return employees.some(
    (employee) =>
      employee.email.toLowerCase() === email.toLowerCase() &&
      employee.id !== excludeId
  );
}

export async function assignToTeam(employeeId, teamName) {
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);
  if (employeeIndex === -1) return null;

  const team = await getTeamByName(teamName);
  if (!team) return null;

  const currentTeamName = employees[employeeIndex].team;
  if (currentTeamName === team.name) return { ...employees[employeeIndex] };

  if (currentTeamName && currentTeamName !== "Unassigned") {
    const previousTeam = await getTeamByName(currentTeamName);
    if (previousTeam) {
      await removeTeamMember(previousTeam.id, employeeId);
    }
  }

  employees[employeeIndex].team = team.name;

  if (!team.members.includes(employeeId)) {
    await addTeamMember(team.id, employeeId);
  }

  return { ...employees[employeeIndex] };
}

export async function removeFromTeam(employeeId, teamName) {
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);
  if (employeeIndex === -1) return null;

  const team = await getTeamByName(teamName);
  if (!team) return null;

  if (employees[employeeIndex].team === team.name) {
    employees[employeeIndex].team = "Unassigned";
  }

  await removeTeamMember(team.id, employeeId);
  return { ...employees[employeeIndex] };
}

export async function assignToProject(employeeId, projectId) {
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);
  if (employeeIndex === -1) return null;

  const project = await getProjectById(projectId);
  if (!project) return null;

  const employee = employees[employeeIndex];
  if (!Array.isArray(employee.projects)) {
    employee.projects = [];
  }
  if (!Array.isArray(employee.assignedProjectIds)) {
    employee.assignedProjectIds = [];
  }

  if (!employee.projects.includes(projectId)) {
    employee.projects.push(projectId);
    employee.assignedProjectIds.push(projectId);
  }

  return { ...employee };
}

export async function unassignFromProject(employeeId, projectId) {
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);
  if (employeeIndex === -1) return null;

  const employee = employees[employeeIndex];
  employee.projects = (employee.projects || []).filter((id) => id !== projectId);
  employee.assignedProjectIds = (employee.assignedProjectIds || []).filter((id) => id !== projectId);

  return { ...employee };
}

export async function incrementTasksAssigned(employeeId) {
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);
  if (employeeIndex === -1) return null;
  employees[employeeIndex].tasksAssigned = (employees[employeeIndex].tasksAssigned || 0) + 1;
  return { ...employees[employeeIndex] };
}

export async function getAll() {
  return getAllEmployees();
}

export async function getById(id) {
  return getEmployeeById(id);
}

export async function create(data) {
  return createEmployee(data);
}

export async function update(id, data) {
  return updateEmployee(id, data);
}

export async function remove(id) {
  return deleteEmployee(id);
}

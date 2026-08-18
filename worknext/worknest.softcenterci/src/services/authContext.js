/**
 * Mock current user until real authentication exists.
 * Maps URL-derived role to a stable user identity for filtering and notifications.
 */
const USERS = {
  superAdmin: {
    id: "u-super",
    name: "Super Admin",
    role: "superAdmin",
  },
  companyAdmin: {
    id: "u-admin",
    name: "Company Admin",
    role: "companyAdmin",
  },
  projectLeader: {
    id: "e1",
    name: "Sarah Khan",
    role: "projectLeader",
    employeeId: "e1",
  },
  teamMember: {
    id: "e7",
    name: "Fatima Sheikh",
    role: "teamMember",
    employeeId: "e7",
  },
  client: {
    id: "c1",
    name: "SoftCentric Ltd.",
    role: "client",
    clientId: "c1",
  },
};

export function getCurrentUser(role) {
  return USERS[role] ?? USERS.companyAdmin;
}

export function getActor(role) {
  const user = getCurrentUser(role);
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    employeeId: user.employeeId,
    clientId: user.clientId,
  };
}

export function normalizeFilters(roleOrFilters) {
  if (typeof roleOrFilters === "string") {
    const user = getCurrentUser(roleOrFilters);
    return { role: roleOrFilters, user };
  }
  if (roleOrFilters?.user) {
    return roleOrFilters;
  }
  if (roleOrFilters?.role) {
    return { role: roleOrFilters.role, user: getCurrentUser(roleOrFilters.role) };
  }
  return { role: "companyAdmin", user: getCurrentUser("companyAdmin") };
}

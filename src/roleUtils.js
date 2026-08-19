// Backend kabhi snake_case ("super_admin") kabhi camelCase ("superAdmin")
// role bhejta hai. Ye function dono ko hamesha ek consistent
// frontend format mein normalize karta hai.

const ROLE_ALIASES = {
  // backend / snake_case format
  super_admin: "superAdmin",
  company: "companyAdmin",
  team_leader: "projectLeader",
  team_member: "teamMember",
  client: "client",

  // frontend / camelCase format (already correct, pass-through)
  superAdmin: "superAdmin",
  companyAdmin: "companyAdmin",
  projectLeader: "projectLeader",
  teamMember: "teamMember",
};

export function normalizeRole(role) {
  return ROLE_ALIASES[role] || role;
}

export const DASHBOARD_MAP = {
  superAdmin: "/dashboard-admin",
  companyAdmin: "/dashboard-company",
  projectLeader: "/dashboard-leader",
  teamMember: "/dashboard-team-member",
  client: "/client-dashboard",
};

export function getDashboardForRole(role) {
  const normalized = normalizeRole(role);
  return DASHBOARD_MAP[normalized] || "/dashboard-company";
}
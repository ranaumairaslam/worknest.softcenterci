import { post, setAuthToken } from "./apiClient.js";

const USER_KEY = "worknest_user";

const ROLE_DASHBOARD_ROUTES = {
  super_admin: "/dashboard-admin",
  company: "/dashboard-company",
  team_leader: "/dashboard-leader",
  team_member: "/dashboard-team-member",
  client: "/client-dashboard",

  // In case frontend uses these role names
  superAdmin: "/dashboard-admin",
  companyAdmin: "/dashboard-company",
  projectLeader: "/dashboard-leader",
  teamMember: "/dashboard-team-member",
};

// ==========================================
// STORED USER
// ==========================================

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Invalid stored user:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

// ==========================================
// DASHBOARD ROUTE
// ==========================================

export function getDashboardRoute(user) {
  if (!user) {
    return "/login";
  }

  return ROLE_DASHBOARD_ROUTES[user.role] || "/dashboard-admin";
}

// ==========================================
// LOGIN
// ==========================================

export async function login(email, password) {
  const response = await post("/auth/login", {
    email,
    password,
  });

  if (!response?.success) {
    throw new Error(response?.message || "Login failed");
  }

  if (response.token) {
    setAuthToken(response.token);
  }

  setStoredUser(response.user || null);

  return {
    ...response,
    dashboardRoute: getDashboardRoute(response.user),
  };
}

// ==========================================
// LOGOUT
// ==========================================

export function logout() {
  setAuthToken(null);
  setStoredUser(null);
}

// ==========================================
// AUTH CHECK
// ==========================================

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  const user = getStoredUser();
  const token = localStorage.getItem("worknest_token");

  return Boolean(user && token);
}

// ==========================================
// CHANGE PASSWORD
// ==========================================

export async function changePassword(payload) {
  const response = await post("/auth/change-password", payload);

  if (!response?.success) {
    throw new Error(
      response?.message || "Failed to change password"
    );
  }

  return response;
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

export async function forgotPassword(email) {
  const response = await post("/auth/forgot-password", {
    email,
  });

  if (!response?.success) {
    throw new Error(
      response?.message || "Failed to process forgot password request"
    );
  }

  return response;
}
import { post, setAuthToken } from './apiClient.js';

const USER_KEY = 'worknest_user';

const ROLE_DASHBOARD_ROUTES = {
  super_admin: '/dashboard-admin',
  company: '/dashboard-company',
  team_leader: '/dashboard-leader',
  team_member: '/dashboard-team-member',
  client: '/client-dashboard',
};

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function getDashboardRoute(user) {
  if (!user) return '/login';
  return ROLE_DASHBOARD_ROUTES[user.role] || '/dashboard-admin';
}

export async function login(email, password) {
  const response = await post('/auth/login', { email, password });
  if (!response.success) {
    throw new Error(response.message || 'Login failed');
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

export function logout() {
  setAuthToken(null);
  setStoredUser(null);
}

export function isAuthenticated() {
  return Boolean(getStoredUser() && typeof window !== 'undefined' && localStorage.getItem('worknest_token'));
}

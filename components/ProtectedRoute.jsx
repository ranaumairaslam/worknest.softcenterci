import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getStoredUser } from '../src/services/authService.js';
import { getRoleFromPath } from './navigation.js';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect to login, preserving the path the user attempted to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = getStoredUser();
  const backendRole = user?.role; // e.g. 'super_admin', 'company', 'team_leader', 'team_member', 'client'

  // Map backend roles to frontend roles (defined in roleConfig / getRoleFromPath)
  const roleMap = {
    super_admin: 'superAdmin',
    company: 'companyAdmin',
    team_leader: 'projectLeader',
    team_member: 'teamMember',
    client: 'client',
  };

  const currentFrontendRole = roleMap[backendRole];
  const requiredRole = getRoleFromPath(location.pathname);

  // If the page requires a specific role and the logged-in user does not have it,
  // redirect them to their respective dashboard.
  if (requiredRole && currentFrontendRole !== requiredRole) {
    const dashboardMap = {
      super_admin: '/dashboard-admin',
      company: '/dashboard-company',
      team_leader: '/dashboard-leader',
      team_member: '/dashboard-team-member',
      client: '/client-dashboard',
    };
    const allowedDashboard = dashboardMap[backendRole] || '/login';
    return <Navigate to={allowedDashboard} replace />;
  }

  return children;
}

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  getStoredUser,
} from "../src/services/authService.js";
import { getRoleFromPath } from "./navigation.js";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  // User login nahi hai
  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  const user = getStoredUser();

  const backendRole = user?.role;

  // Backend role → Frontend role
  const roleMap = {
    super_admin: "superAdmin",
    company: "companyAdmin",
    team_leader: "projectLeader",
    team_member: "teamMember",
    client: "client",
  };

  const currentFrontendRole = roleMap[backendRole];

  // Settings page sab roles ke liye allowed hai
  const requiredRole =
    location.pathname === "/settings"
      ? null
      : getRoleFromPath(location.pathname);

  // Role mismatch check
  if (
    requiredRole &&
    currentFrontendRole !== requiredRole
  ) {
    const dashboardMap = {
      super_admin: "/dashboard-admin",
      company: "/dashboard-company",
      team_leader: "/dashboard-leader",
      team_member: "/dashboard-team-member",
      client: "/client-dashboard",
    };

    const allowedDashboard =
      dashboardMap[backendRole] || "/login";

    return (
      <Navigate
        to={allowedDashboard}
        replace
      />
    );
  }

  return children;
}
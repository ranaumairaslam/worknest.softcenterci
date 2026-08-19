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

  // ==========================================
  // USER IS NOT AUTHENTICATED
  // ==========================================
  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ==========================================
  // GET CURRENT USER
  // ==========================================
  const user = getStoredUser();

  const currentFrontendRole = user?.role;

  // ==========================================
  // DASHBOARD ROUTES BY ROLE
  // ==========================================
  const dashboardMap = {
    superAdmin: "/dashboard-admin",
    companyAdmin: "/dashboard-company",
    projectLeader: "/dashboard-leader",
    teamMember: "/dashboard-team-member",
    client: "/client-dashboard",
  };

  // ==========================================
  // SETTINGS IS AVAILABLE TO ALL ROLES
  // ==========================================
  const requiredRole =
    location.pathname === "/settings"
      ? null
      : getRoleFromPath(location.pathname);

  // ==========================================
  // ROLE MISMATCH CHECK
  // ==========================================
  if (
    requiredRole &&
    currentFrontendRole !== requiredRole
  ) {
    const allowedDashboard =
      dashboardMap[currentFrontendRole] || "/login";

    // Prevent redirect loop
    if (location.pathname === allowedDashboard) {
      return children;
    }

    return (
      <Navigate
        to={allowedDashboard}
        replace
      />
    );
  }

  // ==========================================
  // ALLOWED
  // ==========================================
  return children;
}
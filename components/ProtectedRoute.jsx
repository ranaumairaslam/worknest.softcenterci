import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  getStoredUser,
} from "../src/services/authService.js";
import { getRoleFromPath } from "./navigation.js";
import { normalizeRole, getDashboardForRole } from "../src/roleUtils.js";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  // User login nahi hai
  if (!authenticated) {
    if (location.pathname === "/login") return children;
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  const user = getStoredUser();
  const currentFrontendRole = normalizeRole(user?.role);

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
    const allowedDashboard = getDashboardForRole(currentFrontendRole);

    // Loop guard: agar already sahi jagah hain to redirect mat karo
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

  return children;
}
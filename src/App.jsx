import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./Component/SignUp/SignupPage.jsx";
import Login from "./Component/Login/login.jsx";
import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LeaderDashboard from "./pages/LeaderDashboard.jsx";
import TeamDashboard from "./pages/TeamDashboard.jsx";
import Admin from "./Component/SuperAdmin/superAdmin.jsx";
import TeamManagement from "./components/teammangemnt/teamMangement";

const DESKTOP_BREAKPOINT = 1024;
const AUTH_PATHS = ["/login", "/Signup"];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
  const location = useLocation();
  const sidebarOpen = isDesktop ? false : mobileOpen;

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleToggle = useCallback(() => {
    if (isDesktop) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  }, [isDesktop]);

  const handleCloseMobile = useCallback(() => setMobileOpen(false), []);

  const mainOffsetClass = isDesktop
    ? collapsed
      ? "lg:ml-20"
      : "lg:ml-72"
    : "ml-0";

  const navbarTitle =
    {
      "/dashboard": "Company Dashboard",
      "/projects": "Project Oversight",
      "/tasks": "My Tasks",
      "/super-admin": "Super Admin",
    }[location.pathname] ?? "WorkNest";

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={sidebarOpen}
        onClose={handleCloseMobile}
      />

      <div
        className={`min-h-screen min-w-0 transition-all duration-300 ease-in-out ${mainOffsetClass}`}
      >
        <Navbar onToggle={handleToggle} title={navbarTitle} />

        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<TeamManagement />} />
            <Route path="/tasks" element={<TeamDashboard />} />
            <Route path="/super-admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
              <Route path="/team-management" element={<TeamManagement />} />

          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAuthRoute = AUTH_PATHS.includes(location.pathname);

  if (isAuthRoute) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/Signup" replace />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/Signup" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

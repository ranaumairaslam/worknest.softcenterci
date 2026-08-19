import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Auth Pages
import Signup from "./Component/SignUp/SignupPage.jsx";
import Login from "./Component/Login/login.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
import TermsAndConditions from "./Component/SignUp/TermsAndConditions.jsx";
import PrivacyPolicy from "./Component/SignUp/PrivacyPolicy.jsx";

// Layout
import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Context
import { ProfileProvider } from "../components/ProfileContext.jsx";

// Auth Service
import { isAuthenticated, getStoredUser } from "./services/authService.js";

// Super Admin
import Admin from "./Component/SuperAdmin/superAdmin.jsx";
import RevenuePage from "./Component/Revenue/RevenuePage.jsx";
import CompanySidebar from "./Component/Company/CompnySidebar.jsx";
import ReportsSidebar from "./Component/Reports/reportsSidebar.jsx";
import AddingCompany from "./Component/Company/AddingCompany.jsx";

// Company
import Dashboard from "./pages/Dashboard.jsx";
import TeamManagement from "./components/teammangemnt/teamMangement";
import ProjectOversight from "./pages/ProjectOversight";
import ProjectOversightFull from "./pages/ProjectOversightFull";
import CompanyReports from "./pages/CompanyReports.jsx";
import Employees from "./pages/Employees.jsx";
import CompanyTasks from "./pages/CompanyTasks.jsx";
import Clients from "./pages/Clients.jsx";
import CompanyMeetings from "./pages/CompanyMeetings.jsx";
import Revenue from "./pages/Revenue.jsx";

// Leader
import LeaderDashboard from "./pages/LeaderDashboard.jsx";
import Reports from "./pages/Reports.jsx";
import Calendar from "./pages/Calendar.jsx";
import LeaderMeetings from "./pages/Meetings.jsx";

// Team Member
import TeamDashboard from "./pages/TeamDashboard.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import TeamMeetings from "./pages/TeamMeetings.jsx";

// Client
import ClientDashboard from "./pages/ClientDashboard.jsx";
import ProjectsClient from "./pages/ProjectsClient.jsx";
import ClientCalendar from "./pages/ClientCalendar.jsx";
import Meetings from "./pages/Meetings.jsx";

// Common
import Chat from "./pages/Chat";
import Settings from "../components/Setting.jsx";

// Project Pages
import ProjectTimelinePage from "./pages/ProjectTimelinePage.jsx";
import TeamPerformancePage from "./pages/TeamPerformancePage.jsx";
import TaskOverviewPage from "./pages/TaskOverviewPage.jsx";
import KanbanBoardPage from "./pages/KanbanBoardPage.jsx";


const DESKTOP_BREAKPOINT = 1024;

const AUTH_PATHS = [
  "/landing",
  "/login",
  "/signup",
  "/terms",
  "/privacy-policy",
];


// Custom Hook for Media Query
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const handleChange = (e) => {
      setMatches(e.matches);
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}


// Main App Layout Component
function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDesktop = useMediaQuery(
    `(min-width: ${DESKTOP_BREAKPOINT}px)`
  );

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

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const mainOffsetClass = isDesktop
    ? collapsed
      ? "lg:ml-20"
      : "lg:ml-72"
    : "ml-0";

const getRole = () => {
  const user = getStoredUser();

  const roleMap = {
    super_admin: "superAdmin",
    company: "companyAdmin",
    team_leader: "projectLeader",
    team_member: "teamMember",
    client: "client",
  };

  const pathRoles = {
    "/dashboard-admin": "superAdmin",
    "/companies": "superAdmin",
    "/revenue-super-admin": "superAdmin",
    "/reports": "superAdmin",
    "/add-company": "superAdmin",

    "/dashboard-company": "companyAdmin",
    "/team-management": "companyAdmin",
    "/projects": "companyAdmin",
    "/employees": "companyAdmin",
    "/company-tasks": "companyAdmin",
    "/clients": "companyAdmin",
    "/company-meetings": "companyAdmin",
    "/revenue": "companyAdmin",
    "/company-reports": "companyAdmin",

    "/dashboard-leader": "projectLeader",
    "/project": "projectLeader",
    "/calendar": "projectLeader",
    "/project-reports": "projectLeader",
    "/meetings": "projectLeader",
    "/meetingss": "projectLeader",
    "/project/timeline": "projectLeader",
    "/project/team-performance": "projectLeader",
    "/project/tasks": "projectLeader",
    "/project/kanban": "projectLeader",

    "/dashboard-team-member": "teamMember",
    "/tasks": "teamMember",
    "/team-member-projects": "teamMember",
    "/team-meetings": "teamMember",
    "/chat": "teamMember",

    "/client-dashboard": "client",
    "/client-projects": "client",
    "/client-meetings": "client",
    "/client-calendar": "client",
  };

  // 1. Current page ka role sab se pehle
  const pathRole = pathRoles[location.pathname];

  if (pathRole) {
    return pathRole;
  }

  // 2. Settings par Navbar/Sidebar se bheja gaya role
  if (location.pathname === "/settings") {
    const stateRole = location.state?.role;

    if (stateRole) {
      return stateRole;
    }
  }

  // 3. Actual logged-in user ka backend role
  const storedUserRole = roleMap[user?.role];

  if (storedUserRole) {
    return storedUserRole;
  }

  // 4. localStorage sirf last fallback hai
  const savedRole = localStorage.getItem("userRole");

  if (savedRole) {
    return savedRole;
  }

  // 5. Final fallback
  return "superAdmin";
};

  const navbarRole = getRole();

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <Sidebar
        role={navbarRole}
        collapsed={collapsed}
        mobileOpen={sidebarOpen}
        onClose={handleCloseMobile}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${mainOffsetClass}`}
      >
        <Navbar
          role={navbarRole}
          onToggle={handleToggle}
        />

        <main className="p-4 sm:p-6">
          <Routes>
            {/* Super Admin Routes */}
            <Route
              path="/dashboard-admin"
              element={<Admin />}
            />
            <Route
              path="/companies"
              element={<CompanySidebar />}
            />
            <Route
              path="/reports"
              element={<ReportsSidebar />}
            />
            <Route
              path="/revenue-super-admin"
              element={<RevenuePage />}
            />
            <Route
              path="/add-company"
              element={<AddingCompany />}
            />

            {/* Company Admin Routes */}
            <Route
              path="/dashboard-company"
              element={<Dashboard />}
            />
            <Route
              path="/team-management"
              element={<TeamManagement />}
            />
            <Route
              path="/projects"
              element={<ProjectOversight />}
            />
            <Route
              path="/company-reports"
              element={<CompanyReports />}
            />
            <Route
              path="/employees"
              element={<Employees />}
            />
            <Route
              path="/company-tasks"
              element={<CompanyTasks />}
            />
            <Route
              path="/clients"
              element={<Clients />}
            />
            <Route
              path="/company-meetings"
              element={<CompanyMeetings />}
            />
            <Route
              path="/revenue"
              element={<Revenue />}
            />

            {/* Project Leader Routes */}
            <Route
              path="/dashboard-leader"
              element={<LeaderDashboard />}
            />
            <Route
              path="/project"
              element={<ProjectOversightFull />}
            />
            <Route
              path="/calendar"
              element={<Calendar />}
            />
            <Route
              path="/project-reports"
              element={<Reports />}
            />
            <Route
              path="/meetings"
              element={<Meetings />}
            />
            <Route
              path="/meetingss"
              element={<LeaderMeetings />}
            />

            {/* Project Sub-Pages */}
            <Route
              path="/project/timeline"
              element={<ProjectTimelinePage />}
            />
            <Route
              path="/project/team-performance"
              element={<TeamPerformancePage />}
            />
            <Route
              path="/project/tasks"
              element={<TaskOverviewPage />}
            />
            <Route
              path="/project/kanban"
              element={<KanbanBoardPage />}
            />

            {/* Team Member Routes */}
            <Route
              path="/dashboard-team-member"
              element={<TeamDashboard />}
            />
            <Route
              path="/tasks"
              element={<MyTasks />}
            />
            <Route
              path="/team-member-projects"
              element={<ProjectOversight />}
            />
            <Route
              path="/team-meetings"
              element={<TeamMeetings />}
            />

            {/* Client Routes */}
            <Route
              path="/client-dashboard"
              element={<ClientDashboard />}
            />
            <Route
              path="/client-projects"
              element={<ProjectsClient />}
            />
            <Route
              path="/client-meetings"
              element={<Meetings />}
            />
            <Route
              path="/client-calendar"
              element={<ClientCalendar />}
            />

            {/* Common Routes */}
            <Route
              path="/chat"
              element={<Chat />}
            />
            <Route
              path="/settings"
              element={<Settings role={navbarRole} />}
            />

            {/* Default Redirect */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard-admin"
                  replace
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}


// Main App Component
export default function App() {
  const location = useLocation();
  const authenticated = isAuthenticated();

  const isAuthRoute = AUTH_PATHS.includes(location.pathname);

  // If user is on auth page and already logged in, redirect to dashboard
  if (isAuthRoute) {
    if (authenticated) {
      const user = getStoredUser();

      const dashboardMap = {
        super_admin: "/dashboard-admin",
        company: "/dashboard-company",
        team_leader: "/dashboard-leader",
        team_member: "/dashboard-team-member",
        client: "/client-dashboard",
      };

      const redirectUrl =
        dashboardMap[user?.role] || "/dashboard-company";

      return (
        <Navigate
          to={redirectUrl}
          replace
        />
      );
    }

    // Show auth pages if not authenticated
    return (
      <Routes>
        <Route
          path="/landing"
          element={<LandingPage />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/terms"
          element={<TermsAndConditions />}
        />
      </Routes>
    );
  }

  // Protected routes wrapped in ProfileProvider
  return (
    <ProfileProvider>
      <Routes>
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate
              to={authenticated ? (() => {
                const user = getStoredUser();
                const dashboardMap = {
                  super_admin: "/dashboard-admin",
                  company: "/dashboard-company",
                  team_leader: "/dashboard-leader",
                  team_member: "/dashboard-team-member",
                  client: "/client-dashboard",
                };
                return dashboardMap[user?.role] || "/dashboard-company";
              })() : "/landing"}
              replace
            />
          }
        />
      </Routes>
    </ProfileProvider>
  );
}
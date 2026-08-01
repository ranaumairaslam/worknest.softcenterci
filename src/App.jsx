import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Signup from "./Component/SignUp/SignupPage.jsx";
import Login from "./Component/Login/login.jsx";

import Sidebar from "../components/sidebar.jsx";
import Navbar from "../components/navbar.jsx";

import Admin from "./Component/SuperAdmin/superAdmin.jsx";

import LeaderDashboard from "./pages/LeaderDashboard.jsx";
import TeamDashboard from "./pages/TeamDashboard.jsx";
import RevenuePage from "./Component/Revenue/RevenuePage.jsx";
import TermsAndConditions from "./Component/SignUp/TermsAndConditions.jsx";
import PrivacyPolicy from "./Component/SignUp/PrivacyPolicy.jsx";

import CompanySidebar from "./Component/Company/CompnySidebar.jsx";

import ReportsSidebar from "./Component/Reports/reportsSidebar.jsx";

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

import Reports from "./pages/Reports.jsx";
import Calendar from "./pages/Calendar.jsx";
import MyTasks from "./pages/MyTasks.jsx";
import Chat from "./pages/Chat";

import ClientDashboard from "./pages/ClientDashboard.jsx";

import ProjectsClient from "./pages/ProjectsClient.jsx";
import Meetings from  "./pages/Meetings.jsx";




import ClientCalendar from "./pages/ClientCalendar.jsx";
import AddingCompany from "./Component/Company/AddingCompany.jsx";

import ProjectTimelinePage from "./pages/ProjectTimelinePage.jsx";
import TeamPerformancePage from "./pages/TeamPerformancePage.jsx";
import TaskOverviewPage from "./pages/TaskOverviewPage.jsx";
import KanbanBoardPage from "./pages/KanbanBoardPage.jsx";

import LeaderMeetings from "./pages/Meetings.jsx";
import TeamMeetings from "./pages/TeamMeetings.jsx";

const DESKTOP_BREAKPOINT = 1024;
const AUTH_PATHS = ["/login","/Signup","/terms","/privacy-policy",];

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

    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
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

  const navbarRole =
    {
      "/dashboard-admin": "superAdmin",
      "/companies": "superAdmin",
      "/revenue-super-admin": "superAdmin",
      "/reports": "superAdmin",
      

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


      "/dashboard-team-member": "teamMember",
      "/tasks": "teamMember",
      "/team-member-projects": "teamMember",
      "/team-meetings": "teamMember",

      "/client-dashboard": "client",
      "/client-projects": "client",
      "/client-meetings": "client",

      "/chat": "teamMember",
    }[location.pathname] || "superAdmin";

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
             <Route path="/project/timeline" element={<ProjectTimelinePage />} />
<Route path="/project/team-performance" element={<TeamPerformancePage />} />
<Route path="/project/tasks" element={<TaskOverviewPage />} />
<Route path="/project/kanban" element={<KanbanBoardPage />} 
            />

            
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
              path="/client-dashboard"
              element={<ClientDashboard />}
            />
            <Route
              path="/client-meetings"
              element={<Meetings />}
            />
            <Route
              path="/client-projects"
              element={<ProjectsClient />}
            />

            {/* Chat */}
            <Route
              path="/chat"
              element={<Chat />}
            />
            <Route
              path="/meetings"
              element={<Meetings />}
            />

           
            
             

            {/* Default */}
            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard-admin"
                  replace
                />
              }
             
            />
            <Route path="/add-company" element={<AddingCompany />} />
              
             
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
        <Route
          path="/"
          element={<Navigate to="/Signup" replace />}
        />

        <Route
          path="/Signup"
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
        

        <Route
          path="*"
          element={<Navigate to="/Signup" replace />}
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard-admin"
            replace
          />
        }
      />

      <Route
        path="/*"
        element={<AppLayout />}
      />
    </Routes>
  );
}
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
import ProjectOversightFull from "./pages/ProjectOversightFull";
import Reports from "./pages/Reports.jsx"
import Calendar from "./pages/Calendar.jsx";
import TeamManagement from "./components/teammangemnt/teamMangement";
import CompanySidebar from "./Component/Company/CompnySidebar.jsx";
import Subscriptionsidebar from "./Component/Subscriptions/SubscriptionSidebar.jsx";
import Pending from "./Component/Subscriptions/pending";
import ReportsSidebar from "./Component/Reports/reportsSidebar.jsx";
import MyTasks from "./pages/MyTasks.jsx";


import ProjectOversight from "./pages/ProjectOversight";

import CompanyReports from "./pages/CompanyReports.jsx";



import ClientDashboard from "./pages/ClientDashboard.jsx";
import Meetings from "./pages/Meetings";
import ProjectsClient from "./pages/ProjectsClient.jsx";


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

 const navbarRole =
  {
    "/dashboard1": "superAdmin",
    "/companies": "superAdmin",
    "/subscriptions": "superAdmin",
    "/reports": "superAdmin",

    "/dashboard2": "companyAdmin",
    "/team-management": "companyAdmin",
    "/projects": "companyAdmin",
    "/company-reports": "companyAdmin",

    "/dashboard3": "projectLeader",
    "/project": "projectLeader",
    "/calendar": "projectLeader",
    "/report": "projectLeader",

    "/dashboard4": "teamMember",
    "/tasks": "teamMember",

    "/client-dashboard": "client",
    "/client-projects": "client",
    "/client-meetings": "client",
  }[location.pathname] || "teamMember";

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
       <Navbar
  onToggle={handleToggle}
  role={navbarRole}
/>

        <main className="p-4 sm:p-6">
          <Routes>
            <Route path="/dashboard3" element={<LeaderDashboard />} />
            <Route path="/dashboard" element={<LeaderDashboard/>} />
            <Route path="/projects" element={<Dashboard />} />
            <Route path="/dashboard" element={<LeaderDashboard />} />
            <Route path="/teams" element={<TeamManagement />} />
            <Route path="/dashboard4" element={<TeamDashboard />} />
            <Route path="/super-admin" element={<Admin />} />
            <Route path="/dashboard1" element={<Admin />} />
            <Route path="/companies" element={<CompanySidebar />} />
            <Route path="/subscriptions" element={<Subscriptionsidebar />} />
            <Route path="/reports" element={<ReportsSidebar />} />
            <Route path="/pending" element ={<Pending />}/>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/project" element={<ProjectOversightFull />} />
            <Route path="/report" element={<Reports />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tasks" element={<MyTasks />} />
            
              <Route path="/team-management" element={<TeamManagement />} />
             
              <Route path="/company-reports" element={<CompanyReports />} />

              <Route path="/projects" element={<ProjectOversight />} />


               <Route path="/dashboard2" element={<Dashboard />} />


              
                <Route path="/client-dashboard" element={<ClientDashboard />} />
                <Route path="/client-meetings" element={<Meetings />} />
                <Route path="/client-projects" element={<ProjectsClient />} />
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

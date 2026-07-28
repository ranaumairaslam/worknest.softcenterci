import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Building2,
  Briefcase,
  Clock3,
  FileText,
  MessageSquare,
} from "lucide-react";

export const roleConfig = {
  superAdmin: {
    title: "Super Admin Dashboard",
    role: "Super Admin",
    username: "Super Admin",
    userinitials: "SA",
  },

  companyAdmin: {
    title: "Company Dashboard",
    role: "Company Admin",
    username: "Company Admin",
    userinitials: "CA",
  },

  projectLeader: {
    title: "Project Dashboard",
    role: "Project Leader",
    username: "Project Leader",
    userinitials: "PL",
  },

  teamMember: {
    title: "Team Dashboard",
    role: "Team Member",
    username: "Team Member",
    userinitials: "TM",
  },

  client: {
    title: "Client Dashboard",
    role: "Client",
    username: "Client",
    userinitials: "CL",
  },
};
export const navigation = {
  superAdmin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard1",
    },
    {
      title: "Companies",
      icon: Building2,
      path: "/companies",
    },
    {
      title: "Subscriptions",
      icon: CreditCard,
      path: "/subscriptions",
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
  ],

  companyAdmin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard2",
    },
    {
      title: "Teams",
      icon: Users,
      path: "/team-management",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/company-reports",
    },
  ],

  projectLeader: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard3",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/project",
    },
    {
      title: "Calendar",
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/report",
    },
  ],

  teamMember: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard4",
    },
    {
      title: "My Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
  ],

  client: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/client-dashboard",
    },
    {
      title: "My Projects",
      icon: Briefcase,
      path: "/client-projects",
    },
   
    {
      title: "Meetings",
      icon: CalendarDays,
      path: "/client-meetings",
    },   {
      title: "Calendar",
      icon: CalendarDays,
      path: "/calendar",
    },
   
    
  ],
};
export const getRoleFromPath = (pathname) => {
  const routes = {
   
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
  };

  return routes[pathname] || "teamMember";
};
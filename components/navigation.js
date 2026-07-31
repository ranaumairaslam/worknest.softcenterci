import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  Clock3,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Building2,
  Briefcase,
  MessageCircle,
  DollarSign,
  UserRound,
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
      path: "/dashboard-admin",
    },
    {
      title: "Companies",
      icon: Building2,
      path: "/companies",
    },
  
    {
      title: "Revenue",
      icon: BarChart3,
      path: "/revenue",
    },
  ],

  companyAdmin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard-company",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      title: "Teams",
      icon: Users,
      path: "/team-management",
    },
    {
      title: "Employees",
      icon: UserRound,
      path: "/employees",
    },
    {
      title: "Tasks",
      icon: CheckSquare,
      path: "/company-tasks",
    },
    {
      title: "Clients",
      icon: Building2,
      path: "/clients",
    },
    {
      title: "Meetings",
      icon: CalendarDays,
      path: "/company-meetings",
    },
    {
      title: "Revenue",
      icon: DollarSign,
      path: "/revenue",
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
      path: "/dashboard-leader",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/project",
    },
     {
    title: "Tasks",
    icon: CheckSquare,
    path: "/project/tasks",
  },
   {
    title: "Team Performance",
    icon: Users,
    path: "/project/team-performance",
  },
     {
    title: "Timeline",
    icon: Clock3,
    path: "/project/timeline",
  },
  
  {
    title: "Kanban Board",
    icon: Briefcase,
    path: "/project/kanban",
  },
  {
    title: "Calendar",
    icon: CalendarDays,
    path: "/calendar",
  },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/project-reports",
    },
    
  ],

  teamMember: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard-team-member",
    },
    {
      title: "My Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/team-member-projects",
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
    },
    {
  title: "Chat",
  path: "/chat",
  icon: MessageCircle,
}
   
    
  ],
};
export const getRoleFromPath = (pathname) => {
  const routes = {
    // Super Admin
    "/dashboard-admin": "superAdmin",
    "/companies": "superAdmin",
    "/subscriptions": "superAdmin",
    "/reports": "superAdmin",
    "/pending": "superAdmin",

    // Company Admin
    "/dashboard-company": "companyAdmin",
    "/team-management": "companyAdmin",
    "/projects": "companyAdmin",
    "/employees": "companyAdmin",
    "/company-tasks": "companyAdmin",
    "/clients": "companyAdmin",
    "/company-meetings": "companyAdmin",
    "/revenue": "companyAdmin",
    "/company-reports": "companyAdmin",

    // Project Leader
    "/dashboard-leader": "projectLeader",
    "/project": "projectLeader",
    "/calendar": "projectLeader",
    "/project-reports": "projectLeader",
    "/project/timeline": "projectLeader",
    "/project/team-performance": "projectLeader",
    "/project/tasks": "projectLeader",
    "/project/kanban": "projectLeader",

    // Team Member
    "/dashboard-team-member": "teamMember",
    "/tasks": "teamMember",
    "/team-member-projects": "teamMember",

    // Client
    "/client-dashboard": "client",
    "/client-projects": "client",
    "/client-meetings": "client",

    // Shared
    "/chat": "client",
  };

  return routes[pathname] || "superAdmin";
};
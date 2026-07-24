import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Building2,
} from "lucide-react";

export const navigation = {
  superAdmin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
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
      path: "/dashboard",
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
      path: "/dashboard",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      title: "Calendar",
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      title: "Reports",
      icon: BarChart3,
      path: "/reports",
    },
  ],

  teamMember: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
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
};
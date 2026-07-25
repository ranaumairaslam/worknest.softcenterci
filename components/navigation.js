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
};
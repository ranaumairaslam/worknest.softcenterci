import {
  Building2,
  Users,
  TrendingUp,
  UserCheck,
  Clock3,
  Ban,
} from "lucide-react";

export const companyCards = [
  {
    key: "total",
    title: "Total Companies",
    subTitle: "Registered Companies",
    trend: "+12%",
    trendColor: "text-green-600",
    icon: Building2,
    gradient: "from-indigo-500 to-violet-500",
  },

  {
    key: "active",
    title: "Active Companies",
    subTitle: "Currently Active",
    trend: "+8%",
    trendColor: "text-green-600",
    icon: UserCheck,
    gradient: "from-sky-500 to-cyan-500",
  },

  {
    key: "new",
    title: "New This Month",
    subTitle: "New Registrations",
    trend: "+15%",
    trendColor: "text-green-600",
    icon: TrendingUp,
    gradient: "from-green-500 to-emerald-500",
  },

  {
    key: "employees",
    title: "Total Employees",
    subTitle: "Across Companies",
    trend: "+6%",
    trendColor: "text-green-600",
    icon: Users,
    gradient: "from-pink-500 to-rose-500",
  },

  {
    key: "pending",
    title: "Pending Approval",
    subTitle: "Waiting Review",
    trend: "-2%",
    trendColor: "text-yellow-600",
    icon: Clock3,
    gradient: "from-yellow-500 to-orange-500",
  },

  {
    key: "suspended",
    title: "Suspended",
    subTitle: "Inactive Companies",
    trend: "-1%",
    trendColor: "text-red-600",
    icon: Ban,
    gradient: "from-red-500 to-pink-500",
  },
];
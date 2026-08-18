import {
  Users,
  DollarSign,
  Building2,
  UserCheck,
  Clock3,
  Ban,
  CreditCard,
  UserPlus,
} from "lucide-react";

const DashboardCardsData = [
  {
    key: "totalUsers",
    title: "Total Active Users",
    change: "+0.9%",
    color: "text-green-500",
    icon: Users,
  },

  {
    key: "monthlyRevenue",
    title: "Monthly Revenue",
    change: "+1.7%",
    color: "text-green-500",
    icon: DollarSign,
  },

  {
    key: "totalCompanies",
    title: "Total Companies",
    change: "+3",
    color: "text-green-500",
    icon: Building2,
  },

  {
    key: "activeEmployees",
    title: "Active Employees",
    change: "+5%",
    color: "text-green-500",
    icon: UserCheck,
  },

  {
    key: "pendingCompanies",
    title: "Pending Companies",
    change: "Review",
    color: "text-yellow-500",
    icon: Clock3,
  },

  {
    key: "suspendedCompanies",
    title: "Suspended Companies",
    change: "Attention",
    color: "text-red-500",
    icon: Ban,
  },

  {
    key: "paidCompanies",
    title: "Paid Companies",
    change: "Successful",
    color: "text-green-500",
    icon: CreditCard,
  },

  {
    key: "newCompanies",
    title: "New This Month",
    change: "+15%",
    color: "text-green-500",
    icon: UserPlus,
  },
];

export default DashboardCardsData;
import {
  Building2,
  Users,
  FolderKanban,
  DollarSign,
  Shield,
  Bell,
  Globe,
  Layers,
  Clock,
  Briefcase,
  Settings as SettingsIcon,
  Phone,
  MapPin,
  Video,
  FileText,
  LayoutGrid,
  UserPlus,
  ClipboardCheck,
  ClipboardList,
} from "lucide-react";

const roleConfig = {
  superAdmin: {
    role: "Super Admin",
    settings: [
      { icon: Globe, title: "Platform Name", input: true, placeholder: "Enter platform name" },
      { icon: Bell, title: "Support Email", input: true, placeholder: "Enter support email" },
      { icon: DollarSign, title: "Default Currency", select: true, placeholder: "Select currency", options: ["USD", "EUR", "GBP", "PKR", "AED"] },
      { icon: Building2, title: "Company Management", path: "/companies" },
      { icon: DollarSign, title: "Revenue Settings", path: "/revenue" },
      { icon: Shield, title: "System Security", tab: "security" },
    ],
    notifications: [
      { key: "newCompanyRegistered", icon: Building2, title: "New Company Registered", desc: "Notify me when a new company signs up", defaultValue: true },
    ],
  },

  companyAdmin: {
    role: "Company Admin",
    settings: [
      { icon: Building2, title: "Company Name", input: true, placeholder: "Enter company name" },
      { icon: Layers, title: "Industry", select: true, placeholder: "Select industry", options: ["Software Development", "Web Development", "Mobile App Development", "UI/UX Design", "Artificial Intelligence", "Machine Learning", "Data Science", "Cloud Computing", "Cyber Security", "IT Consulting", "Digital Marketing", "E-Commerce", "SaaS", "Finance", "Other"] },
      { icon: Users, title: "Company Size", select: true, placeholder: "Select company size", options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
      { icon: MapPin, title: "Company Location", input: true, placeholder: "Enter company location" },
      { icon: Video, title: "Default Meeting Platform", select: true, placeholder: "Select meeting platform", options: ["Zoom", "Google Meet", "Microsoft Teams", "Skype"] },
      { icon: FileText, title: "Report Export Format", select: true, placeholder: "Select export format", options: ["PDF", "Excel"] },
      { icon: Users, title: "Employee Management", path: "/employees" },
      { icon: FolderKanban, title: "Project Settings", path: "/projects" },
    ],
    notifications: [
      { key: "newClientAdded", icon: UserPlus, title: "New Client Added", desc: "Notify me when a new client is added", defaultValue: true },
    ],
  },

  projectLeader: {
    role: "Project Leader",
    settings: [
      { icon: Clock, title: "Sprint Duration", select: true, placeholder: "Select sprint duration", options: ["1 Week", "2 Weeks", "3 Weeks", "4 Weeks"] },
      { icon: Layers, title: "Default Task Priority", select: true, placeholder: "Select default priority", options: ["Low", "Medium", "High", "Urgent"] },
      { icon: LayoutGrid, title: "Default View Mode", select: true, placeholder: "Select default view", options: ["Kanban", "List"] },
      { icon: FolderKanban, title: "Sprint Management", path: "/project/kanban" },
      { icon: Users, title: "Team Performance", path: "/project/team-performance" },
    ],
    notifications: [
      { key: "deliverableSubmitted", icon: ClipboardCheck, title: "Deliverable Submitted", desc: "Notify me when a team member submits work for review", defaultValue: true },
    ],
  },

  teamMember: {
    role: "Team Member",
    settings: [
      { icon: Briefcase, title: "Job Title", input: true, placeholder: "Enter job title" },
      { icon: Clock, title: "Working Hours", input: true, placeholder: "e.g. 9 AM - 5 PM" },
      { icon: LayoutGrid, title: "Default Dashboard View", select: true, placeholder: "Select default view", options: ["Personal", "Team"] },
      { icon: FolderKanban, title: "Task Preferences", path: "/my-tasks" },
    ],
    notifications: [
      { key: "taskAssigned", icon: ClipboardList, title: "Task Assigned to Me", desc: "Notify me when a new task is assigned", defaultValue: true },
    ],
  },

  client: {
    role: "Client",
    settings: [
      { icon: Bell, title: "Meeting Notifications", input: true, placeholder: "Meeting Link" },
      { icon: Building2, title: "Company Name", input: true, placeholder: "Enter your company name" },
      {
        icon: Phone,
        title: "Preferred Contact Method",
        select: true,
        placeholder: "Select contact method",
        options: ["Email", "Phone", "Slack", "WhatsApp"],
        dependentInput: true,
        dependentPlaceholders: {
          Email: "Enter your email address",
          Phone: "Enter your phone number",
          Slack: "Enter your Slack handle",
          WhatsApp: "Enter your WhatsApp number",
        },
      },
      { icon: FolderKanban, title: "Project Preferences", path: "/client-projects" },
    ],
    notifications: [
      { key: "meetingReminder", icon: Video, title: "Meeting Reminder", desc: "Notify me before an upcoming meeting", defaultValue: true },
    ],
  },
};

export function getRoleSettings(role) {
  return (
    roleConfig[role] || {
      role: "User",
      settings: [],
      notifications: [],
    }
  );
}
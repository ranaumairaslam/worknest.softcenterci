// Later, replace the return values here with real API calls (fetch/axios).
// Every function returns a Promise so switching to a real API needs no changes elsewhere.

export async function getStats() {
  return [
    { id: "total-projects", label: "Total Projects", value: "24", note: "+2 this month" },
    { id: "active-tasks", label: "Active Tasks", value: "185", note: "+15 new" },
    { id: "completed-projects", label: "Completed Projects", value: "112", note: "8 this week" },
  ];
}

export async function getProjectProgress() {
  return [
    { name: "Alpha Platform Rebrand", team: "AI/ML Team", status: "Active", progress: 65 },
    { name: "Project Alpha", team: "AI/ML Team", status: "Active", progress: 70 },
    { name: "System Platform Rebrand", team: "AI/ML Team", status: "Active", progress: 58 },
  ];
}

export async function getInvitations() {
  return [
    { id: 1, primary: "Sarah L. (TM) completed task 'API Docs'" },
    { id: 2, primary: "Project Alpha assigned to Web Dev Team" },
    { id: 3, primary: "System health check passed 99.9%" },
  ];
}

export async function getTeamOverview() {
  return [
    { id: 1, primary: "Sarah L. (TM)", secondary: "swab_eoinn@gmail.com", action: "Role" },
    { id: 2, primary: "Jane Doe", secondary: "jenq@nme.gmail.com", action: "Resend" },
  ];
}
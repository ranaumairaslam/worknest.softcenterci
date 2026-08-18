let activityLog = [
  {
    id: "a1",
    time: "Just now",
    type: "Project Created",
    message: "Alpha Platform Rebrand was created.",
  },
  {
    id: "a2",
    time: "10 minutes ago",
    type: "Task Assigned",
    message: "API Documentation assigned to Sarah Khan.",
  },
  {
    id: "a3",
    time: "1 hour ago",
    type: "Meeting Scheduled",
    message: "Project Review Meeting was scheduled.",
  },
  {
    id: "a4",
    time: "Yesterday",
    type: "Team Created",
    message: "Web Development team was created.",
  },
];

export async function getRecentActivity() {
  return activityLog.map((item) => ({ ...item }));
}

export async function addActivity(entry, role) {
  const newEntry = {
    id: `a${Date.now()}`,
    time: entry.time || "Just now",
    type: entry.type,
    message: entry.message,
    role: role || undefined,
  };

  activityLog.unshift(newEntry);
  console.log("Activity added", { newEntry });
  return { ...newEntry };
}

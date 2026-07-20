export async function getProjects() {
  return [
    { id: "p1", name: "Alpha Platform Rebrand" },
    { id: "p2", name: "Project Alpha" },
    { id: "p3", name: "System Platform Rebrand" },
  ];
}

export async function getProjectTasks(projectId) {
  const tasks = [
    { id: "t1", title: "Alpha Platform Rebrand", status: "todo", assignee: { name: "Sarah 1", avatar: "S1" } },
    { id: "t2", title: "Project Alpha assigned to Web", status: "todo", assignee: { name: "Sarah L.", avatar: "SL" } },
    { id: "t3", title: "System Platform Rebrand", status: "in_progress", assignee: { name: "Sarah L.", avatar: "SL" } },
  ];

  return tasks.map((task) => ({ ...task, projectId }));
}

export async function getPendingDeliverables() {
  return [
    {
      id: "d1",
      member: { name: "Sarah Member", avatar: "SM" },
      fileLabel: "Attached files",
      linkLabel: "link/ZIP",
      url: "https://documents.com/ZIP",
    },
    {
      id: "d2",
      member: { name: "Sarah L. (TM)", avatar: "SL" },
      fileLabel: "Attached files",
      linkLabel: "link/ZIP",
      url: "https://documents.com/ZIP",
    },
    {
      id: "d3",
      member: { name: "Jane Doe", avatar: "JD" },
      fileLabel: "Attached files",
      linkLabel: "link/ZIP",
      url: "https://documents.com/ZIP",
    },
  ];
}
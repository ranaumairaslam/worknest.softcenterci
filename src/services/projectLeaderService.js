export async function getProjects() {
  return [
    { id: "p1", name: "Alpha Platform Rebrand" },
    { id: "p2", name: "Project Alpha" },
    { id: "p3", name: "System Platform Rebrand" },
  ];
}

export async function getProjectTasks(projectId) {
  const taskSets = {
    p1: [
      { id: "t1", title: "Alpha Platform Rebrand", status: "todo", assignee: { name: "Sarah L.", avatar: "SL" } },
      { id: "t4", title: "API Docs Review", status: "under_review", assignee: { name: "Sarah Member", avatar: "SM" } },
      { id: "t5", title: "Design Handoff", status: "completed", assignee: { name: "Sarah L.", avatar: "SL" } }, 
    ],
    p2: [
      { id: "t2", title: "Project Alpha assigned to Web", status: "todo", assignee: { name: "Jane Doe", avatar: "JD" } },
      { id: "t6", title: "Task Deliverable Submission", status: "under_review", assignee: { name: "Sarah L. (TM)", avatar: "SL" } },
    ],
    p3: [
      { id: "t3", title: "System Platform Rebrand", status: "in_progress", assignee: { name: "Sarah L.", avatar: "SL" } },
      { id: "t7", title: "System Health Check", status: "under_review", assignee: { name: "Jane Doe", avatar: "JD" } },
    ],
  };

  return taskSets[projectId] ?? taskSets.p1;
}

export async function getPendingDeliverables(projectId) {
  const deliverableSets = {
    p1: [
      { id: "d1", taskId: "t4", member: { name: "Sarah Member", avatar: "SM" }, fileLabel: "Attached files", linkLabel: "link/ZIP", url: "https://documents.com/ZIP" },
    ],
    p2: [
      { id: "d2", taskId: "t6", member: { name: "Sarah L. (TM)", avatar: "SL" }, fileLabel: "Attached files", linkLabel: "link/ZIP", url: "https://documents.com/ZIP" },
    ],
    p3: [
      { id: "d3", taskId: "t7", member: { name: "Jane Doe", avatar: "JD" }, fileLabel: "Attached files", linkLabel: "link/ZIP", url: "https://documents.com/ZIP" },
    ],
  };

  return deliverableSets[projectId] ?? deliverableSets.p1;
}

export async function approveDeliverable(id, comment) {
  console.log("API call: approve deliverable", id, "comment:", comment);
  return { id, status: "approved", comment };
}

export async function rejectDeliverable(id, comment) {
  console.log("API call: reject deliverable", id, "comment:", comment);
  return { id, status: "rejected", comment };
}

export async function getTeamProgressStats(projectId) {
  const statSets = {
    p1: [
      { id: "team-members", label: "Team Members", value: "3", note: "Active" },
      { id: "in-progress", label: "Tasks in Progress", value: "1", note: "This project" },
      { id: "overdue", label: "Overdue Tasks", value: "0", note: "Needs attention" },
      { id: "completion", label: "Completion", value: "50%", note: "+8% this week" },
    ],
    p2: [
      { id: "team-members", label: "Team Members", value: "2", note: "Active" },
      { id: "in-progress", label: "Tasks in Progress", value: "0", note: "This project" },
      { id: "overdue", label: "Overdue Tasks", value: "1", note: "Needs attention" },
      { id: "completion", label: "Completion", value: "20%", note: "-2% this week" },
    ],
    p3: [
      { id: "team-members", label: "Team Members", value: "2", note: "Active" },
      { id: "in-progress", label: "Tasks in Progress", value: "1", note: "This project" },
      { id: "overdue", label: "Overdue Tasks", value: "0", note: "Needs attention" },
      { id: "completion", label: "Completion", value: "35%", note: "+5% this week" },
    ],
  };

  return statSets[projectId] ?? statSets.p1;
}

export async function getTeamMembers() {
  return [
    { id: "m1", name: "Sarah L.", avatar: "SL" },
    { id: "m2", name: "Jane Doe", avatar: "JD" },
    { id: "m3", name: "Sarah Member", avatar: "SM" },
  ];
}

export async function reassignTask(taskId, memberId) {
  console.log("API call: reassign task", taskId, "to member", memberId);
  return { taskId, memberId };
}
export async function createProject(project) {
  console.log("API call: create project", project);
  return { id: `p${Date.now()}`, name: project.name };
}
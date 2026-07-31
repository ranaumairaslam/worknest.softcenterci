/**
 * Get tasks assigned to the current team member.
 * @param {string} [role]
 */
export async function getMyTasks(role) {
  console.log("API call: getMyTasks", { role });
  return [
    { id: "t1", title: "Alpha Platform Rebrand 'API Docs'", status: "todo", project: "Alpha Platform Rebrand", assignee: { name: "Sarah L.", avatar: "SL" } },
    { id: "t2", title: "System Deliverable Submission 99.9%", status: "todo", project: "System Platform Rebrand", assignee: { name: "Sarah L.", avatar: "SL" } },
    { id: "t3", title: "Task Deliverable Submission", status: "in_progress", project: "Project Alpha", assignee: { name: "Sarah L.", avatar: "SL" } },
    { id: "t4", title: "My Tasks teams turnover", status: "in_progress", project: "Alpha Platform Rebrand", assignee: { name: "Sarah L.", avatar: "SL" } },
    { id: "t5", title: "Task Reviews cetom and Doe", status: "under_review", project: "System Platform Rebrand", assignee: { name: "Sarah L.", avatar: "SL" } },
    { id: "t6", title: "Sarah t/ Ufmi assigned task Docs", status: "completed", project: "Project Alpha", assignee: { name: "Sarah L.", avatar: "SL" } },
  ];
}

/**
 * Get tasks for the team (includes mine and others).
 * @param {string} [role]
 */
export async function getTeamTasks(role) {
  const mine = await getMyTasks(role);
  const others = [
    { id: "t7", title: "Homepage Development", status: "in_progress", project: "Alpha Platform Rebrand", assignee: { name: "Jane Doe", avatar: "JD" } },
    { id: "t8", title: "API Integration Review", status: "under_review", project: "Project Alpha", assignee: { name: "Jane Doe", avatar: "JD" } },
    { id: "t9", title: "Design Handoff", status: "todo", project: "System Platform Rebrand", assignee: { name: "Noah Smith", avatar: "NS" } },
    { id: "t10", title: "QA Sign-off", status: "completed", project: "Alpha Platform Rebrand", assignee: { name: "Noah Smith", avatar: "NS" } },
  ];
  console.log("API call: getTeamTasks", { role });
  return [...mine, ...others];
}

/**
 * Submit work for a task (mock).
 * @param {string} taskId
 * @param {object} payload
 * @param {string} [role]
 */
export async function submitTaskWork(taskId, payload, role) {
  console.log("API call: submit task work", { taskId, payload, role });
  return { taskId, status: "under_review", role: role || undefined };
}
export async function getMyTasks() {
  return [
    {
      id: "t1",
      title: "Alpha Platform Rebrand 'API Docs'",
      status: "todo",
      assignee: { name: "Sarah L.", avatar: "SL" },
    },
    {
      id: "t2",
      title: "System Deliverable Submission 99.9%",
      status: "todo",
      assignee: { name: "Sarah L.", avatar: "SL" },
    },
    {
      id: "t3",
      title: "Task Deliverable Submission",
      status: "in_progress",
      assignee: { name: "Sarah L.", avatar: "SL" },
    },
    {
      id: "t4",
      title: "My Tasks teams turnover",
      status: "in_progress",
      assignee: { name: "Sarah L.", avatar: "SL" },
    },
    {
      id: "t5",
      title: "Task Reviews cetom and Doe",
      status: "under_review",
      assignee: { name: "Sarah L.", avatar: "SL" },
    },
    {
      id: "t6",
      title: "Sarah t/ Ufmi assigned task Docs",
      status: "completed",
      assignee: { name: "Sarah L.", avatar: "SL" },
    },
  ];
}
export function filterProjects(projects, { role, user }) {
  if (!projects?.length) return [];
  switch (role) {
    case "superAdmin":
    case "companyAdmin":
      return projects;
    case "projectLeader":
      return projects.filter(
        (p) =>
          p.leaderId === user.employeeId ||
          p.leader === user.name
      );
    case "teamMember":
      return projects.filter((p) =>
        p.memberIds?.includes(user.employeeId)
      );
    case "client":
      return projects.filter((p) => p.clientId === user.clientId);
    default:
      return [];
  }
}

export function filterTasks(tasks, { role, user }) {
  if (!tasks?.length) return [];
  switch (role) {
    case "superAdmin":
    case "companyAdmin":
      return tasks;
    case "projectLeader": {
      const leaderName = user.name;
      return tasks.filter(
        (t) =>
          t.assigneeId === user.employeeId ||
          t.assignee === leaderName ||
          t.projectLeaderId === user.employeeId
      );
    }
    case "teamMember":
      return tasks.filter(
        (t) =>
          t.assigneeId === user.employeeId ||
          t.assignee === user.name
      );
    case "client":
      return tasks.filter((t) => t.clientId === user.clientId);
    default:
      return [];
  }
}

export function filterMeetings(meetings, { role, user }) {
  if (!meetings?.length) return [];
  switch (role) {
    case "superAdmin":
    case "companyAdmin":
      return meetings;
    case "projectLeader":
    case "teamMember":
      return meetings.filter(
        (m) =>
          m.participantIds?.includes(user.employeeId) ||
          m.participantIds?.includes(user.id) ||
          m.organizerId === user.employeeId ||
          m.organizer === user.name ||
          m.participants?.includes(user.name)
      );
    case "client":
      return meetings.filter(
        (m) =>
          m.clientId === user.clientId ||
          m.participantIds?.includes(user.clientId) ||
          m.participantIds?.includes(user.id)
      );
    default:
      return [];
  }
}

export function filterTeams(teams, { role, user }) {
  if (!teams?.length) return [];
  switch (role) {
    case "superAdmin":
    case "companyAdmin":
      return teams;
    case "projectLeader":
      return teams.filter(
        (t) =>
          t.leaderId === user.employeeId ||
          t.projectLeader === user.name
      );
    case "teamMember":
      return teams.filter((t) => t.members?.includes(user.employeeId));
    default:
      return [];
  }
}

export function filterNotifications(notifications, { role, user }) {
  if (!notifications?.length) return [];
  const userId = user.employeeId || user.clientId || user.id;
  return notifications.filter(
    (n) =>
      n.recipientId === userId ||
      (role === "superAdmin" && n.recipientRole === "superAdmin") ||
      (role === "companyAdmin" && n.recipientRole === "companyAdmin")
  );
}

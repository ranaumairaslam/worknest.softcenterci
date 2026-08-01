import { addActivity } from "./activityService.js";
import { createNotifications, NOTIFICATION_TYPES } from "./notificationService.js";
import { emitDataChange } from "../utils/eventBus.js";

export async function onProjectCreated(project, actor) {
  const notifications = [];

  if (project.leaderId) {
    notifications.push({
      type: NOTIFICATION_TYPES.LEADER_ASSIGNED,
      message: `You were assigned as leader of "${project.name}".`,
      recipientId: project.leaderId,
      recipientRole: "projectLeader",
      metadata: { projectId: project.id },
    });
  }

  for (const memberId of project.memberIds || []) {
    if (memberId === project.leaderId) continue;
    notifications.push({
      type: NOTIFICATION_TYPES.PROJECT_ASSIGNED,
      message: `You were added to project "${project.name}".`,
      recipientId: memberId,
      recipientRole: "teamMember",
      metadata: { projectId: project.id },
    });
  }

  if (project.clientId) {
    notifications.push({
      type: NOTIFICATION_TYPES.CLIENT_ADDED,
      message: `Project "${project.name}" was linked to your account.`,
      recipientId: project.clientId,
      recipientRole: "client",
      metadata: { projectId: project.id },
    });
  }

  await addActivity(
    {
      type: "Project Created",
      message: `${actor.name} created project "${project.name}".`,
    },
    actor.role
  );

  if (project.team) {
    await addActivity(
      {
        type: "Team Linked",
        message: `Project assigned to ${project.team}.`,
      },
      actor.role
    );
  }

  if (project.leader) {
    await addActivity(
      {
        type: "Leader Assigned",
        message: `${project.leader} assigned as Project Leader.`,
      },
      actor.role
    );
  }

  if (notifications.length) {
    await createNotifications(notifications);
  }

  emitDataChange("project");
}

export async function onProjectUpdated(project, actor, changes = {}) {
  await addActivity(
    {
      type: "Project Updated",
      message: `${actor.name} updated project "${project.name}".`,
    },
    actor.role
  );

  const notifications = [];

  if (changes.leaderId && changes.leaderId !== changes.previousLeaderId) {
    notifications.push({
      type: NOTIFICATION_TYPES.LEADER_ASSIGNED,
      message: `You were assigned as leader of "${project.name}".`,
      recipientId: changes.leaderId,
      recipientRole: "projectLeader",
      metadata: { projectId: project.id },
    });
  }

  if (notifications.length) {
    await createNotifications(notifications);
  }

  emitDataChange("project");
}

export async function onProjectDeleted(project, actor) {
  await addActivity(
    {
      type: "Project Deleted",
      message: `${actor.name} deleted project "${project.name}".`,
    },
    actor.role
  );
  emitDataChange("project");
}

export async function onProjectCompleted(project, actor) {
  const notifications = [];

  if (project.leaderId) {
    notifications.push({
      type: NOTIFICATION_TYPES.PROJECT_COMPLETED,
      message: `Project "${project.name}" has been marked completed.`,
      recipientId: project.leaderId,
      recipientRole: "projectLeader",
      metadata: { projectId: project.id },
    });
  }

  if (project.clientId) {
    notifications.push({
      type: NOTIFICATION_TYPES.PROJECT_COMPLETED,
      message: `Project "${project.name}" has been completed.`,
      recipientId: project.clientId,
      recipientRole: "client",
      metadata: { projectId: project.id },
    });
  }

  await addActivity(
    {
      type: "Project Completed",
      message: `${actor.name} marked "${project.name}" as completed.`,
    },
    actor.role
  );

  if (notifications.length) {
    await createNotifications(notifications);
  }

  emitDataChange("project");
}

export async function onTaskAssigned(task, actor) {
  const assigneeId = task.assigneeId;
  if (assigneeId) {
    await createNotifications([
      {
        type: NOTIFICATION_TYPES.TASK_ASSIGNED,
        message: `"${task.name}" assigned to you.`,
        recipientId: assigneeId,
        recipientRole: "teamMember",
        metadata: { taskId: task.id, projectId: task.projectId },
      },
    ]);
  }

  await addActivity(
    {
      type: "Task Assigned",
      message: `"${task.name}" assigned to ${task.assignee || "team member"}.`,
    },
    actor.role
  );

  emitDataChange("task");
}

export async function onTaskStatusChanged(task, oldStatus, newStatus, actor) {
  await addActivity(
    {
      type: "Task Updated",
      message: `"${task.name}" moved from ${oldStatus} to ${newStatus}.`,
    },
    actor.role
  );

  if (newStatus === "Completed" && task.assigneeId) {
    await createNotifications([
      {
        type: NOTIFICATION_TYPES.TASK_COMPLETED,
        message: `"${task.name}" has been completed.`,
        recipientId: task.assigneeId,
        recipientRole: "teamMember",
        metadata: { taskId: task.id, projectId: task.projectId },
      },
    ]);
  }

  emitDataChange("task");
}

export async function onTeamCreated(team, actor) {
  const notifications = [];

  if (team.leaderId) {
    notifications.push({
      type: NOTIFICATION_TYPES.LEADER_ASSIGNED,
      message: `You were assigned as leader of team "${team.name}".`,
      recipientId: team.leaderId,
      recipientRole: "projectLeader",
      metadata: { teamId: team.id },
    });
  }

  for (const memberId of team.members || []) {
    if (memberId === team.leaderId) continue;
    notifications.push({
      type: NOTIFICATION_TYPES.MEMBER_ADDED,
      message: `You were added to team "${team.name}".`,
      recipientId: memberId,
      recipientRole: "teamMember",
      metadata: { teamId: team.id },
    });
  }

  await addActivity(
    {
      type: "Team Created",
      message: `${actor.name} created team "${team.name}".`,
    },
    actor.role
  );

  if (notifications.length) {
    await createNotifications(notifications);
  }

  emitDataChange("team");
}

export async function onMeetingScheduled(meeting, actor) {
  const notifications = (meeting.participantIds || []).map((participantId) => ({
    type: NOTIFICATION_TYPES.MEETING_SCHEDULED,
    message: `Meeting "${meeting.title}" was scheduled.`,
    recipientId: participantId,
    recipientRole: participantId.startsWith("c") ? "client" : "teamMember",
    metadata: { meetingId: meeting.id, projectId: meeting.projectId },
  }));

  await addActivity(
    {
      type: "Meeting Scheduled",
      message: `"${meeting.title}" was scheduled.`,
    },
    actor.role
  );

  if (notifications.length) {
    await createNotifications(notifications);
  }

  emitDataChange("meeting");
}

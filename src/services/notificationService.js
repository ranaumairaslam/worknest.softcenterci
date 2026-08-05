import { normalizeFilters } from "./authContext.js";
import { filterNotifications } from "../utils/roleFilter.js";
import { emitDataChange } from "../utils/eventBus.js";

let notifications = [];

export const NOTIFICATION_TYPES = {
  PROJECT_ASSIGNED: "PROJECT_ASSIGNED",
  TASK_ASSIGNED: "TASK_ASSIGNED",
  MEETING_SCHEDULED: "MEETING_SCHEDULED",
  MEETING_CANCELLED: "MEETING_CANCELLED",
  MEETING_UPDATED: "MEETING_UPDATED",
  PROJECT_UPDATED: "PROJECT_UPDATED",
  PROJECT_COMPLETED: "PROJECT_COMPLETED",
  CLIENT_ADDED: "CLIENT_ADDED",
  CLIENT_REMOVED: "CLIENT_REMOVED",
  TEAM_CREATED: "TEAM_CREATED",
  TEAM_UPDATED: "TEAM_UPDATED",
  TASK_COMPLETED: "TASK_COMPLETED",
  LEADER_ASSIGNED: "LEADER_ASSIGNED",
  MEMBER_ADDED: "MEMBER_ADDED",
  MEMBER_REMOVED: "MEMBER_REMOVED",
};

export async function getNotifications(roleOrFilters) {
  const filters = normalizeFilters(roleOrFilters);
  return filterNotifications(notifications, filters).map((n) => ({ ...n }));
}

export async function createNotification({
  type,
  message,
  recipientId,
  recipientRole,
  metadata = {},
}) {
  const entry = {
    id: `n${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    recipientId,
    recipientRole,
    metadata,
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(entry);
  return { ...entry };
}

export async function createNotifications(items) {
  const created = [];
  for (const item of items) {
    created.push(await createNotification(item));
  }
  emitDataChange("notification");
  return created;
}

export async function markAsRead(id) {
  const index = notifications.findIndex((n) => n.id === id);
  if (index === -1) return null;
  notifications[index].read = true;
  emitDataChange("notification");
  return { ...notifications[index] };
}

export async function markAllAsRead(recipientId) {
  notifications.forEach((n) => {
    if (n.recipientId === recipientId) n.read = true;
  });
  emitDataChange("notification");
  return true;
}

export async function getUnreadCount(roleOrFilters) {
  const list = await getNotifications(roleOrFilters);
  return list.filter((n) => !n.read).length;
}

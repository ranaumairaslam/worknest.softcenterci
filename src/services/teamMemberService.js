// src/services/teamMemberService.js
import { get, post } from "./apiClient";

/* ------------------- MAPPERS ------------------- */

function mapStatusToKanban(status) {
  const map = {
    todo: "todo",
    in_progress: "in_progress",
    submitted: "under_review",
    approved: "completed",
    done: "completed",
    rejected: "in_progress",
  };
  return map[status] || "todo";
}

function getInitials(name = "?") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapTaskForKanban(task) {
  return {
    id: task.taskId,
    title: task.title || task.name,
    status: mapStatusToKanban(task.status),
    project: task.projectName || task.project || "Unassigned",
    priority: task.priority,
    dueDate: task.dueDate,
    description: task.description,
    assignee: {
      name: task.assigneeName || "Me",
      avatar: getInitials(task.assigneeName || "Me"),
    },
    raw: task,
  };
}

/* ------------------- TASKS API ------------------- */

export async function getMyTasks(filters = {}) {
  const res = await get("/team-member/tasks/assigned", filters);
  const list = res?.data || [];
  return list.map(mapTaskForKanban);
}

export async function getTeamTasks() {
  // Backend doesn't expose team-tasks for team_member role
  return [];
}

export async function getTaskById(taskId) {
  const task = await get(`/team-member/tasks/${taskId}`);
  return mapTaskForKanban(task);
}

export async function startTask(taskId) {
  return post(`/team-member/tasks/${taskId}/start`, {});
}

export async function submitTaskWork(taskId, payload = {}) {
  const body = {
    comment: payload.comment || "",
    attachments: payload.attachments || [],
  };
  return post(`/team-member/tasks/${taskId}/submit`, body);
}

export async function getMySubmissions() {
  const res = await get("/team-member/tasks/submissions");
  return res?.data || [];
}

export async function getSubmissionById(submissionId) {
  return get(`/team-member/tasks/submissions/${submissionId}`);
}

/* ------------------- MEETINGS API ------------------- */

export async function getUpcomingMeetings() {
  const res = await get("/team-member/meetings/upcoming");
  return res?.data || [];
}

export async function joinMeeting(meetingId) {
  return post(`/team-member/meetings/${meetingId}/join`, {});
}
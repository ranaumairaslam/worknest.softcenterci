import { PureComponent } from "react";
import { get, post, put, patch, del } from "./apiClient.js";

const BASE = "/team-leader";

/**
 * Safely extract API response data
 */
const extractData = (response, fallback = []) => {
  if (response?.data !== undefined) {
    return response.data;
  }

  return response ?? fallback;
};

/* =========================================================
   DASHBOARD
========================================================= */

export const getTeamLeaderDashboard = async () => {
  const response = await get(`${BASE}/dashboard`);

  console.log("📊 DASHBOARD RESPONSE:", response);

  return extractData(response, {});
};

export const getDashboard = getTeamLeaderDashboard;

/* =========================================================
   PROJECTS
========================================================= */

export const getTeamLeaderProjects = async () => {
  const response = await get(`${BASE}/projects`);

  console.log("📁 PROJECTS RESPONSE:", response);

  return extractData(response, []);
};

export const getProjects = getTeamLeaderProjects;

/* =========================================================
   MEMBERS
========================================================= */

export const getTeamLeaderMembers = async () => {
  const response = await get(`${BASE}/members`);

  console.log("👥 MEMBERS RESPONSE:", response);

  return extractData(response, []);
};

export const getMembers = getTeamLeaderMembers;

/* =========================================================
   PROGRESS
========================================================= */

export const getTeamLeaderProgress = async () => {
  const response = await get(`${BASE}/progress`);

  console.log("📈 PROGRESS RESPONSE:", response);

  const data = extractData(response, {});

  return [
    {
      id: "total-tasks",
      label: "Total Tasks",
      value: String(data.total_tasks ?? 0),
      note: "This team",
      color: "slate",
    },
    {
      id: "completed",
      label: "Completed",
      value: String(data.completed_tasks ?? 0),
      note: "Done",
      color: "emerald",
    },
    {
      id: "in-progress",
      label: "In Progress",
      value: String(data.in_progress_tasks ?? 0),
      note: "Active",
      color: "blue",
    },
    {
      id: "pending",
      label: "Pending",
      value: String(data.pending_tasks ?? 0),
      note: "Needs attention",
      color: "amber",
    },
    {
      id: "blocked",
      label: "Blocked",
      value: String(data.blocked_tasks ?? 0),
      note: "At risk",
      color: "rose",
    },
  ];
};

export const getProgress = getTeamLeaderProgress;

/* =========================================================
   TASKS
========================================================= */

/**
 * Get ALL tasks or tasks for a specific project.
 *
 * Example:
 * getTasks()
 * getTasks({ projectId: 37 })
 */
export const getTeamLeaderTasks = async ({ projectId } = {}) => {
  const query = projectId
    ? `?projectId=${encodeURIComponent(projectId)}`
    : "";

  const url = `${BASE}/tasks${query}`;

  console.log("📡 GET TASKS:", url);

  const response = await get(url);

  console.log("📥 TASKS API RESPONSE:", response);

  const data = extractData(response, []);

  console.log("📦 TASKS DATA:", data);

  return Array.isArray(data) ? data : [];
};

export const getTasks = getTeamLeaderTasks;

/* =========================================================
   SUBMITTED TASKS
========================================================= */

export const getTeamLeaderSubmittedTasks = async () => {
  const response = await get(`${BASE}/tasks/submitted`);

  console.log("📤 SUBMITTED TASKS RESPONSE:", response);

  const data = extractData(response, []);

  return Array.isArray(data) ? data : [];
};

export const getSubmittedTasks = getTeamLeaderSubmittedTasks;

/* =========================================================
   APPROVE TASK
========================================================= */

/**
 * Backend expects PUT for approve.
 */
export const approveTeamLeaderTask = async (taskId) => {
  console.log("✅ APPROVING TASK:", taskId);

  const response = await put(
    `${BASE}/tasks/${taskId}/approve`,
    {}
  );

  console.log("✅ APPROVE RESPONSE:", response);

  return extractData(response, {});
};

export const approveTask = approveTeamLeaderTask;

/* =========================================================
   RETURN TASK FOR REVISION
========================================================= */

export const returnTeamLeaderTaskForRevision = async (
  taskId,
  comment
) => {
  console.log("↩️ RETURNING TASK:", taskId, comment);

  const response = await post(
    `${BASE}/tasks/${taskId}/return`,
    {
      comment,
    }
  );

  console.log("↩️ RETURN RESPONSE:", response);

  return extractData(response, {});
};

export const returnTaskForRevision =
  returnTeamLeaderTaskForRevision;

/* =========================================================
   ASSIGN TASK
========================================================= */

export const assignTeamLeaderTask = async (taskId, memberId) => {
  console.log("👤 ASSIGNING TASK:", taskId, "TO MEMBER:", memberId);

  const response = await put(
    `${BASE}/tasks/${taskId}/assign`,
    {
      assignedTo: Number(memberId),
    }
  );

  console.log("👤 ASSIGN RESPONSE:", response);

  return extractData(response, {});
};

export const assignTask = assignTeamLeaderTask;   

/* =========================================================
   EDIT TASK
========================================================= */

export const editTeamLeaderTask = async (
  taskId,
  updates
) => {
  console.log(
    "✏️ EDITING TASK:",
    taskId,
    updates
  );

  const response = await put(
    `${BASE}/tasks/${taskId}`,
    updates
  );

  console.log("✏️ EDIT RESPONSE:", response);

  return extractData(response, {});
};

export const editTask = editTeamLeaderTask;

/* =========================================================
   DELETE TASK
========================================================= */

export const deleteTeamLeaderTask = async (taskId) => {
  console.log("🗑️ DELETING TASK:", taskId);

  const response = await del(
    `${BASE}/tasks/${taskId}`
  );

  console.log("🗑️ DELETE RESPONSE:", response);

  return extractData(response, {});
};

export const deleteTask = deleteTeamLeaderTask;

/* =========================================================
   MEETINGS
========================================================= */

export const getTeamLeaderMeetings = async (
  params = {}
) => {
  const response = await get(
    `${BASE}/meetings`,
    params
  );

  return extractData(response, []);
};

/* =========================================================
   CREATE MEETING
========================================================= */

export const createTeamLeaderMeeting = async (
  payload
) => {
  const response = await post(
    `${BASE}/meetings`,
    payload
  );

  return extractData(response, {});
};

/* =========================================================
   CANCEL MEETING
========================================================= */

export const cancelTeamLeaderMeeting = async (
  meetingId
) => {
  const response = await patch(
    `${BASE}/meetings/${meetingId}/cancel`,
    {}
  );

  return extractData(response, {});
};

/* =========================================================
   REPORTS
========================================================= */

export const getTeamLeaderReports = async () => {
  const response = await get(
    `${BASE}/reports`
  );

  return extractData(response, {
    team: null,
    summary: {},
  });
};
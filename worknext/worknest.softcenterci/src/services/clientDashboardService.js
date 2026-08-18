import {
  getClientDashboard as fetchClientDashboard,
  getClientProjects as fetchClientProjects,
  getClientProject as fetchClientProject,
  getClientProjectProgress as fetchClientProjectProgress,
  getClientProjectTasks as fetchClientProjectTasks,
  getClientProfile as fetchClientProfile,
  getClientMeetings as fetchClientMeetings,
} from "./clientApiService.js";

function normalizeProject(project = {}) {
  return {
    ...project,
    leader: project.leader || project.project_leader || "Unassigned",
    status: project.status
      ? String(project.status)
          .replace(/_/g, " ")
          .replace(/\b\w/g, (chr) => chr.toUpperCase())
      : "Unknown",
    deadline: project.end_date || project.due_date || project.deadline || "TBD",
    progress: Number(project.progress || 0),
    total_tasks: Number(project.total_tasks || 0),
    completed_tasks: Number(project.completed_tasks || 0),
    in_progress_tasks: Number(project.in_progress_tasks || 0),
    pending_tasks: Number(project.pending_tasks || 0),
  };
}

export async function getClientDashboard() {
  const data = await fetchClientDashboard();
  const projects = Array.isArray(data.projects)
    ? data.projects.map(normalizeProject)
    : [];
  const meetings = Array.isArray(data.upcoming_meetings) ? data.upcoming_meetings : [];

  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(
          projects.reduce((sum, project) => sum + (project.progress || 0), 0) /
            projects.length
        );

  const totalTasks = projects.reduce(
    (sum, project) => sum + (project.total_tasks || 0),
    0
  );

  return {
    profile: data.client || null,
    summary: data.summary || {},
    stats: [
      {
        id: 1,
        title: "Projects",
        value: data.summary?.total_projects ?? projects.length,
        color: "bg-cyan-600",
      },
      {
        id: 2,
        title: "Progress",
        value: `${avgProgress}%`,
        color: "bg-blue-600",
      },
      {
        id: 3,
        title: "Meetings",
        value: meetings.length,
        color: "bg-violet-600",
      },
      {
        id: 4,
        title: "Tasks",
        value: totalTasks,
        color: "bg-green-600",
      },
    ],
    projects,
    meetings,
    dashboard: data,
  };
}

export async function getClientProjects() {
  const projects = await fetchClientProjects();
  return Array.isArray(projects) ? projects.map(normalizeProject) : [];
}

export async function getClientProjectDetails(projectId) {
  const project = await fetchClientProject(projectId);
  return project ? normalizeProject(project) : null;
}

export async function getClientProjectProgress(projectId) {
  const response = await fetchClientProjectProgress(projectId);

  return {
    project: normalizeProject(response.project || {}),
    progress: response.progress || {},
    tasks: Array.isArray(response.tasks) ? response.tasks : [],
  };
}

export async function getClientProjectTasks(projectId) {
  const response = await fetchClientProjectTasks(projectId);

  return {
    project: normalizeProject(response.project || {}),
    tasks: Array.isArray(response.tasks) ? response.tasks : [],
  };
}

export async function getClientProfileInfo() {
  return fetchClientProfile();
}

export async function getClientMeetings() {
  return fetchClientMeetings();
}

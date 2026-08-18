import {
  getClientDashboard as fetchClientDashboard,
  getClientProjects,
  getClientMeetings,
} from "./clientApiService";

/**
 * Get client dashboard data from backend API
 * Returns dashboard statistics, projects, and meetings
 */
export async function getClientDashboard(role = "client") {
  try {
    const dashboardData = await fetchClientDashboard();

    // Extract data from backend response
    const { data = {} } = dashboardData;
    const { client = {}, statistics = {}, projects = [], upcoming_meetings = [] } = data;

    // Map statistics to stat cards
    const stats = [
      {
        id: 1,
        title: "Projects",
        value: statistics.projects || 0,
        color: "bg-cyan-600",
      },
      {
        id: 2,
        title: "Progress",
        value: `${statistics.progress || 0}%`,
        color: "bg-blue-600",
      },
      {
        id: 3,
        title: "Meetings",
        value: statistics.meetings || 0,
        color: "bg-violet-600",
      },
      {
        id: 4,
        title: "Tasks",
        value: statistics.tasks || 0,
        color: "bg-green-600",
      },
    ];

    // Map projects with additional fields for frontend
    const mappedProjects = projects.map((p) => ({
      ...p,
      deadline: p.end_date || p.deadline || "TBD",
    }));

    return {
      stats,
      projects: mappedProjects,
      meetings: upcoming_meetings,
      client,
      clientId: client.id,
      statistics,
    };
  } catch (error) {
    console.error("Error loading client dashboard:", error);
    // Return default empty structure on error
    return {
      stats: [
        { id: 1, title: "Projects", value: 0, color: "bg-cyan-600" },
        { id: 2, title: "Progress", value: "0%", color: "bg-blue-600" },
        { id: 3, title: "Meetings", value: 0, color: "bg-violet-600" },
        { id: 4, title: "Tasks", value: 0, color: "bg-green-600" },
      ],
      projects: [],
      meetings: [],
      client: {},
      clientId: null,
      statistics: {},
    };
  }
}

/**
 * Get all client projects from backend API
 */
export async function getClientProjectsList() {
  try {
    const projects = await getClientProjects();
    return projects || [];
  } catch (error) {
    console.error("Error loading client projects:", error);
    return [];
  }
}

/**
 * Get all client meetings from backend API
 */
export async function getClientMeetingsList() {
  try {
    const meetings = await getClientMeetings();
    return meetings || [];
  } catch (error) {
    console.error("Error loading client meetings:", error);
    return [];
  }
}

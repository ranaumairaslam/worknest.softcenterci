import {
  getClientDashboard as fetchClientDashboard,
  getClientProjects,
  getClientMeetings,
} from "./clientApiService";

/**
 * Get client dashboard data
 */
export async function getClientDashboard(role = "client") {
  try {
    // Dashboard API
    const dashboardData = await fetchClientDashboard();

    const {
      client = {},
      statistics = {},
      projects: dashboardProjects = [],
      upcoming_meetings = [],
    } = dashboardData || {};

    // IMPORTANT:
    // /client/projects is already returning the correct projects.
    // Use it as fallback/source for dashboard projects.
    let projects = dashboardProjects;

    if (!projects || projects.length === 0) {
      try {
        projects = await getClientProjects();
      } catch (projectError) {
        console.error(
          "Could not fetch projects for dashboard:",
          projectError
        );
        projects = [];
      }
    }

    // Meetings fallback
    let meetings = upcoming_meetings;

    if (!meetings || meetings.length === 0) {
      try {
        meetings = await getClientMeetings();
      } catch (meetingError) {
        console.error(
          "Could not fetch meetings for dashboard:",
          meetingError
        );
        meetings = [];
      }
    }

    // Calculate project count from actual projects
    const projectCount =
      projects.length > 0
        ? projects.length
        : Number(statistics.projects || 0);

    // Calculate average progress if project data contains progress
    let progress = Number(statistics.progress || 0);

    if (projects.length > 0) {
      const progressValues = projects
        .map((project) => {
          return Number(
            project.progress ??
              project.progress_percentage ??
              project.completion ??
              0
          );
        })
        .filter((value) => !Number.isNaN(value));

      if (progressValues.length > 0) {
        progress =
          progressValues.reduce((sum, value) => sum + value, 0) /
          progressValues.length;
      }
    }

    const stats = [
      {
        id: 1,
        title: "Projects",
        value: projectCount,
        color: "bg-cyan-600",
      },
      {
        id: 2,
        title: "Progress",
        value: `${Math.round(progress)}%`,
        color: "bg-blue-600",
      },
      {
        id: 3,
        title: "Meetings",
        value:
          statistics.meetings !== undefined
            ? statistics.meetings
            : meetings.length,
        color: "bg-violet-600",
      },
      {
        id: 4,
        title: "Tasks",
        value: statistics.tasks || 0,
        color: "bg-green-600",
      },
    ];

    const mappedProjects = projects.map((project) => ({
      ...project,
      deadline:
        project.end_date ||
        project.deadline ||
        "TBD",
    }));

    return {
      stats,
      projects: mappedProjects,
      meetings,
      client,
      clientId: client.id,
      statistics,
    };
  } catch (error) {
    console.error("Error loading client dashboard:", error);

    return {
      stats: [
        {
          id: 1,
          title: "Projects",
          value: 0,
          color: "bg-cyan-600",
        },
        {
          id: 2,
          title: "Progress",
          value: "0%",
          color: "bg-blue-600",
        },
        {
          id: 3,
          title: "Meetings",
          value: 0,
          color: "bg-violet-600",
        },
        {
          id: 4,
          title: "Tasks",
          value: 0,
          color: "bg-green-600",
        },
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
 * Get all client projects
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
 * Get all client meetings
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
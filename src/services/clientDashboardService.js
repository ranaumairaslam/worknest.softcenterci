import { getCurrentUser } from "./authContext";
import { getAllProjects } from "./projectService";
import { getAllMeetings } from "./meetingService";
import { getTasksByProject } from "./taskService";
import { filterMeetings } from "../utils/roleFilter";

export async function getClientDashboard(role = "client") {
  const user = getCurrentUser(role);
  const clientId = user.clientId;

  const [projects, meetings] = await Promise.all([
    getAllProjects(role),
    getAllMeetings(role),
  ]);

  const filteredMeetings = filterMeetings(meetings, { role, user });

  const taskGroups = await Promise.all(
    projects.map((p) => getTasksByProject(p.id, role))
  );
  const allTasks = taskGroups.flat();

  const avgProgress =
    projects.length === 0
      ? 0
      : Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length);

  const stats = [
    { id: 1, title: "Projects", value: projects.length, color: "bg-cyan-600" },
    { id: 2, title: "Progress", value: `${avgProgress}%`, color: "bg-blue-600" },
    { id: 3, title: "Meetings", value: filteredMeetings.length, color: "bg-violet-600" },
    { id: 4, title: "Tasks", value: allTasks.length, color: "bg-green-600" },
  ];

  const mappedProjects = projects.map((p) => ({
    ...p,
    deadline: p.dueDate || p.deadline || "TBD",
  }));

  return { stats, projects: mappedProjects, meetings: filteredMeetings, clientId };
}

export async function getClientProjects(role = "client") {
  const { projects } = await getClientDashboard(role);
  return projects;
}

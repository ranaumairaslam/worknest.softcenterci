import { useEffect, useState } from "react";
import { getMembers, getProjects, getProgress, getTasks } from "../services/teamLeaderService";

const statusTitle = { todo: "Pending", in_progress: "In Progress", under_review: "Under Review", completed: "Completed" };

function buildTimeline(project) {
  return [
    { id: "start", label: "Start", date: project.startDate || "Not set", state: "done" },
    { id: "delivery", label: "Delivery", date: project.endDate || "Not set", state: "current" },
  ];
}

function buildKanban(tasks) {
  const columns = [
    ["todo", "To Do"],
    ["in_progress", "In Progress"],
    ["under_review", "Under Review"],
    ["completed", "Completed"],
  ];
  return { columns: columns.map(([key, title]) => ({ key, title, count: tasks.filter((task) => task.status === key).length, cards: tasks.filter((task) => task.status === key).map((task) => task.name) })) };
}

const emptyProjectData = {
  summary: {
    id: "empty-project",
    name: "No project assigned",
    status: "Active",
    description: "No project data available yet.",
    startDate: "—",
    endDate: "—",
    progress: 0,
    tasksCompleted: 0,
    tasksTotal: 0,
    daysRemaining: 0,
  },
  stats: [],
  timeline: [],
  team: [],
  tasks: [],
  kanban: { columns: [] },
};

export function useProjectOversightData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [data, setData] = useState(emptyProjectData);
  const [error, setError] = useState(null);

  // Load the project list once, pick the first one as default.
  useEffect(() => {
    let isMounted = true;

    getProjects()
      .then((list) => {
        if (isMounted) {
          setProjects(list);
          setSelectedProjectId(list[0]?.id ?? null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Re-fetch everything whenever the selected project changes.
  // No setState is called synchronously here — only inside the
  // resolved promise callback, which the React Compiler allows.
  useEffect(() => {
    if (!selectedProjectId) return;
    let isMounted = true;

    Promise.all([getProjects(), getTasks({ projectId: selectedProjectId }), getMembers(), getProgress()])
      .then(([projectList, tasks, members, progress]) => {
        if (isMounted) {
          const project = projectList.find((item) => String(item.id) === String(selectedProjectId)) || projectList[0];
          const completed = tasks.filter((task) => task.status === "completed").length;
          const summary = {
            id: project.id,
            name: project.name,
            status: project.status || "Active",
            description: "Assigned team project",
            startDate: project.startDate,
            endDate: project.endDate,
            daysRemaining: "Live",
            progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
            tasksCompleted: completed,
            tasksTotal: tasks.length,
          };
          const team = members.map((member) => ({
            id: member.id,
            name: member.name,
            role: member.role,
            presence: member.status || "active",
            tasks: tasks.filter((task) => String(task.assigneeId) === String(member.id)).length,
            done: tasks.filter((task) => String(task.assigneeId) === String(member.id) && task.status === "completed").length,
            pending: tasks.filter((task) => String(task.assigneeId) === String(member.id) && task.status !== "completed").length,
            progress: 0,
          }));
          const stats = [
            { id: "total", label: "Total Tasks", value: String(progress?.total_tasks ?? tasks.length), trend: "up", trendValue: "Live", icon: "ClipboardList", color: "slate" },
            { id: "completed", label: "Completed", value: String(progress?.completed_tasks ?? completed), trend: "up", trendValue: "Live", icon: "CheckCircle2", color: "emerald" },
            { id: "in-progress", label: "In Progress", value: String(progress?.in_progress_tasks ?? 0), trend: "up", trendValue: "Live", icon: "Clock", color: "blue" },
            { id: "pending", label: "Pending", value: String(progress?.pending_tasks ?? 0), trend: "down", trendValue: "Live", icon: "Hourglass", color: "amber" },
          ];
          setData({ summary, stats, timeline: buildTimeline(project), team, tasks: tasks.map((task) => ({ ...task, status: statusTitle[task.status] || task.status })), kanban: buildKanban(tasks) });
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  // Derived, not stored: loading is true whenever we don't yet have
  // data for the CURRENTLY selected project (e.g. right after
  // switching projects, before the new fetch resolves).
  const loading = !data || data.summary.id !== selectedProjectId;

  return { projects, selectedProjectId, setSelectedProjectId, data, loading, error };
}
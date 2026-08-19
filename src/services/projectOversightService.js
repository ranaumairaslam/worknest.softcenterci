import { post } from "./apiClient.js";

import {
  getTeamLeaderProjects,
  getTeamLeaderMembers,
  getTeamLeaderTasks,
  getTeamLeaderProgress,
  getTeamLeaderReports,
  createTeamLeaderTask,
} from "./teamLeaderService.js";

// ============ HELPERS ============

function getInitials(name = "?") {
  return String(name)
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysBetween(from, to) {
  if (!from || !to) return 0;

  const start = new Date(from);
  const end = new Date(to);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diff = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.max(0, diff);
}

function mapProjectStatus(status) {
  const map = {
    pending: "On Track",
    active: "On Track",
    in_progress: "On Track",
    completed: "Completed",
    on_hold: "At Risk",
    blocked: "At Risk",
  };

  return map[String(status || "").toLowerCase()] || "On Track";
}

function mapTaskStatus(status) {
  const map = {
    todo: "Pending",
    in_progress: "In Progress",
    under_review: "In Progress",
    submitted: "In Progress",
    completed: "Completed",
    done: "Completed",
    blocked: "Pending",
  };

  return map[String(status || "").toLowerCase()] || "Pending";
}

function statusToProgress(status) {
  const map = {
    todo: 0,
    in_progress: 60,
    under_review: 85,
    submitted: 85,
    completed: 100,
    done: 100,
    blocked: 20,
  };

  return map[String(status || "").toLowerCase()] || 0;
}

function mapPriority(priority) {
  if (!priority) return "Medium";

  const value = String(priority).toLowerCase();

  const map = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return map[value] || "Medium";
}

// ============ PROJECTS LIST ============

export async function getProjects() {
  try {
    const projects = await getTeamLeaderProjects();

    return projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status || "active",
    }));
  } catch (err) {
    console.error("getProjects error:", err);
    return [];
  }
}

// ============ PROJECT SUMMARY ============

export async function getProjectSummary(projectId = null) {
  try {
    const projects = await getTeamLeaderProjects();

    const selectedProject =
      projects.find(
        (project) => String(project.id) === String(projectId)
      ) || projects[0];

    if (!selectedProject) {
      return {
        id: projectId,
        name: "Unknown Project",
        status: "On Track",
        description: "",
        startDate: "—",
        endDate: "—",
        daysRemaining: 0,
        progress: 0,
        tasksCompleted: 0,
        tasksTotal: 0,
      };
    }

    const tasks = await getTeamLeaderTasks({
      projectId: selectedProject.id,
    });

    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.status === "completed"
    ).length;

    const progress =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: selectedProject.id,
      name: selectedProject.name,
      status: mapProjectStatus(selectedProject.status),
      description:
        selectedProject.description || "No description available.",
      startDate: formatDate(selectedProject.startDate),
      endDate: formatDate(selectedProject.dueDate),
      daysRemaining: daysBetween(
        new Date(),
        selectedProject.dueDate
      ),
      progress,
      tasksCompleted: completed,
      tasksTotal: total,
    };
  } catch (err) {
    console.error("getProjectSummary error:", err);

    return {
      id: projectId,
      name: "Error loading",
      status: "On Track",
      description: "",
      startDate: "—",
      endDate: "—",
      daysRemaining: 0,
      progress: 0,
      tasksCompleted: 0,
      tasksTotal: 0,
    };
  }
}

// ============ STATS ============

export async function getStats() {
  try {
    const progress = await getTeamLeaderProgress();

    return progress.map((item) => {
      const iconMap = {
        "total-tasks": "ClipboardList",
        completed: "CheckCircle2",
        "in-progress": "Clock",
        pending: "Hourglass",
        blocked: "AlertCircle",
      };

      return {
        id: item.id,
        label: item.label,
        value: item.value,
        icon: iconMap[item.id] || "ClipboardList",
        color: item.color || "slate",
        note: item.note || "",
      };
    });
  } catch (err) {
    console.error("getStats error:", err);

    return [];
  }
}

// ============ TIMELINE ============

export async function getTimeline(projectId = null) {
  try {
    const project = await getProjectSummary(projectId);

    return [
      {
        id: "kickoff",
        label: "Kickoff",
        date: project.startDate || "Today",
        state: "done",
      },
      {
        id: "execution",
        label: "Execution",
        date: "Current",
        state: "current",
      },
      {
        id: "review",
        label: "Review",
        date: project.endDate || "Review",
        state: "upcoming",
      },
      {
        id: "delivery",
        label: "Delivery",
        date: project.endDate || "Delivery",
        state: "upcoming",
      },
    ];
  } catch (err) {
    console.error("getTimeline error:", err);

    return [];
  }
}

// ============ TEAM PERFORMANCE ============

export async function getTeamPerformance(projectId = null) {
  try {
    const [members, tasks] = await Promise.all([
      getTeamLeaderMembers(),
      getTeamLeaderTasks(projectId ? { projectId } : {}),
    ]);

    return members.map((member) => {
      const memberTasks = tasks.filter(
        (task) =>
          String(task.assigneeId) === String(member.id) ||
          String(task.assignee) === String(member.name)
      );

      const completed = memberTasks.filter(
        (task) => task.status === "completed"
      ).length;

      const pending = memberTasks.length - completed;

      const progress =
        memberTasks.length > 0
          ? Math.round((completed / memberTasks.length) * 100)
          : 0;

      return {
        id: member.id,
        name: member.name,
        role: member.role || "Team Member",
        presence:
          member.status === "active" ? "online" : "offline",
        tasks: memberTasks.length,
        done: completed,
        pending,
        progress,
        avatar: member.avatar || getInitials(member.name),
      };
    });
  } catch (err) {
    console.error("getTeamPerformance error:", err);

    return [];
  }
}

// ============ TASK OVERVIEW ============

export async function getTaskOverview(projectId = null) {
  try {
    const tasks = await getTeamLeaderTasks(
      projectId ? { projectId } : {}
    );

    return tasks.map((task) => ({
      id: `TASK-${task.id}`,
      rawId: task.id,
      name: task.title,
      title: task.title,
      priority: mapPriority(task.priority),
      status: mapTaskStatus(task.status),
      assignee: getInitials(task.assignee),
      assigneeName: task.assignee || "Unassigned",
      assigneeId: task.assigneeId,
      dueDate: formatDate(task.dueDate),
      progress:
        task.progress ?? statusToProgress(task.status),
      category: task.projectName || "General",
      projectId: task.projectId,
      raw: task,
    }));
  } catch (err) {
    console.error("getTaskOverview error:", err);

    return [];
  }
}

// ============ KANBAN PREVIEW ============

export async function getKanbanPreview(projectId = null) {
  try {
    const tasks = await getTeamLeaderTasks(
      projectId ? { projectId } : {}
    );

    const columns = {
      todo: {
        key: "todo",
        title: "To Do",
        cards: [],
      },

      in_progress: {
        key: "in_progress",
        title: "In Progress",
        cards: [],
      },

      review: {
        key: "review",
        title: "Review",
        cards: [],
      },

      completed: {
        key: "completed",
        title: "Completed",
        cards: [],
      },

      blocked: {
        key: "blocked",
        title: "Blocked",
        cards: [],
      },
    };

    tasks.forEach((task) => {
      let column = "todo";

      switch (task.status) {
        case "in_progress":
          column = "in_progress";
          break;

        case "under_review":
          column = "review";
          break;

        case "completed":
          column = "completed";
          break;

        case "blocked":
          column = "blocked";
          break;

        default:
          column = "todo";
      }

      columns[column].cards.push({
        id: task.id,
        title: task.title,
        priority: task.priority,
        assignee: task.assignee,
        dueDate: formatDate(task.dueDate),
        progress: task.progress,
      });
    });

    return {
      columns: Object.values(columns).map((column) => ({
        ...column,
        count: column.cards.length,
      })),
    };
  } catch (err) {
    console.error("getKanbanPreview error:", err);

    return {
      columns: [],
    };
  }
}

// ============ CREATE TASK ============

const PRIORITY_TO_BACKEND = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Urgent: "urgent",
};

export async function createTask(payload) {
  try {
    const body = {
      title: payload.name || payload.title,
      description: payload.description || "",
      projectId: Number(payload.projectId),
      assigneeId: payload.assigneeId
        ? Number(payload.assigneeId)
        : null,
      dueDate:
        payload.dueDate && payload.dueDate !== "TBD"
          ? payload.dueDate
          : null,
      priority:
        PRIORITY_TO_BACKEND[payload.priority] || "medium",
    };

    console.log("📤 Creating task:", body);

    const response = await createTeamLeaderTask(body);

    const task = response?.data;

    if (!task) {
      throw new Error("No task data returned from server");
    }

    return {
      id: `TASK-${task.id}`,
      rawId: task.id,
      name: task.title,
      title: task.title,
      priority: mapPriority(task.priority || body.priority),
      status: mapTaskStatus(task.status || "todo"),
      assignee: getInitials(
        task.assignee_name || payload.assigneeName || "?"
      ),
      assigneeName:
        task.assignee_name ||
        payload.assigneeName ||
        "Unassigned",
      assigneeId:
        task.assignee_id ?? payload.assigneeId ?? null,
      dueDate: formatDate(
        task.due_date || payload.dueDate
      ),
      progress: statusToProgress(task.status || "todo"),
      category: task.project_name || "New",
      projectId:
        task.project_id ?? payload.projectId ?? null,
      raw: task,
    };
  } catch (err) {
    console.error("createTask error:", err);
    throw err;
  }
}

// ============ REPORT SUMMARY ============

export async function getTeamLeaderReportSummary() {
  try {
    return await getTeamLeaderReports();
  } catch (err) {
    console.error(
      "getTeamLeaderReportSummary error:",
      err
    );

    return {
      team: null,
      summary: {},
    };
  }
}
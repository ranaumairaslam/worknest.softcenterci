import {
  getTeamLeaderDashboard,
  getTeamLeaderProjects,
  getTeamLeaderMembers,
  getTeamLeaderTasks,
} from "./teamLeaderService.js";

import {
  updateTask,
} from "./taskService.js";

import {
  getActor,
} from "./authContext.js";

import {
  computeLiveStats,
} from "../utils/projectStats.js";


// =====================================================
// STATUS MAP
// =====================================================

const STATUS_MAP = {
  Pending: "todo",
  pending: "todo",

  Todo: "todo",
  todo: "todo",

  "In Progress": "in_progress",
  in_progress: "in_progress",

  Review: "under_review",
  "Under Review": "under_review",
  under_review: "under_review",

  Completed: "completed",
  completed: "completed",

  Rejected: "in_progress",
  rejected: "in_progress",
};


// =====================================================
// PRIORITY MAP
// =====================================================

const PRIORITY_MAP = {
  low: "Low",
  Low: "Low",

  medium: "Medium",
  Medium: "Medium",

  high: "High",
  High: "High",

  urgent: "Urgent",
  Urgent: "Urgent",
};


// =====================================================
// NORMALIZE PROJECT
// =====================================================

function normalizeProject(project) {
  if (!project) {
    return null;
  }

  return {
    ...project,

    id:
      project.id ??
      project.projectId ??
      project.project_id,

    name:
      project.name ??
      project.projectName ??
      project.project_name ??
      "Unnamed Project",

    description:
      project.description ?? "",

    teamId:
      project.teamId ??
      project.team_id ??
      project.team_id_fk ??
      null,

    memberIds:
      project.memberIds ??
      project.member_ids ??
      project.members_ids ??
      [],

    members:
      project.members ??
      project.members_count ??
      0,

    leader:
      project.leader ??
      project.leaderName ??
      project.TeamLeaderName ??
      project.project_leader_name ??
      "Unassigned",

    leaderId:
      project.leaderId ??
      project.leader_id ??
      project.teamLeaderId ??
      project.project_leader_id ??
      null,

    status:
      project.status ??
      project.ProjectStatus ??
      "Pending",

    priority:
      PRIORITY_MAP[
        project.priority ??
        project.ProjectPriority ??
        "medium"
      ] ?? "Medium",

    dueDate:
      project.dueDate ??
      project.due_date ??
      project.date ??
      null,

    progress:
      Number(project.progress ?? 0),
  };
}


// =====================================================
// NORMALIZE TASK
// =====================================================

function mapTaskForLeader(task) {
  if (!task) {
    return null;
  }

  const assigneeName =
    task.assigneeName ??
    task.assignee_name ??
    (
      typeof task.assignee === "string"
        ? task.assignee
        : task.assignee?.name
    ) ??
    "Unassigned";

  const assigneeId =
    task.assigneeId ??
    task.assignee_id ??
    (
      typeof task.assignee === "object"
        ? task.assignee?.id
        : null
    ) ??
    null;

  const title =
    task.title ??
    task.name ??
    task.TaskName ??
    "Untitled Task";

  const rawStatus =
    task.status ??
    task.TaskStatus ??
    "Pending";

  const rawPriority =
    task.priority ??
    "Medium";

  const initials =
    assigneeName !== "Unassigned"
      ? assigneeName
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  return {
    ...task,

    id: task.id,

    title,

    name: title,

    description:
      task.description ?? "",

    status:
      STATUS_MAP[rawStatus] ??
      "todo",

    priority:
      PRIORITY_MAP[rawPriority] ??
      rawPriority,

    assignee: {
      id: assigneeId,
      name: assigneeName,
      avatar: initials,
    },

    assigneeId,

    assigneeName,

    dueDate:
      task.dueDate ??
      task.due_date ??
      null,

    progress:
      Number(task.progress ?? 0),

    projectId:
      task.projectId ??
      task.project_id ??
      null,
  };
}


// =====================================================
// GET PROJECTS
// =====================================================

export async function getProjects() {
  try {
    console.log(
      "📡 PROJECT LEADER: Loading projects..."
    );

    const result =
      await getTeamLeaderProjects();

    console.log(
      "📁 TEAM LEADER PROJECTS RESPONSE:",
      result
    );

    const projects =
      Array.isArray(result)
        ? result
        : [];

    const normalized =
      projects
        .map(normalizeProject)
        .filter(Boolean);

    console.log(
      "✅ PROJECTS NORMALIZED:",
      normalized
    );

    return normalized;
  } catch (error) {
    console.error(
      "❌ PROJECT LEADER PROJECTS ERROR:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET PROJECT TASKS
// =====================================================

export async function getProjectTasks(
  projectId
) {
  try {
    console.log(
      "📡 Loading tasks for project:",
      projectId
    );

    const result =
      await getTeamLeaderTasks({
        projectId,
      });

    console.log(
      "📦 TEAM LEADER TASKS RESPONSE:",
      result
    );

    const tasks =
      Array.isArray(result)
        ? result
        : [];

    const normalized =
      tasks
        .map(mapTaskForLeader)
        .filter(Boolean);

    console.log(
      "✅ TASKS FOR PROJECT:",
      projectId,
      normalized
    );

    return normalized;
  } catch (error) {
    console.error(
      "❌ PROJECT TASKS ERROR:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET TEAM MEMBERS
// =====================================================

export async function getTeamMembers(
  projectId
) {
  try {
    console.log(
      "👥 PROJECT LEADER: Loading team members..."
    );

    console.log(
      "👥 PROJECT ID:",
      projectId
    );

    /*
     * IMPORTANT:
     *
     * Team Leader backend already has:
     *
     * GET /team-leader/members
     *
     * Ye current logged-in Team Leader ki
     * team ke members return karta hai.
     */

    const result =
      await getTeamLeaderMembers();

    console.log(
      "👥 TEAM LEADER MEMBERS RESPONSE:",
      result
    );

    const members =
      Array.isArray(result)
        ? result
        : [];

    const normalized =
      members
        .map((member) => {
          const name =
            member.name ??
            member.full_name ??
            member.EmployeeName ??
            member.employee_name ??
            member.employeeName ??
            "Unknown Member";

          const id =
            member.id ??
            member.employeeId ??
            member.employee_id;

          if (
            id === null ||
            id === undefined ||
            id === ""
          ) {
            return null;
          }

          return {
            id,

            name,

            avatar:
              name
                .split(" ")
                .map(
                  (word) => word[0]
                )
                .join("")
                .slice(0, 2)
                .toUpperCase(),
          };
        })
        .filter(Boolean);

    console.log(
      "✅ NORMALIZED TEAM MEMBERS:",
      normalized
    );

    return normalized;
  } catch (error) {
    console.error(
      "❌ TEAM MEMBERS ERROR:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET TEAM PROGRESS STATS
// =====================================================

export async function getTeamProgressStats(
  projectId
) {
  try {
    const [
      projects,
      tasks,
    ] = await Promise.all([
      getProjects(),
      getProjectTasks(projectId),
    ]);

    const project =
      projects.find(
        (item) =>
          String(item.id) ===
          String(projectId)
      );

    const totalTasks =
      tasks.length;

    const completedTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "completed"
      ).length;

    const inProgressTasks =
      tasks.filter(
        (task) =>
          task.status ===
          "in_progress"
      ).length;

    const overdueTasks =
      tasks.filter((task) => {
        if (!task.dueDate) {
          return false;
        }

        const due =
          new Date(task.dueDate);

        return (
          due < new Date() &&
          task.status !==
            "completed"
        );
      }).length;

    const completion =
      totalTasks > 0
        ? Math.round(
            (completedTasks /
              totalTasks) *
              100
          )
        : 0;

    const baseStats = [
      {
        id: "team-members",
        label: "Team Members",
        value: String(
          project?.members ??
          0
        ),
        note: "Active",
      },

      {
        id: "in-progress",
        label: "Tasks in Progress",
        value: String(
          inProgressTasks
        ),
        note: "This project",
      },

      {
        id: "overdue",
        label: "Overdue Tasks",
        value: String(
          overdueTasks
        ),
        note: "Needs attention",
      },

      {
        id: "completion",
        label: "Completion",
        value: `${completion}%`,
        note: "Live",
      },
    ];

    try {
      return computeLiveStats(
        baseStats,
        tasks
      );
    } catch {
      return {
        summary: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          overdueTasks,
          completion,
        },
        stats: baseStats,
      };
    }
  } catch (error) {
    console.error(
      "❌ TEAM PROGRESS ERROR:",
      error
    );

    return {
      summary: {},
      stats: [],
    };
  }
}


// =====================================================
// PENDING DELIVERABLES
// =====================================================

export async function getPendingDeliverables(
  projectId
) {
  const tasks =
    await getProjectTasks(
      projectId
    );

  return tasks
    .filter(
      (task) =>
        task.status ===
        "under_review"
    )
    .map((task) => ({
      id: `d-${task.id}`,

      taskId: task.id,

      member: {
        name:
          task.assigneeName ??
          "Unassigned",

        avatar:
          task.assignee?.avatar ??
          "U",
      },

      fileLabel:
        "Attached files",

      linkLabel:
        "View task",

      url:
        `/project/tasks?taskId=${task.id}`,
    }));
}


// =====================================================
// APPROVE DELIVERABLE
// =====================================================

export async function approveDeliverable(
  id,
  comment,
  role
) {
  const taskId =
    String(id).replace(
      /^d-/,
      ""
    );

  await updateTask(
    taskId,
    {
      status: "Completed",
      progress: 100,
    },
    getActor(role)
  );

  return {
    id,
    status: "approved",
    comment,
  };
}


// =====================================================
// REJECT DELIVERABLE
// =====================================================

export async function rejectDeliverable(
  id,
  comment,
  role
) {
  const taskId =
    String(id).replace(
      /^d-/,
      ""
    );

  await updateTask(
    taskId,
    {
      status: "In Progress",
      progress: 50,
    },
    getActor(role)
  );

  return {
    id,
    status: "rejected",
    comment,
  };
}


// =====================================================
// REASSIGN TASK
// =====================================================

export async function reassignTask(
  taskId,
  memberId,
  role
) {
  try {
    console.log(
      "🔄 Reassigning task:",
      taskId,
      "to member:",
      memberId
    );

    const member =
      await getEmployeeById(
        memberId
      );

    if (!member) {
      throw new Error(
        "Team member not found."
      );
    }

    const memberName =
      member.name ??
      member.full_name ??
      member.EmployeeName ??
      member.employee_name ??
      "Unknown Member";

    return await updateTask(
      taskId,
      {
        assignee:
          memberName,

        assigneeId:
          member.id,
      },
      getActor(role)
    );
  } catch (error) {
    console.error(
      "❌ REASSIGN ERROR:",
      error
    );

    throw error;
  }
}


// =====================================================
// CREATE PROJECT
// =====================================================

export async function createProject(
  project,
  role
) {
  return createCanonicalProject(
    project
  );
}


// =====================================================
// LEADER DASHBOARD
// =====================================================

export async function getLeaderDashboardData() {
  return getTeamLeaderDashboard();
}


// =====================================================
// LEADER TEAM TASKS
// =====================================================

export async function getLeaderTeamTasks(
  params = {}
) {
  try {
    const tasks =
      await getTeamLeaderTasks(
        params
      );

    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks
      .map(mapTaskForLeader)
      .filter(Boolean);
  } catch (error) {
    console.error(
      "❌ LEADER TEAM TASKS ERROR:",
      error
    );

    throw error;
  }
}
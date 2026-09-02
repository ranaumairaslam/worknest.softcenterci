import { useEffect, useState, useCallback } from "react";
import {
  approveTask,
  assignTask,
  deleteTask,
  editTask,
  getDashboard,
  getMembers,
  getProjects,
  getProgress,
  getSubmittedTasks,
  getTasks,
  returnTaskForRevision,
} from "../services/teamLeaderService";
import { createProject } from "../services/projectLeaderService";

const initials = (name) =>
  name
    ? name.split(" ").filter(Boolean).map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

// ✅ Normalize raw API task (snake_case) → UI shape (camelCase)
const formatTask = (task) => {
  const assigneeId = task.assignee_id ?? task.assigneeId ?? null;
  const assigneeName = task.assignee_name ?? task.assigneeName ?? null;

  return {
    ...task,
    assigneeId,
    assigneeName,
    dueDate: task.due_date ?? task.dueDate ?? null,
    projectId: task.project_id ?? task.projectId ?? null,
    assignee: assigneeId
      ? { id: assigneeId, name: assigneeName, avatar: initials(assigneeName) }
      : null,
  };
};

export function useProjectLeaderData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [stats, setStats] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- initial load ---------------- */
  useEffect(() => {
    let isMounted = true;

    Promise.all([getDashboard(), getProjects(), getMembers(), getProgress()])
      .then(([dashboard, projectList, members, progress]) => {
        if (!isMounted) return;

        setProjects(projectList || []);
        setTeamMembers(
          (members || []).map((m) => ({
            id: m.id,
            name: m.name,
            avatar: initials(m.name),
          }))
        );
        setStats(progress || dashboard?.stats || null);
        setSelectedProjectId(projectList?.[0]?.id ?? null);
      })
      .catch((err) => {
        console.error("Failed to load project leader data:", err);
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* ---------------- reusable task loader ---------------- */
  const loadTasks = useCallback(async () => {
    if (!selectedProjectId) return;

    const [taskList, submitted] = await Promise.all([
      getTasks({ projectId: selectedProjectId }),
      getSubmittedTasks(),
    ]);

    setTasks((taskList || []).map(formatTask));

    setDeliverables(
      (submitted || []).map((raw) => {
        const task = formatTask(raw);
        return {
          id: task.id,
          taskId: task.id,
          task,
          member: {
            name: task.assigneeName || "Unknown",
            avatar: initials(task.assigneeName),
          },
          linkLabel: "View task",
        };
      })
    );
  }, [selectedProjectId]);

  useEffect(() => {
    let isMounted = true;

    loadTasks().catch((err) => {
      console.error("Failed to load tasks:", err);
      if (isMounted) setError(err);
    });

    return () => {
      isMounted = false;
    };
  }, [loadTasks]);

  /* ---------------- mutations ----------------
     Pattern: call API first → update state → re-throw
     so modals stay open and show the error on failure.
  ------------------------------------------------ */

  const handleApprove = useCallback(async (item) => {
    try {
      await approveTask(item.taskId);
      setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
      setTasks((prev) =>
        prev.map((t) => (t.id === item.taskId ? { ...t, status: "done" } : t))
      );
    } catch (err) {
      console.error("Failed to approve task:", err);
      setError(err);
      throw err;
    }
  }, []);

  const handleReject = useCallback(async (item, comment) => {
    try {
      await returnTaskForRevision(item.taskId, comment);
      setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
      setTasks((prev) =>
        prev.map((t) => (t.id === item.taskId ? { ...t, status: "todo" } : t))
      );
    } catch (err) {
      console.error("Failed to return task:", err);
      setError(err);
      throw err;
    }
  }, []);

  const handleReassign = useCallback(
    async (taskId, memberId) => {
      try {
        await assignTask(taskId, memberId);
        const member = teamMembers.find((m) => String(m.id) === String(memberId));
        setTasks((prev) =>
          prev.map((t) =>
            String(t.id) === String(taskId)
              ? {
                  ...t,
                  assignee: member || null,
                  assigneeId: member?.id ?? null,
                  assigneeName: member?.name ?? null,
                }
              : t
          )
        );
      } catch (err) {
        console.error("Failed to reassign task:", err);
        setError(err);
        throw err;
      }
    },
    [teamMembers]
  );

const handleUpdateTask = useCallback(
  async (taskId, updates) => {
    try {
      await editTask(taskId, updates);

      // Reload from local server after save
      const list = await getTasks({ projectId: selectedProjectId });
      setTasks((list || []).map((t) => ({
        ...t,
        assigneeId: t.assignee_id ?? t.assigneeId ?? null,
        assigneeName: t.assignee_name ?? t.assigneeName ?? "",
        dueDate: t.due_date ?? t.dueDate ?? null,
        assignee: {
          id: t.assignee_id ?? t.assigneeId ?? null,
          name: t.assignee_name ?? t.assigneeName ?? "",
        },
      })));
    } catch (err) {
      console.error("Edit failed:", err);
      throw err;
    }
  },
  [selectedProjectId]
);
  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => String(t.id) !== String(taskId)));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(err);
      throw err;
    }
  }, []);

  const handleCreateProject = useCallback(async (projectInput) => {
    try {
      const saved = await createProject(projectInput);
      setProjects((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(err);
      return null;
    }
  }, []);

  return {
    projects,
    tasks,
    deliverables,
    stats,
    teamMembers,
    selectedProjectId,
    setSelectedProjectId,
    loading,
    error,
    refreshTasks: loadTasks,
    handleApprove,
    handleReject,
    handleReassign,
    handleUpdateTask,
    handleDeleteTask,
    handleCreateProject,
  };
}
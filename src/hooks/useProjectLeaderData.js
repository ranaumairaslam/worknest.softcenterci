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

export function useProjectLeaderData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [stats, setStats] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getDashboard(),
      getProjects(),
      getMembers(),
      getProgress(),
    ])
      .then(([dashboard, projectList, members, progress]) => {
        if (!isMounted) return;

        setProjects(projectList || []);

        setTeamMembers(
          (members || []).map((member) => ({
            id: member.id,
            name: member.name,
            avatar: member.name
              ? member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "?",
          }))
        );

        setStats(progress || dashboard?.stats || null);

        setSelectedProjectId(
          projectList?.[0]?.id ?? null
        );
      })
      .catch((err) => {
        console.error(
          "Failed to load project leader data:",
          err
        );

        if (isMounted) {
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;

    let isMounted = true;

    Promise.all([
      getTasks({
        projectId: selectedProjectId,
      }),
      getSubmittedTasks(),
    ])
      .then(([taskList, submitted]) => {
        if (!isMounted) return;

        const formattedTasks = (taskList || []).map(
          (task) => ({
            ...task,

            assignee: {
              id: task.assigneeId,
              name: task.assigneeName,
              avatar: task.assignee,
            },
          })
        );

        setTasks(formattedTasks);

        const formattedDeliverables = (
          submitted || []
        ).map((task) => ({
          id: task.id,
          taskId: task.id,

          task: {
            ...task,

            assignee: {
              id: task.assigneeId,
              name: task.assigneeName,
              avatar: task.assignee,
            },
          },

          member: {
            name:
              task.assigneeName ||
              "Unknown",
            avatar:
              task.assignee || "?",
          },

          linkLabel: "View task",
        }));

        setDeliverables(
          formattedDeliverables
        );
      })
      .catch((err) => {
        console.error(
          "Failed to load tasks:",
          err
        );

        if (isMounted) {
          setError(err);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  const handleApprove = useCallback(
    async (item) => {
      setDeliverables((prev) =>
        prev.filter(
          (d) => d.id !== item.id
        )
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === item.taskId
            ? {
                ...task,
                status: "completed",
              }
            : task
        )
      );

      try {
        await approveTask(item.taskId);
      } catch (err) {
        console.error(
          "Failed to approve task:",
          err
        );

        setError(err);
      }
    },
    []
  );

  const handleReject = useCallback(
    async (item, comment) => {
      setDeliverables((prev) =>
        prev.filter(
          (d) => d.id !== item.id
        )
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.id === item.taskId
            ? {
                ...task,
                status: "in_progress",
              }
            : task
        )
      );

      try {
        await returnTaskForRevision(
          item.taskId,
          comment
        );
      } catch (err) {
        console.error(
          "Failed to return task:",
          err
        );

        setError(err);
      }
    },
    []
  );

  const handleReassign = useCallback(
    async (taskId, memberId) => {
      const member = teamMembers.find(
        (m) =>
          String(m.id) ===
          String(memberId)
      );

      setTasks((prev) =>
        prev.map((task) =>
          String(task.id) ===
          String(taskId)
            ? {
                ...task,
                assignee: member,
                assigneeId:
                  member?.id,
                assigneeName:
                  member?.name,
              }
            : task
        )
      );

      try {
        await assignTask(
          taskId,
          memberId
        );
      } catch (err) {
        console.error(
          "Failed to reassign task:",
          err
        );

        setError(err);
      }
    },
    [teamMembers]
  );

  const handleUpdateTask = useCallback(
  async (taskId, updates) => {
    console.log("🔄 Updating task:", taskId);
    console.log("📦 Updates:", updates);

    setTasks((prev) =>
      prev.map((task) =>
        String(task.id) === String(taskId)
          ? {
              ...task,
              ...updates,
              assigneeId:
                updates.assigneeId ??
                task.assigneeId,
            }
          : task
      )
    );

    try {
      await editTask(taskId, updates);

      console.log("✅ Task updated successfully");
    } catch (err) {
      console.error(
        "❌ Failed to update task:",
        err
      );

      setError(err);
    }
  },
  []
);

  const handleDeleteTask = useCallback(
    async (taskId) => {
      setTasks((prev) =>
        prev.filter(
          (task) =>
            String(task.id) !==
            String(taskId)
        )
      );

      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error(
          "Failed to delete task:",
          err
        );

        setError(err);
      }
    },
    []
  );

  const handleCreateProject = useCallback(
    async (projectInput) => {
      try {
        const saved =
          await createProject(
            projectInput
          );

        setProjects((prev) => [
          ...prev,
          saved,
        ]);

        return saved;
      } catch (err) {
        console.error(
          "Failed to create project:",
          err
        );

        setError(err);
        return null;
      }
    },
    []
  );

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
    handleApprove,
    handleReject,
    handleReassign,
    handleUpdateTask,
    handleDeleteTask,
    handleCreateProject,
  };
}
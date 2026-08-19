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

    Promise.all([getDashboard(), getProjects(), getMembers(), getProgress()])
      .then(([dashboard, projectList, members, progress]) => {
        if (isMounted) {
          setProjects(projectList);
          setTeamMembers(members.map((member) => ({
            id: member.id,
            name: member.name,
            avatar: member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          })));
          setStats(progress || dashboard.stats);
          setSelectedProjectId(projectList[0]?.id ?? null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    let isMounted = true;

    Promise.all([getTasks({ projectId: selectedProjectId }), getSubmittedTasks()]).then(([taskList, submitted]) => {
      if (isMounted) {
        setTasks(taskList.map((task) => ({
          ...task,
          assignee: {
            id: task.assigneeId,
            name: task.assigneeName,
            avatar: task.assignee,
          },
        })));
        setDeliverables(submitted.map((task) => ({
          id: task.id,
          taskId: task.id,
          member: { name: task.assigneeName, avatar: task.assignee },
          linkLabel: "View task",
          url: `/project/tasks?taskId=${task.id}`,
        })));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  const handleApprove = useCallback(async (item) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
    setTasks((prev) =>
      prev.map((t) => (t.id === item.taskId ? { ...t, status: "completed" } : t))
    );
    try {
      await approveTask(item.taskId);
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleReject = useCallback(async (item, comment) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
    setTasks((prev) =>
      prev.map((t) => (t.id === item.taskId ? { ...t, status: "in_progress" } : t))
    );
    try {
      await returnTaskForRevision(item.taskId, comment);
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleReassign = useCallback(async (taskId, memberId) => {
    const member = teamMembers.find((m) => String(m.id) === String(memberId));
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: member } : t))
    );
    try {
      await assignTask(taskId, memberId);
    } catch (err) {
      setError(err);
    }
  }, [teamMembers]);

  const handleUpdateTask = useCallback(async (taskId, updates) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)));
    try {
      if (updates.status && updates.status !== "completed") {
        await editTask(taskId, { ...updates, priority: updates.priority });
      } else if (updates.status === "completed") {
        await approveTask(taskId);
      } else {
        await editTask(taskId, updates);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleDeleteTask = useCallback(async (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(taskId);
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleCreateProject = useCallback(async (projectInput) => {
    try {
      const saved = await createProject(projectInput);
      setProjects((prev) => [...prev, saved]);
      return saved;
    } catch (err) {
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
    handleApprove,
    handleReject,
    handleReassign,
    handleUpdateTask,
    handleDeleteTask,
    handleCreateProject,
  };
}
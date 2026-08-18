// src/hooks/useProjectLeaderData.js
import { useEffect, useState, useCallback } from "react";
import {
  getDashboardData,
  getProjectTasks,
  getPendingDeliverables,
  approveDeliverable,
  rejectDeliverable,
  reassignTask,
  updateTaskPriority,
  createProject,
} from "../services/projectLeaderService";

export function useProjectLeaderData() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial load — dashboard gives us projects + members
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const dashboard = await getDashboardData();
        if (!isMounted) return;

        setProjects(dashboard.projects);
        setTeamMembers(dashboard.members);
        setSelectedProjectId(dashboard.projects[0]?.id ?? null);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load tasks + deliverables when project changes
  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      setDeliverables([]);
      return;
    }
    let isMounted = true;

    async function loadProjectData() {
      try {
        const [taskList, deliverableList] = await Promise.all([
          getProjectTasks(selectedProjectId),
          getPendingDeliverables(selectedProjectId),
        ]);
        if (!isMounted) return;
        setTasks(taskList);
        setDeliverables(deliverableList);
      } catch (err) {
        if (isMounted) setError(err);
      }
    }

    loadProjectData();
    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

  // ============ ACTIONS ============

  const handleApprove = useCallback(async (item, comment) => {
    // Optimistic
    setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
    setTasks((prev) =>
      prev.map((t) =>
        t.id === item.taskId ? { ...t, status: "completed" } : t
      )
    );
    try {
      await approveDeliverable(item.id, comment);
    } catch (err) {
      alert("Failed to approve: " + (err.message || "Unknown error"));
      setError(err);
    }
  }, []);

  const handleReject = useCallback(async (item, comment) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
    setTasks((prev) =>
      prev.map((t) =>
        t.id === item.taskId ? { ...t, status: "todo" } : t
      )
    );
    try {
      await rejectDeliverable(item.id, comment);
    } catch (err) {
      alert("Failed to reject: " + (err.message || "Unknown error"));
      setError(err);
    }
  }, []);

  const handleReassign = useCallback(
    async (taskId, memberId) => {
      const member = teamMembers.find(
        (m) => String(m.id) === String(memberId)
      );
      // Optimistic UI
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                assigneeId: memberId,
                assignee: member
                  ? { name: member.name, avatar: member.avatar }
                  : t.assignee,
              }
            : t
        )
      );
      try {
        await reassignTask(taskId, memberId);
      } catch (err) {
        alert("Failed to reassign: " + (err.message || "Unknown error"));
        setError(err);
      }
    },
    [teamMembers]
  );

  const handleUpdateTask = useCallback(async (taskId, updates) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );

    try {
      if (updates.priority) {
        await updateTaskPriority(taskId, updates.priority);
      }
      // Status change via drag-drop → uses approve/reject flow instead
    } catch (err) {
      alert("Failed to update: " + (err.message || "Unknown error"));
      setError(err);
    }
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    // Backend has no delete endpoint for team_leader
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    console.warn("Delete is UI-only — backend has no team-leader delete endpoint");
  }, []);

  const handleCreateProject = useCallback(async (projectInput) => {
    try {
      const saved = await createProject(projectInput);
      setProjects((prev) => [
        ...prev,
        {
          id: saved.id,
          name: saved.name,
          status: saved.status,
          startDate: saved.startDate,
          dueDate: saved.dueDate,
          taskCount: 0,
        },
      ]);
      setSelectedProjectId(saved.id);
      return saved;
    } catch (err) {
      alert("Failed to create project: " + (err.message || "Unknown error"));
      setError(err);
      return null;
    }
  }, []);

  return {
    projects,
    tasks,
    deliverables,
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
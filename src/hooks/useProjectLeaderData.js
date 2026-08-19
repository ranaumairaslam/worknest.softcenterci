import { useEffect, useState, useCallback, useRef } from "react";
import {
  getProjects,
  getProjectTasks,
  getPendingDeliverables,
  approveDeliverable,
  rejectDeliverable,
  getTeamProgressStats,
  getTeamMembers,
  reassignTask,
  createProject,
} from "../services/projectLeaderService";
import { subscribeDataChange } from "../utils/eventBus";
import useRole from "./useRole";

export function useProjectLeaderData() {
  const role = useRole();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [stats, setStats] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks project ids created locally for optimistic UI
  const localProjectIds = useRef(new Set());

  const reloadProjects = useCallback(() => {
    getProjects(role).then((projectList) => {
      setProjects(projectList);
      if (!projectList.find((p) => p.id === selectedProjectId)) {
        setSelectedProjectId(projectList[0]?.id ?? null);
      }
    });
  }, [role, selectedProjectId]);

  useEffect(() => subscribeDataChange(reloadProjects), [reloadProjects]);

  useEffect(() => {
    let isMounted = true;

    getProjects(role)
      .then((projectList) => {
        if (isMounted) {
          setProjects(projectList);
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
  }, [role]);

  useEffect(() => {
    if (!selectedProjectId) return;
    let isMounted = true;

    Promise.all([
      getProjectTasks(selectedProjectId, role),
      getPendingDeliverables(selectedProjectId, role),
      getTeamProgressStats(selectedProjectId, role),
      getTeamMembers(selectedProjectId),
    ]).then(([taskList, deliverableList, statList, members]) => {
      if (isMounted) {
        setTasks(taskList);
        setDeliverables(deliverableList);
        setStats(statList);
        setTeamMembers(members);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId, role]);

  const handleApprove = useCallback(async (item, comment) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
    setTasks((prev) =>
      prev.map((t) => (t.id === item.taskId ? { ...t, status: "completed" } : t))
    );
    try {
      await approveDeliverable(item.id, comment, role);
    } catch (err) {
      setError(err);
    }
  }, [role]);

  const handleReject = useCallback(async (item, comment) => {
    setDeliverables((prev) => prev.filter((d) => d.id !== item.id));
    setTasks((prev) =>
      prev.map((t) => (t.id === item.taskId ? { ...t, status: "in_progress" } : t))
    );
    try {
      await rejectDeliverable(item.id, comment, role);
    } catch (err) {
      setError(err);
    }
  }, [role]);

  const handleReassign = useCallback(async (taskId, memberId) => {
    const member = teamMembers.find((m) => m.id === memberId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assignee: member } : t))
    );
    try {
      await reassignTask(taskId, memberId, role);
    } catch (err) {
      setError(err);
    }
  }, [teamMembers, role]);

  const handleUpdateTask = useCallback((taskId, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  }, [role]);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const handleCreateProject = useCallback(async (projectInput) => {
    try {
      const saved = await createProject(projectInput, role);
      localProjectIds.current.add(saved.id);
      setProjects((prev) => [...prev, saved]);
      setSelectedProjectId(saved.id);
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
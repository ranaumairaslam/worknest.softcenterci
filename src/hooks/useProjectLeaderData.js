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

  // Tracks project ids created locally (not backed by the mock
  // service's hardcoded data), so we know to skip fetching for them
  // and just show an empty board instead.
  const localProjectIds = useRef(new Set());

  useEffect(() => {
    let isMounted = true;

    Promise.all([getProjects(role), getTeamMembers()])
      .then(([projectList, members]) => {
        if (isMounted) {
          setProjects(projectList);
          setTeamMembers(members);
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

    // Newly created (local-only) projects have no mock data behind
    // them — show an empty board instead of falling back to p1's data.
    if (localProjectIds.current.has(selectedProjectId)) {
      setTasks([]);
      setDeliverables([]);
      setStats([
        { id: "team-members", label: "Team Members", value: "0", note: "Active" },
        { id: "in-progress", label: "Tasks in Progress", value: "0", note: "This project" },
        { id: "overdue", label: "Overdue Tasks", value: "0", note: "Needs attention" },
        { id: "completion", label: "Completion", value: "0%", note: "Just created" },
      ]);
      return;
    }

    Promise.all([
      getProjectTasks(selectedProjectId),
      getPendingDeliverables(selectedProjectId),
      getTeamProgressStats(selectedProjectId),
    ]).then(([taskList, deliverableList, statList]) => {
      if (isMounted) {
        setTasks(taskList);
        setDeliverables(deliverableList);
        setStats(statList);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedProjectId]);

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
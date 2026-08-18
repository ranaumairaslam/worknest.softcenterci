// src/hooks/useTeamMemberTasks.js
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getMyTasks,
  getTeamTasks,
  submitTaskWork,
  startTask,
  getAssignedTasksFromCompany,
} from "../services/teamMemberService";

export function useTeamMemberTasks() {
  const [myTasks, setMyTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [viewMode, setViewMode] = useState("personal");
  const [projectFilter, setProjectFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    // ✅ Fetch from BOTH sources and merge
    const [teamMemberTasks, companyTasks, team] = await Promise.all([
      getMyTasks(),                    // From /team-member/tasks/assigned
      getAssignedTasksFromCompany(),   // From /company/tasks?assigneeId=me
      getTeamTasks(),
    ]);

    // ✅ Merge, dedupe by ID (prefer company tasks — more complete data)
    const merged = [...companyTasks];
    teamMemberTasks.forEach((tmTask) => {
      if (!merged.find((t) => String(t.id) === String(tmTask.id))) {
        merged.push(tmTask);
      }
    });

    setMyTasks(merged);
    setTeamTasks(team);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const sourceTasks = viewMode === "personal" ? myTasks : teamTasks;

  const projects = useMemo(
    () => [...new Set(sourceTasks.map((t) => t.project))],
    [sourceTasks]
  );

  const tasks = useMemo(
    () =>
      projectFilter === "All"
        ? sourceTasks
        : sourceTasks.filter((t) => t.project === projectFilter),
    [sourceTasks, projectFilter]
  );

  const submitTask = useCallback(
    async (taskId, payload) => {
      setMyTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "under_review" } : t))
      );
      setTeamTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "under_review" } : t))
      );
      try {
        await submitTaskWork(taskId, payload);
      } catch (err) {
        setError(err);
        loadTasks();
      }
    },
    [loadTasks]
  );

  const startTaskById = useCallback(
    async (taskId) => {
      setMyTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: "in_progress" } : t))
      );
      try {
        await startTask(taskId);
      } catch (err) {
        setError(err);
        loadTasks();
      }
    },
    [loadTasks]
  );

  return {
    tasks,
    projects,
    projectFilter,
    setProjectFilter,
    viewMode,
    setViewMode,
    submitTask,
    startTask: startTaskById,
    refresh: loadTasks,
    loading,
    error,
  };
}
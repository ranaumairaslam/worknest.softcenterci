import { useEffect, useState, useCallback, useMemo } from "react";
import { getMyTasks, getTeamTasks, submitTaskWork } from "../services/teamMemberService";

export function useTeamMemberTasks() {
  const [myTasks, setMyTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [viewMode, setViewMode] = useState("personal"); // "personal" | "team"
  const [projectFilter, setProjectFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getMyTasks(), getTeamTasks()])
      .then(([mine, team]) => {
        if (isMounted) {
          setMyTasks(mine);
          setTeamTasks(team);
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

  const submitTask = useCallback(async (taskId, payload) => {
    // Optimistic update in both lists so the change is reflected
    // no matter which view the user is on.
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
    }
  }, []);

  return {
    tasks,
    projects,
    projectFilter,
    setProjectFilter,
    viewMode,
    setViewMode,
    submitTask,
    loading,
    error,
  };
}
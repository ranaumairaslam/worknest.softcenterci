import { useEffect, useState, useCallback, useMemo } from "react";
import { getMyTasks, getTeamTasks, submitTaskWork } from "../services/teamMemberService";

export function useTeamMemberTasks() {
  const [myTasks, setMyTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [viewMode, setViewMode] = useState("personal"); // "personal" | "team"
  const [projectFilter, setProjectFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
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
    // 1. CAPTURE ORIGINAL STATUS BEFORE OPTIMISTIC UPDATE
    // Yeh zaroori hai kyunki payload me previousStatus nahi aa raha
    const currentTaskInMyList = myTasks.find(t => t.id === taskId);
    const currentTaskInTeamList = teamTasks.find(t => t.id === taskId);
    
    // Fallback to "todo" agar task na mile (edge case)
    const previousStatus = currentTaskInMyList?.status || currentTaskInTeamList?.status || "todo";

    // 2. Optimistic update in both lists
    setMyTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "under_review" } : t))
    );
    setTeamTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "under_review" } : t))
    );

    try {
      await submitTaskWork(taskId, payload);
      
      // Optional: Agar success ho gaya, to backend se fresh data fetch kar sakte ho
      // Par optimistic update usually kaafi hota hai
      
    } catch (err) {
      console.error("Submission failed, reverting status:", err);
      
      // 3. REVERT TO ORIGINAL STATUS (Captured in Step 1)
      setMyTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t))
      );
      setTeamTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: previousStatus } : t))
      );
      
      throw err; // Error upar propagate karega taaki Modal me dikhai de
    }
  }, [myTasks, teamTasks]); // Dependencies add kiye hain taaki latest list access ho sake

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
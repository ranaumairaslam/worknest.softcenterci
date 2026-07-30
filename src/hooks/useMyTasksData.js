import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getMyTasks,
  updateTaskStatus,
  createTask,
  deleteTask,
} from "../services/myTasksService";

const statIcons = {
  total: { label: "Total Tasks", note: "All assigned tasks", icon: "ClipboardList", color: "indigo" },
  completed: { label: "Completed", note: "Tasks completed", icon: "CheckCircle2", color: "emerald" },
  "in-progress": { label: "In Progress", note: "Tasks in progress", icon: "Clock", color: "amber" },
  todo: { label: "To Do", note: "Tasks to do", icon: "CalendarDays", color: "rose" },
};

export function useMyTasksData() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMyTasks()
      .then((data) => {
        if (isMounted) setTasks(data);
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

  // Live stats derived from the actual current task list.
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "To Do").length;

    return [
      { id: "total", value: String(total), ...statIcons.total },
      { id: "completed", value: String(completed), ...statIcons.completed },
      { id: "in-progress", value: String(inProgress), ...statIcons["in-progress"] },
      { id: "todo", value: String(todo), ...statIcons.todo },
    ];
  }, [tasks]);

  const toggleComplete = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === "Completed" ? "To Do" : "Completed";
        updateTaskStatus(taskId, newStatus);
        return { ...t, status: newStatus };
      })
    );
  }, []);

  const addTask = useCallback(async (taskInput) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { ...taskInput, id: tempId };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const saved = await createTask(taskInput);
      setTasks((prev) => prev.map((t) => (t.id === tempId ? saved : t)));
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(err);
    }
  }, []);

  const removeTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    deleteTask(taskId);
  }, []);

  return { stats, tasks, loading, error, toggleComplete, addTask, removeTask };
}
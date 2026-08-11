import { useEffect, useState, useCallback, useMemo } from "react";
import {
  getTasksByAssignee,
  updateTask,
  createTask,
  deleteTask,
} from "../services/taskService";
import { getActor } from "../services/authContext";
import { subscribeDataChange } from "../utils/eventBus";
import useRole from "./useRole";

const statIcons = {
  total: { label: "Total Tasks", note: "All assigned tasks", icon: "ClipboardList", color: "indigo" },
  completed: { label: "Completed", note: "Tasks completed", icon: "CheckCircle2", color: "emerald" },
  "in-progress": { label: "In Progress", note: "Tasks in progress", icon: "Clock", color: "amber" },
  todo: { label: "To Do", note: "Tasks to do", icon: "CalendarDays", color: "rose" },
};

export function useMyTasksData() {
  const role = useRole();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const actor = getActor(role);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const user = actor;
      const data = await getTasksByAssignee(user.employeeId, role);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role, actor.employeeId]);

  useEffect(() => {
    load();
    return subscribeDataChange(load);
  }, [load]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const todo = tasks.filter((t) => t.status === "Pending" || t.status === "To Do").length;

    return [
      { id: "total", value: String(total), ...statIcons.total },
      { id: "completed", value: String(completed), ...statIcons.completed },
      { id: "in-progress", value: String(inProgress), ...statIcons["in-progress"] },
      { id: "todo", value: String(todo), ...statIcons.todo },
    ];
  }, [tasks]);

  const toggleComplete = useCallback(async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    const updated = await updateTask(taskId, { status: newStatus }, actor);
    if (updated) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    }
  }, [tasks, actor]);

  const addTask = useCallback(async (taskInput) => {
    const saved = await createTask(taskInput, actor);
    setTasks((prev) => [saved, ...prev]);
  }, [actor]);

  const removeTask = useCallback(async (taskId) => {
    await deleteTask(taskId, actor);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, [actor]);

  return { stats, tasks, loading, error, toggleComplete, addTask, removeTask, refresh: load };
}

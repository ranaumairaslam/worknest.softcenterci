import { useCallback, useEffect, useState } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStatistics,
} from "../services/taskService";
import { getActor } from "../services/authContext";
import { subscribeDataChange } from "../utils/eventBus";
import useRole from "./useRole";

export function useTasks() {
  const role = useRole();
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    const stats = await getTaskStatistics(role);
    setStatistics(stats);
  }, [role]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [data, stats] = await Promise.all([getAllTasks(role), getTaskStatistics(role)]);
      setTasks(data);
      setStatistics(stats);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
    return subscribeDataChange(load);
  }, [load]);

  const actor = getActor(role);

  const addTask = async (payload) => {
    const task = await createTask(payload, actor);
    setTasks((prev) => [task, ...prev]);
    await loadStats();
    return task;
  };

  const editTask = async (id, updates) => {
    const task = await updateTask(id, updates, actor);
    if (task) {
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      await loadStats();
    }
    return task;
  };

  const removeTask = async (id) => {
    const deleted = await deleteTask(id, actor);
    if (deleted) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      await loadStats();
    }
    return deleted;
  };

  return {
    tasks,
    statistics,
    loading,
    error,
    addTask,
    editTask,
    removeTask,
    refresh: load,
  };
}

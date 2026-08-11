import { useCallback, useEffect, useState } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStatistics,
} from "../services/taskService";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    const stats = await getTaskStatistics();
    setStatistics(stats);
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [data, stats] = await Promise.all([
        getAllTasks(),
        getTaskStatistics(),
      ]);
      setTasks(data);
      setStatistics(stats);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addTask = async (payload) => {
    const task = await createTask(payload);
    setTasks((prev) => [task, ...prev]);
    await loadStats();
    return task;
  };

  const editTask = async (id, updates) => {
    const task = await updateTask(id, updates);
    if (task) {
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      await loadStats();
    }
    return task;
  };

  const removeTask = async (id) => {
    const deleted = await deleteTask(id);
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
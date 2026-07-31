import { useEffect, useState } from "react";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStatistics,
} from "../services/taskService";
import useRole from "./useRole";

export function useTasks() {
  const role = useRole();
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    const stats = await getTaskStatistics(role);
    setStatistics(stats);
  };

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [data, stats] = await Promise.all([getAllTasks(role), getTaskStatistics(role)]);
        if (isMounted) {
          setTasks(data);
          setStatistics(stats);
        }
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

  const addTask = async (payload) => {
    const task = await createTask(payload, role);
    setTasks((prev) => [task, ...prev]);
    await loadStats();
    return task;
  };

  const editTask = async (id, updates) => {
    const task = await updateTask(id, updates, role);
    if (task) {
      setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
      await loadStats();
    }
    return task;
  };

  const removeTask = async (id) => {
    const deleted = await deleteTask(id, role);
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
  };
}

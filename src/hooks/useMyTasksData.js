import { useEffect, useState } from "react";
import { getTaskStats, getMyTasks } from "../services/myTasksService";

export function useMyTasksData() {
  const [stats, setStats] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getTaskStats(), getMyTasks()])
      .then(([statList, taskList]) => {
        if (isMounted) {
          setStats(statList);
          setTasks(taskList);
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

  return { stats, tasks, loading, error };
}
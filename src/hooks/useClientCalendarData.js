import { useEffect, useState } from "react";
import { getClientEvents } from "../services/clientCalendarService";

export function useClientCalendarData() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getClientEvents()
      .then((data) => {
        if (isMounted) setEvents(data);
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

  return { events, loading, error };
}
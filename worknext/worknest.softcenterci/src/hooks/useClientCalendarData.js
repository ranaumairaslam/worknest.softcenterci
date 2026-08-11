import { useEffect, useState, useCallback } from "react";
import { getClientEvents, createEvent } from "../services/clientCalendarService";

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

  const addEvent = useCallback(async (eventInput) => {
    // Optimistic temp entry so the UI responds immediately
    const tempId = `temp-${Date.now()}`;
    const optimisticEvent = { ...eventInput, id: tempId };
    setEvents((prev) => [...prev, optimisticEvent]);

    try {
      const saved = await createEvent(eventInput);
      // Swap the temp entry for the "saved" one (with real id)
      setEvents((prev) => prev.map((e) => (e.id === tempId ? saved : e)));
    } catch (err) {
      // Roll back on failure
      setEvents((prev) => prev.filter((e) => e.id !== tempId));
      setError(err);
    }
  }, []);

  return { events, loading, error, addEvent };
}
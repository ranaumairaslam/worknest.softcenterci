import { useEffect, useState, useCallback } from "react";
import { getEvents, createEvent } from "../services/calendarService";

export function useCalendarData() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getEvents()
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
    const tempId = `temp-${Date.now()}`;
    const optimisticEvent = { ...eventInput, id: tempId };
    setEvents((prev) => [...prev, optimisticEvent]);

    try {
      const saved = await createEvent(eventInput);
      setEvents((prev) => prev.map((e) => (e.id === tempId ? saved : e)));
    } catch (err) {
      setEvents((prev) => prev.filter((e) => e.id !== tempId));
      setError(err);
    }
  }, []);

  return { events, loading, error, addEvent };
}
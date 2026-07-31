import { useEffect, useState, useCallback } from "react";
import { getMeetings, createMeeting, updateMeeting, cancelMeeting } from "../services/meetingsService";

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getMeetings()
      .then((data) => {
        if (isMounted) setMeetings(data);
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

  const addMeeting = useCallback(async (meetingInput) => {
    const tempId = `temp-${Date.now()}`;
    setMeetings((prev) => [...prev, { ...meetingInput, id: tempId }]);

    try {
      const saved = await createMeeting(meetingInput);
      setMeetings((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
    } catch (err) {
      setMeetings((prev) => prev.filter((m) => m.id !== tempId));
      setError(err);
    }
  }, []);

  const editMeeting = useCallback(async (id, updates) => {
    const previous = meetings;
    setMeetings((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));

    try {
      await updateMeeting(id, updates);
    } catch (err) {
      setMeetings(previous);
      setError(err);
    }
  }, [meetings]);

  const removeMeeting = useCallback(async (id) => {
    const previous = meetings;
    setMeetings((prev) => prev.filter((m) => m.id !== id));

    try {
      await cancelMeeting(id);
    } catch (err) {
      setMeetings(previous);
      setError(err);
    }
  }, [meetings]);

  return { meetings, loading, error, addMeeting, editMeeting, removeMeeting };
}
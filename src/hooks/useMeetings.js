import { useEffect, useState } from "react";
import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  cancelMeeting,
  inviteParticipants,
} from "../services/meetingService";

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAllMeetings();
        if (isMounted) setMeetings(data);
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

  const addMeeting = async (payload) => {
    const meeting = await createMeeting(payload);
    setMeetings((prev) => [meeting, ...prev]);
    return meeting;
  };

  const editMeeting = async (id, updates) => {
    const meeting = await updateMeeting(id, updates);
    if (meeting) {
      setMeetings((prev) => prev.map((m) => (m.id === id ? meeting : m)));
    }
    return meeting;
  };

  const removeMeeting = async (id) => {
    const deleted = await deleteMeeting(id);
    if (deleted) {
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    }
    return deleted;
  };

  const cancelMeetingById = async (id) => {
    const meeting = await cancelMeeting(id);
    if (meeting) {
      setMeetings((prev) => prev.map((m) => (m.id === id ? meeting : m)));
    }
    return meeting;
  };

  const inviteToMeeting = async (id, participants) => {
    const meeting = await inviteParticipants(id, participants);
    if (meeting) {
      setMeetings((prev) => prev.map((m) => (m.id === id ? meeting : m)));
    }
    return meeting;
  };

  return {
    meetings,
    loading,
    error,
    addMeeting,
    editMeeting,
    removeMeeting,
    cancelMeetingById,
    inviteToMeeting,
  };
}

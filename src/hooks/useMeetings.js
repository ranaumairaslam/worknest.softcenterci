import { useCallback, useEffect, useState } from "react";
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

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllMeetings();
      setMeetings(data);
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
    refresh: load,
  };
}
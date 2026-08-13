import { useEffect, useState } from "react";
import useRole from "./useRole";

import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  cancelMeeting,
  inviteParticipants,
} from "../services/meetingService";
import {
  getTeamLeaderMeetings,
  createTeamLeaderMeeting,
  cancelTeamLeaderMeeting,
} from "../services/teamLeaderService";

export function useMeetings() {
  const role = useRole();

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetings() {
      try {
        const isLeaderRole = role === "projectLeader" || role === "team_leader";
        const data = isLeaderRole
          ? await getTeamLeaderMeetings()
          : await getAllMeetings(role);

        if (isMounted) {
          setMeetings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMeetings();

    return () => {
      isMounted = false;
    };
  }, [role]);

  const addMeeting = async (payload) => {
    const isLeaderRole = role === "projectLeader" || role === "team_leader";
    const meeting = isLeaderRole
      ? await createTeamLeaderMeeting(payload)
      : await createMeeting(payload, role);

    if (meeting) {
      setMeetings((prev) => [meeting, ...prev]);
    }

    return meeting;
  };

  const editMeeting = async (id, updates) => {
    const meeting = await updateMeeting(id, updates, role);

    if (meeting) {
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? meeting : m))
      );
    }

    return meeting;
  };

  const removeMeeting = async (id) => {
    const deleted = await deleteMeeting(id, role);

    if (deleted) {
      setMeetings((prev) =>
        prev.filter((m) => m.id !== id)
      );
    }

    return deleted;
  };

  const cancelMeetingById = async (id) => {
    const isLeaderRole = role === "projectLeader" || role === "team_leader";
    const meeting = isLeaderRole
      ? await cancelTeamLeaderMeeting(id)
      : await cancelMeeting(id, role);

    if (meeting) {
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? meeting : m))
      );
    }

    return meeting;
  };

  const inviteToMeeting = async (id, participants) => {
    const meeting = await inviteParticipants(
      id,
      participants,
      role
    );

    if (meeting) {
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? meeting : m))
      );
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
// src/hooks/useTeamMemberMeetings.js
import { useCallback, useEffect, useState } from "react";
import {
  getUpcomingMeetings,
  joinMeeting,
} from "../services/teamMemberService";

export function useTeamMemberMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetings() {
      try {
        const data = await getUpcomingMeetings();

        // Map backend meeting → shape MeetingCard expects
        const mapped = data.map((m) => ({
          id: m.meetingId,
          title: m.title,
          date: m.startTime || m.date,
          time: m.startTime
            ? new Date(m.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : m.time || "",
          link: m.link || m.meetingLink || "",
          participants: m.participants || [],
          attendees: m.attendees || m.participants || [],
          guests: m.guests || [],
          status: m.status,
          raw: m,
        }));

        if (isMounted) {
          setMeetings(mapped);
        }
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadMeetings();

    return () => {
      isMounted = false;
    };
  }, []);

  const joinMeetingById = useCallback(async (meetingId) => {
    try {
      const res = await joinMeeting(meetingId);

      // Open the join URL in a new tab
      if (res?.joinUrl) {
        window.open(res.joinUrl, "_blank", "noopener,noreferrer");
      }

      // Update meeting status locally
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === meetingId ? { ...m, status: "live" } : m
        )
      );

      return res;
    } catch (err) {
      setError(err);
      alert(err?.message || "Failed to join meeting");
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingMeetings();
      const mapped = data.map((m) => ({
        id: m.meetingId,
        title: m.title,
        date: m.startTime || m.date,
        time: m.startTime
          ? new Date(m.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : m.time || "",
        link: m.link || m.meetingLink || "",
        participants: m.participants || [],
        attendees: m.attendees || m.participants || [],
        guests: m.guests || [],
        status: m.status,
        raw: m,
      }));
      setMeetings(mapped);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    meetings,
    loading,
    error,
    joinMeetingById,
    refresh,
  };
}
// src/hooks/useTeamMemberMeetings.js
import { useCallback, useEffect, useState } from "react";
import {
  getUpcomingMeetings,
  joinMeeting,
} from "../services/teamMemberService";

// ✅ Helper to safely map meetings
function mapMeeting(m) {
  console.log("🔍 Raw meeting object:", m);   // 🐛 DEBUG - shows backend structure

  return {
    id: m.meetingId || m.meetingid || m.id || m._id,   // ✅ All ID variants

    title: m.title,
    date: m.startTime || m.date,
    time: m.startTime
      ? new Date(m.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : m.time || "",
    link: m.link || m.meetingLink || "",

    // ✅ Fix [object Object] — extract name if participants are objects
    participants: (m.participants || []).map((p) =>
      typeof p === "object" ? p.name || p.email || p.id : p
    ),
    attendees: (m.attendees || m.participants || []).map((p) =>
      typeof p === "object" ? p.name || p.email || p.id : p
    ),

    guests: m.guests || [],
    status: m.status,
    raw: m,
  };
}

export function useTeamMemberMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMeetings() {
      try {
        const data = await getUpcomingMeetings();
        console.log("📥 Meetings from backend:", data);
        if (isMounted) setMeetings(data.map(mapMeeting));
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
    console.log("🎥 Joining meeting with ID:", meetingId);

    if (!meetingId) {
      alert("Meeting ID is missing!");
      return;
    }

    try {
      const res = await joinMeeting(meetingId);
      if (res?.joinUrl) {
        window.open(res.joinUrl, "_blank", "noopener,noreferrer");
      }
      setMeetings((prev) =>
        prev.map((m) =>
          m.id === meetingId ? { ...m, status: "live" } : m
        )
      );
      return res;
    } catch (err) {
      console.error("❌ Join failed:", err);
      alert(err?.message || "Failed to join meeting.");
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingMeetings();
      setMeetings(data.map(mapMeeting));
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
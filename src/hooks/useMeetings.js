import { useEffect, useState } from "react";
import {
  getAllMeetings,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  cancelMeeting,
  inviteParticipants,
} from "../services/meetingService";
import useRole from "./useRole";
import { useEffect, useState, useCallback } from "react";
import { getMeetings, createMeeting, updateMeeting, cancelMeeting } from "../services/meetingsService";

export function useMeetings() {
  const role = useRole();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAllMeetings(role);
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
  }, [role]);

  const addMeeting = async (payload) => {
    const meeting = await createMeeting(payload, role);
    setMeetings((prev) => [meeting, ...prev]);
    return meeting;
  };

  const editMeeting = async (id, updates) => {
    const meeting = await updateMeeting(id, updates, role);
    if (meeting) {
      setMeetings((prev) => prev.map((m) => (m.id === id ? meeting : m)));
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

  const removeMeeting = async (id) => {
    const deleted = await deleteMeeting(id, role);
    if (deleted) {
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    }
    return deleted;
  };

  const cancelMeetingById = async (id) => {
    const meeting = await cancelMeeting(id, role);
    if (meeting) {
      setMeetings((prev) => prev.map((m) => (m.id === id ? meeting : m)));
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

  const inviteToMeeting = async (id, participants) => {
    const meeting = await inviteParticipants(id, participants, role);
    if (meeting) {
      setMeetings((prev) => prev.map((m) => (m.id === id ? meeting : m)));
    try {
      await cancelMeeting(id);
    } catch (err) {
      setMeetings(previous);
      setError(err);
    }
  }, [meetings]);

  return { meetings, loading, error, addMeeting, editMeeting, removeMeeting };
}
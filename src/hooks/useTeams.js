import { useCallback, useEffect, useState } from "react";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  assignTeamLeader,
} from "../services/teamService";

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTeams();
      setTeams(data);
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

  const addTeam = async (payload) => {
    const team = await createTeam(payload);
    // If leader was selected, assign as leader after creation
    if (team && payload.leaderId) {
      try {
        await assignTeamLeader(team.id, payload.leaderId);
      } catch (err) {
        console.warn('Could not auto-assign leader:', err);
      }
    }
    // Refresh list to get updated leader info
    await load();
    return team;
  };

  const editTeam = async (id, updates) => {
    const team = await updateTeam(id, updates);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === id ? team : t)));
    }
    // If leader changed, assign
    if (updates.leaderId) {
      try {
        await assignTeamLeader(id, updates.leaderId);
        await load();
      } catch (err) {
        console.warn('Could not assign leader:', err);
      }
    }
    return team;
  };

  const removeTeam = async (id) => {
    const deleted = await deleteTeam(id);
    if (deleted) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
    }
    return deleted;
  };

  const assignMember = async (teamId, employeeId) => {
    const team = await addTeamMember(teamId, employeeId);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === teamId ? team : t)));
    }
    return team;
  };

  const setTeamLeader = async (teamId, userId) => {
    const result = await assignTeamLeader(teamId, userId);
    await load(); // Refresh to get updated data
    return result;
  };

  return {
    teams,
    loading,
    error,
    addTeam,
    editTeam,
    removeTeam,
    assignMember,
    setTeamLeader,
    refresh: load,
  };
}
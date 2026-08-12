import { useCallback, useEffect, useState } from "react";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addExistingMemberToTeam,
  assignTeamLeader,
  removeTeamMember,
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
    
    // If members were selected, add them
    if (team && payload.memberNames && payload.memberNames.length > 0) {
      for (const memberName of payload.memberNames) {
        try {
          await addExistingMemberToTeam(team.id, memberName);
        } catch (err) {
          console.warn(`Could not add member ${memberName}:`, err);
        }
      }
    }
    
    // If leader was selected, assign as leader
    if (team && payload.leaderId) {
      try {
        await assignTeamLeader(team.id, payload.leaderId);
      } catch (err) {
        console.warn('Could not auto-assign leader:', err);
      }
    }
    
    await load();
    return team;
  };

  const editTeam = async (id, updates) => {
    const team = await updateTeam(id, updates);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === id ? team : t)));
    }
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

  const assignMember = async (teamId, employeeName) => {
    try {
      await addExistingMemberToTeam(teamId, employeeName);
      await load(); // Refresh to get updated member count
      return true;
    } catch (err) {
      throw err;
    }
  };

  const removeMember = async (teamId, employeeId) => {
    try {
      await removeTeamMember(teamId, employeeId);
      await load();
      return true;
    } catch (err) {
      throw err;
    }
  };

  const setTeamLeader = async (teamId, userId) => {
    const result = await assignTeamLeader(teamId, userId);
    await load();
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
    removeMember,
    setTeamLeader,
    refresh: load,
  };
}
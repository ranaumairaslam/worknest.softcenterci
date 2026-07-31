import { useEffect, useState } from "react";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  assignProjectLeader,
} from "../services/teamService";

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        const data = await getAllTeams();
        if (!isMounted) return;
        setTeams(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  const addTeam = async (payload) => {
    const team = await createTeam(payload);
    setTeams((prev) => [team, ...prev]);
    return team;
  };

  const editTeam = async (id, updates) => {
    const team = await updateTeam(id, updates);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === id ? team : t)));
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

  const setTeamLeader = async (teamId, leaderName) => {
    const team = await assignProjectLeader(teamId, leaderName);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === teamId ? team : t)));
    }
    return team;
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
  };
}

import { useCallback, useEffect, useState } from "react";
import {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  assignProjectLeader,
} from "../services/teamService";
import { getActor } from "../services/authContext";
import { filterTeams } from "../utils/roleFilter";
import { subscribeDataChange } from "../utils/eventBus";
import useRole from "./useRole";

export function useTeams() {
  const role = useRole();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllTeams(role);
      const user = getActor(role);
      setTeams(filterTeams(data, { role, user }));
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
    return subscribeDataChange(load);
  }, [load]);

  const actor = getActor(role);

  const addTeam = async (payload) => {
    const team = await createTeam(payload, role, actor);
    setTeams((prev) => [team, ...prev]);
    return team;
  };

  const editTeam = async (id, updates) => {
    const team = await updateTeam(id, updates, role);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === id ? team : t)));
    }
    return team;
  };

  const removeTeam = async (id) => {
    const deleted = await deleteTeam(id, role);
    if (deleted) {
      setTeams((prev) => prev.filter((t) => t.id !== id));
    }
    return deleted;
  };

  const assignMember = async (teamId, employeeId) => {
    const team = await addTeamMember(teamId, employeeId, role);
    if (team) {
      setTeams((prev) => prev.map((t) => (t.id === teamId ? team : t)));
    }
    return team;
  };

  const setTeamLeader = async (teamId, leaderName) => {
    const team = await assignProjectLeader(teamId, leaderName, role);
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
    refresh: load,
  };
}

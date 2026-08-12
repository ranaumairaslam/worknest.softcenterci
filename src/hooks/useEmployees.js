import { useCallback, useEffect, useState } from "react";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignToTeam,
  getCompanyTeams,
} from "../services/employeeService";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      let availableTeams = [];
      try {
        availableTeams = await getCompanyTeams();
      } catch {
        // Continue
      }
      setError(null);
      setEmployees(data);
      setTeams(availableTeams);
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

  const addEmployee = async (payload) => {
    try {
      const created = await createEmployee(payload);
      const { credentials, ...employee } = created;
      setError(null);
      setEmployees((prev) => [employee, ...prev]);
      // Return object with credentials so the page can show them
      return { ...employee, credentials };
    } catch (err) {
      throw err;
    }
  };

  const editEmployee = async (id, updates) => {
    try {
      const employee = await updateEmployee(id, updates);
      setError(null);
      setEmployees((prev) =>
        prev.map((item) => (item.id === id ? employee : item)),
      );
      return employee;
    } catch (err) {
      throw err;
    }
  };

  const removeEmployee = async (id) => {
    try {
      const deleted = await deleteEmployee(id);
      if (deleted) {
        setError(null);
        setEmployees((prev) => prev.filter((item) => item.id !== id));
      }
      return deleted;
    } catch (err) {
      throw err;
    }
  };

  const assignEmployeeToTeam = async (employeeId, teamName) => {
    try {
      const employee = await assignToTeam(employeeId, teamName);
      if (employee) {
        setError(null);
        setEmployees((prev) =>
          prev.map((item) => (item.id === employeeId ? employee : item)),
        );
      }
      return employee;
    } catch (err) {
      throw err;
    }
  };

  return {
    employees,
    teams,
    loading,
    error,
    addEmployee,
    editEmployee,
    removeEmployee,
    assignEmployeeToTeam,
    refresh: load,
  };
}
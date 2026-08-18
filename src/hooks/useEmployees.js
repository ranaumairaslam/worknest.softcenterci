import { useEffect, useState } from "react";
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

  useEffect(() => {
    let isMounted = true;

    async function loadEmployees() {
      try {
        const data = await getAllEmployees();
        let availableTeams = [];
        try {
          availableTeams = await getCompanyTeams();
        } catch {
          // Do not hide the employee list if the optional team lookup fails.
        }
        if (!isMounted) return;
        setError(null);
        setEmployees(data);
        setTeams(availableTeams);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadEmployees();

    return () => {
      isMounted = false;
    };
  }, []);

  const addEmployee = async (payload) => {
    setLoading(true);
    try {
      const created = await createEmployee(payload);
      const { credentials, ...employee } = created;
      setError(null);
      setEmployees((prev) => [employee, ...prev]);
      return { employee, credentials };
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = async (id, updates) => {
    setLoading(true);
    try {
      const employee = await updateEmployee(id, updates);
      setError(null);
      setEmployees((prev) =>
        prev.map((item) => (item.id === id ? employee : item)),
      );
      return employee;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (id) => {
    setLoading(true);
    try {
      const deleted = await deleteEmployee(id);
      if (deleted) {
        setError(null);
        setEmployees((prev) => prev.filter((item) => item.id !== id));
      }
      return deleted;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignEmployeeToTeam = async (employeeId, teamName) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
  };
}

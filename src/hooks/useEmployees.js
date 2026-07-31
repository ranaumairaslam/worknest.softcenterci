import { useEffect, useState } from "react";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignToTeam,
} from "../services/employeeService";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEmployees() {
      try {
        const data = await getAllEmployees();
        if (!isMounted) return;
        setEmployees(data);
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
      const employee = await createEmployee(payload);
      setEmployees((prev) => [employee, ...prev]);
      return employee;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = async (id, updates) => {
    setLoading(true);
    try {
      const employee = await updateEmployee(id, updates);
      setEmployees((prev) => prev.map((item) => (item.id === id ? employee : item)));
      return employee;
    } catch (err) {
      setError(err);
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
        setEmployees((prev) => prev.filter((item) => item.id !== id));
      }
      return deleted;
    } catch (err) {
      setError(err);
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
        setEmployees((prev) => prev.map((item) => (item.id === employeeId ? employee : item)));
      }
      return employee;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    editEmployee,
    removeEmployee,
    assignEmployeeToTeam,
  };
}

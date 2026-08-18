import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";

import { useEmployees } from "../hooks/useEmployees";
import EmployeeModal from "../components/Modals/EmployeeModal";
import EmployeeDetailsModal from "../components/Modals/EmployeeDetailsModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";

export default function Employees() {
  const {
    employees,
    loading,
    error,
    addEmployee,
    editEmployee,
    removeEmployee,
    assignEmployeeToTeam,
    teams,
  } = useEmployees();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteEmployeeItem, setDeleteEmployeeItem] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const name = (employee.name || "").toLowerCase();
      const email = (employee.email || "").toLowerCase();
      const team = (employee.team || "").toLowerCase();
      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase()) ||
        team.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const handleOpenNewEmployee = () => {
    setSelectedEmployee(null);
    setShowEmployeeModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

   const handleSubmitEmployee = async (employee) => {
    try {
      if (selectedEmployee) {
        // For UPDATE
        await editEmployee(selectedEmployee.id, employee);
        showToast("Employee updated successfully.");
      } else {
        // For CREATE
        const created = await addEmployee(employee);
        const credentials = created?.credentials;
        showToast(
          credentials
            ? `Employee added! Login: ${credentials.email} | Password: ${credentials.password}`
            : "Employee added successfully."
        );
      }
      setShowEmployeeModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Unable to save employee.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteEmployeeItem) return;

    try {
      await removeEmployee(deleteEmployeeItem.id);
      showToast("Employee deleted successfully.");
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Unable to delete employee.", "error");
    } finally {
      setDeleteEmployeeItem(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading employee management...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Employee Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add, edit, and manage your company staff from a single interface.
          </p>
        </div>

        <button
          onClick={handleOpenNewEmployee}
          className="inline-flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#014b55]"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Employees</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{employees.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active Employees</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {employees.filter((employee) => employee.status === "Active").length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Teams Assigned</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {new Set(employees.map((employee) => employee.team)).size}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Inactive Employees</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {employees.filter((employee) => employee.status !== "Active").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none focus:border-slate-300"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>On Leave</option>
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3">Name</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Team</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Email</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500">
                    No employees match your search.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t border-slate-100">
                    <td className="py-4 font-medium text-slate-700">{employee.name}</td>
                    <td className="py-4 text-slate-500">{employee.role}</td>
                    <td className="py-4 text-slate-500">{employee.team}</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{employee.email}</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setViewEmployee(employee)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteEmployeeItem(employee)}
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeDetailsModal
        open={!!viewEmployee}
        employee={viewEmployee}
        onClose={() => setViewEmployee(null)}
      />

      <EmployeeModal
        open={showEmployeeModal}
        teams={teams}
        employee={selectedEmployee}
        onClose={() => setShowEmployeeModal(false)}
        onSubmit={handleSubmitEmployee}
      />

      <ConfirmationModal
        open={!!deleteEmployeeItem}
        title="Delete Employee"
        message={`Are you sure you want to remove ${deleteEmployeeItem?.name}?`}
        onCancel={() => setDeleteEmployeeItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  );
}

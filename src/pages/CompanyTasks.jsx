import { useMemo, useState } from "react";
import { Search, Plus, Edit3, Trash2, Eye } from "lucide-react";

import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import TaskModal from "../components/Modals/TaskModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";
import { useEmployees } from "../hooks/useEmployees";

export default function CompanyTasks() {
  const { tasks, statistics, loading, error, addTask, editTask, removeTask } = useTasks();
  const { projects } = useProjects();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.name.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };
const { employees } = useEmployees();
  const handleSubmit = async (task) => {
    try {
      if (selectedTask) {
        await editTask(selectedTask.id, task);
        showSuccess("Task updated successfully.");
      } else {
        await addTask(task);
        showSuccess("Task assigned successfully.");
      }
      setShowModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeTask(deleteItem.id);
      showSuccess("Task deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading tasks...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-500">Failed to load tasks.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Task Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Assign, update, and monitor task progress across all projects.
          </p>
        </div>
        <button
          onClick={() => { setSelectedTask(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 text-sm font-semibold text-white hover:bg-[#014b55]"
        >
          <Plus size={16} />
          Assign Task
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.filter((s) => s.id !== "total-tasks").slice(0, 4).map((stat) => (
          <div key={stat.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Under Review</option>
            <option>Completed</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3">Task</th>
                <th className="pb-3">Project</th>
                <th className="pb-3">Assignee</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">No tasks found.</td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="border-t border-slate-100">
                    <td className="py-4 font-medium text-slate-700">{task.name}</td>
                    <td className="py-4 text-slate-500">{task.project}</td>
                    <td className="py-4 text-slate-500">{task.assignee}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{task.progress}%</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedTask(task); setShowModal(true); }}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(task)}
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

    <TaskModal
  open={showModal}
  task={selectedTask}
  projects={projects}
  teamMembers={employees}
  onClose={() => {
    setShowModal(false);
    setSelectedTask(null);
  }}
  onSubmit={handleSubmit}
/>
      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteItem?.name}"?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />
    </div>
  );
}

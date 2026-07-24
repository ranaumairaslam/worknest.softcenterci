
import { Plus } from "lucide-react";
import StatCardSimple from "../components/Cards/StatCardSimple";
import MyTasksTable from "../components/Tables/MyTasksTable";
import { useMyTasksData } from "../hooks/useMyTasksData";

export default function MyTasks() {
  const { stats, tasks, loading, error } = useMyTasksData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading tasks…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load tasks.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">My Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage all your tasks in one place.
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg">
          <Plus size={14} /> New Task
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCardSimple key={s.id} {...s} />
        ))}
      </div>

      <MyTasksTable tasks={tasks} />
    </div>
  );
}
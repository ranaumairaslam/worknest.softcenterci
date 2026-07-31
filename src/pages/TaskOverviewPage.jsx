import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import TaskOverviewTable from "../components/Cards/TaskOverviewTable";
import CreateTaskModal from "../components/Cards/CreateTaskModal";
import EditTaskModal from "../components/Cards/EditTaskModal";
import ProjectSearchSelect from "../components/Cards/ProjectSearchSelect";
import { useProjectOversightData } from "../hooks/useProjectOversightData";

export default function TaskOverviewPage() {
  const { projects, selectedProjectId, setSelectedProjectId, data, loading, error } =
    useProjectOversightData();

  const [taskList, setTaskList] = useState([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    if (data) {
      setTaskList(data.tasks);
    }
  }, [data]);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading tasks…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  const { summary, team } = data;

  function handleCreateTask(newTask) {
    if (newTask.projectId === selectedProjectId) {
      setTaskList((prev) => [newTask, ...prev]);
    }
  }

  function handleUpdateTask(taskId, updates) {
    setTaskList((prev) => prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t)));
  }

  function handleDeleteTask(taskId) {
    setTaskList((prev) => prev.filter((t) => t.id !== taskId));
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Task Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dashboard &gt; Project Oversight &gt; Task Overview
          </p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> Create Task
        </button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-slate-500">Project:</label>
        {projects && projects.length > 0 ? (
          <ProjectSearchSelect
            projects={projects}
            selectedId={selectedProjectId}
            onSelect={setSelectedProjectId}
          />
        ) : (
          <span className="text-sm font-medium text-slate-800">{summary.name}</span>
        )}
      </div>

      <TaskOverviewTable
        tasks={taskList}
        onEdit={setEditingTask}
        onDelete={handleDeleteTask}
      />

      <CreateTaskModal
        open={showCreateTask}
        team={team}
        projects={projects}
        currentProjectId={selectedProjectId}
        onClose={() => setShowCreateTask(false)}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        task={editingTask}
        team={team}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />
    </div>
  );
}
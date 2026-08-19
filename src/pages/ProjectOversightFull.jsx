import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock3, Users, CheckSquare, Briefcase, ArrowRight } from "lucide-react";
import ProjectHeaderCard from "../components/Cards/ProjectHeaderCard";
import StatCardTrend from "../components/Cards/StatCardTrend";
import TeamRosterModal from "../components/Cards/TeamRosterModal";
import CreateTaskModal from "../components/Cards/CreateTaskModal";
import EditTaskModal from "../components/Cards/EditTaskModal";
import TaskOverviewTable from "../components/Cards/TaskOverviewTable";
import { useProjectOversightData } from "../hooks/useProjectOversightData";
import { computeLiveStats, computeLiveSummary } from "../utils/projectStats";

const sectionLinks = [
  { key: "timeline", title: "Project Timeline", description: "Track project phases from kickoff to launch", icon: Clock3, path: "/project/timeline", color: "bg-indigo-50 text-indigo-600" },
  { key: "team-performance", title: "Team Performance", description: "See how each team member is progressing", icon: Users, path: "/project/team-performance", color: "bg-blue-50 text-blue-600" },
  { key: "tasks", title: "Task Overview", description: "Search, filter, and manage all project tasks", icon: CheckSquare, path: "/project/tasks", color: "bg-emerald-50 text-emerald-600" },
  { key: "kanban", title: "Kanban Board", description: "View tasks organized by status columns", icon: Briefcase, path: "/project/kanban", color: "bg-amber-50 text-amber-600" },
];

export default function ProjectOversightFull() {
  const { projects, selectedProjectId, setSelectedProjectId, data, loading, error } = useProjectOversightData();
  const [taskList, setTaskList] = useState([]);
  const [showRoster, setShowRoster] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Sync local editable task list whenever the underlying project data
  // changes (e.g. switching projects). This is the single source of
  // truth for create/edit/delete — no more separate extraTasks array.
  useEffect(() => {
    if (data) {
      setTaskList(data.tasks);
    }
  }, [data]);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading project oversight…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load project data.</div>;

  const { summary, stats, team } = data;

  const liveStats = computeLiveStats(stats, taskList);
  const liveSummary = computeLiveSummary(summary, taskList);

  function handleExport() {
    const header = "ID,Task Name,Priority,Status,Assignee,Due Date,Progress\n";
    const rows = taskList
      .map((t) => `${t.id},${t.name},${t.priority},${t.status},${t.assignee},${t.dueDate},${t.progress}%`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "project-tasks.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCreateTask(newTask) {
    // Only add to the visible list if it belongs to the project
    // currently being viewed — see note in CreateTaskModal about
    // cross-project creation being a mock-data limitation.
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
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Project Oversight</h1>
        <p className="text-xs text-slate-400 mt-1">Dashboard &gt; Project Oversight</p>
      </div>

      <ProjectHeaderCard
        summary={liveSummary}
        projects={projects}
        onProjectChange={setSelectedProjectId}
        onExport={handleExport}
        onCreateTask={() => setShowCreateTask(true)}
        onFilterChange={(f) => console.log("Priority filter selected:", f)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {liveStats.map((s) => (
          <StatCardTrend key={s.id} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sectionLinks.map(({ key, title, description, icon: Icon, path, color }) => (
          <Link
            key={key}
            to={path}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-sm font-semibold text-slate-800 flex items-center justify-between">
              {title}
              <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
            </p>
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          </Link>
        ))}
      </div>

      <TaskOverviewTable
        tasks={taskList}
        onEdit={setEditingTask}
        onDelete={handleDeleteTask}
      />

      <TeamRosterModal open={showRoster} team={team} onClose={() => setShowRoster(false)} />

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
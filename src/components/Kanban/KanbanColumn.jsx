import { useState } from "react";
import TaskCard from "./TaskCard";

// ✅ keys match backend statuses
const columnStyles = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  done: "bg-emerald-100 text-emerald-700", // was "completed"
};

export default function KanbanColumn({
  title,
  statusKey,
  tasks = [],
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onDropTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e) {
    if (!onDropTask) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e) {
    if (!onDropTask) return;
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDropTask(taskId, statusKey);
    }
  }

  return (
    <div className="flex-1 min-w-[220px]">
      <div
        className={`text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-lg mb-3 ${
          columnStyles[statusKey] || "bg-slate-100 text-slate-600"
        }`}
      >
        {title} <span className="opacity-60">({tasks.length})</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`space-y-3 min-h-[80px] rounded-lg transition-colors ${
          isDragOver ? "bg-blue-50 ring-2 ring-blue-300 ring-dashed" : ""
        }`}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-16 flex items-center justify-center text-xs text-slate-300 border border-dashed border-slate-200 rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
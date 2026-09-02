import KanbanColumn from "./KanbanColumn";

// ✅ keys match backend statuses
const columns = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "under_review", title: "Under Review" },
  { key: "done", title: "Completed" }, // was "completed"
];

export default function KanbanBoard({
  tasks = [],
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onDropTask,
}) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((col) => (
        <KanbanColumn
          key={col.key}
          title={col.title}
          statusKey={col.key}
          tasks={tasks.filter((t) => t.status === col.key)}
          onTaskClick={onTaskClick}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onDropTask={onDropTask}
        />
      ))}
    </div>
  );
}
import TaskCard from "./TaskCard";

const columnStyles = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function KanbanColumn({ title, statusKey, tasks, onTaskClick }) {
  return (
    <div className="w-[min(100%,280px)] shrink-0 snap-start sm:min-w-[220px] sm:flex-1">
      <div className={`text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-lg mb-3 ${columnStyles[statusKey]}`}>
        {title} <span className="opacity-60">({tasks.length})</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
}
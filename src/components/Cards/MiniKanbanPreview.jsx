

const headerColor = {
  backlog: "bg-slate-100 text-slate-600",
  todo: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  review: "bg-purple-100 text-purple-700",
  testing: "bg-cyan-100 text-cyan-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function MiniKanbanPreview({ columns }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-700">Task Progress (Kanban)</p>
        <button className="text-xs text-blue-600 hover:underline">View Board</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {columns.map((col) => (
          <div key={col.key}>
            <div className={`text-xs font-medium px-2 py-1 rounded-md mb-2 ${headerColor[col.key]}`}>
              {col.title} ({col.count})
            </div>
            <div className="space-y-2">
              {col.cards.slice(0, 3).map((card) => (
                <div key={card} className="bg-slate-50 rounded-lg p-2 text-xs text-slate-600">
                  {card}
                </div>
              ))}
              {col.count > col.cards.length && (
                <button className="text-xs text-slate-400 hover:text-slate-600">
                  + {col.count - col.cards.length} more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
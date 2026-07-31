export default function ListCard({ title, items, onAction }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-medium text-slate-700 mb-4">{title}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between pb-3 border-b last:border-b-0 border-slate-50"
          >
            <div>
              <p className="text-sm text-slate-700 font-medium">{item.primary}</p>
              {item.secondary && (
                <p className="text-xs text-slate-400">{item.secondary}</p>
              )}
            </div>
            {item.action && (
              <button
                onClick={() => onAction?.(item)}
                className="text-xs font-medium text-[#016472] hover:underline shrink-0"
              >
                {item.action}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

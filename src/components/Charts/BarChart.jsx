

export default function BarChart({ data, max = 100 }) {
  return (
    <div className="flex items-end justify-between gap-4 h-56 pt-4">
      {data.map((d) => (
        <div key={d.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <div
            className="w-10 sm:w-12 rounded-md bg-indigo-500"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
          <span className="text-xs text-slate-500 text-center leading-tight">{d.name}</span>
        </div>
      ))}
    </div>
  );
}
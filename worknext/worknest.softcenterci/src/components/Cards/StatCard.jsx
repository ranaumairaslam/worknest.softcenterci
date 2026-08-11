export default function StatCard({ label, value, note, icon, iconBg = "bg-slate-50" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
        </div>
        {icon && (
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

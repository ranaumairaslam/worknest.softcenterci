export default function DateSeparator({ label }) {
  return (
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-slate-200" />

      <span className="rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold text-slate-600">
        {label}
      </span>

      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}
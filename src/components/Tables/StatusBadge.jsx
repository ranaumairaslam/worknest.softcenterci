const styles = {
  Active: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Delayed: "bg-rose-50 text-rose-600",
};

export default function StatusBadge({ status }) {
  return (
    <span
  className={`inline-flex w-28 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}
>
  {status}
</span>
  );
}
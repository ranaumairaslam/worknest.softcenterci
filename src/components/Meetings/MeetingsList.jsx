import MeetingCard from "./MeetingCard";

export default function MeetingsList({ meetings, canManage, onEdit, onCancel }) {
  const sorted = [...meetings].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
        <p className="text-sm text-slate-400">No upcoming meetings scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((m) => (
        <MeetingCard
          key={m.id}
          meeting={m}
          canManage={canManage}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}
import { Video, Users, Calendar, Clock, Pencil, X } from "lucide-react";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function MeetingCard({ meeting, canManage, onEdit, onCancel }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{meeting.title}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {formatDate(meeting.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {meeting.time}
            </span>
            {meeting.attendees.length > 0 && (
              <span className="flex items-center gap-1">
                <Users size={12} /> {meeting.attendees.join(", ")}
              </span>
            )}
          </div>

          {meeting.guests && meeting.guests.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-1.5">
              {meeting.guests.map((email) => (
                <span
                  key={email}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600"
                >
                  {email}
                </span>
              ))}
            </div>
          )}
        </div>

        {canManage && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(meeting)}
              aria-label={`Edit ${meeting.title}`}
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onCancel(meeting)}
              aria-label={`Cancel ${meeting.title}`}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {meeting.link && (
        <a
          href={meeting.link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline"
        >
          <Video size={12} /> Join Meeting
        </a>
      )}
    </div>
  );
}
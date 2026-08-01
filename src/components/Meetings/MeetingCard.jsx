import {
  Video,
  Users,
  Calendar,
  Clock,
  Pencil,
  X,
} from "lucide-react";

function formatDate(date) {
  if (!date) return "No Date";

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MeetingCard({
  meeting = {},
  canManage = false,
  onEdit = () => {},
  onCancel = () => {},
}) {
  const attendees = Array.isArray(meeting.attendees)
    ? meeting.attendees
    : Array.isArray(meeting.participants)
    ? meeting.participants
    : [];

  const guests = Array.isArray(meeting.guests)
    ? meeting.guests
    : [];

  const meetingLink =
    meeting.link ||
    meeting.meetingLink ||
    meeting.meetLink ||
    "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-800 truncate">
            {meeting.title || "Untitled Meeting"}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatDate(meeting.date)}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={14} />
              {meeting.time || "No Time"}
            </span>

            {attendees.length > 0 && (
              <span className="flex items-center gap-1">
                <Users size={14} />
                {attendees.join(", ")}
              </span>
            )}
          </div>

          {guests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {guests.map((email, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700"
                >
                  {email}
                </span>
              ))}
            </div>
          )}
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(meeting)}
              className="p-2 rounded-lg hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition"
              aria-label="Edit Meeting"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => onCancel(meeting)}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition"
              aria-label="Cancel Meeting"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {meetingLink && (
        <div className="mt-5">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            <Video size={16} />
            Join Meeting
          </a>
        </div>
      )}
    </div>
  );
}
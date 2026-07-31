import {
  X,
  CalendarDays,
  Clock3,
  Video,
  UserRound,
} from "lucide-react";

export default function MeetingDetailsModal({
  meeting,
  onClose,
}) {
  if (!meeting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">
            {meeting.title}
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-5 p-6">

          <p className="text-slate-600">
            {meeting.project}
          </p>

          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#016472]" />
            <span>{meeting.date}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock3 className="text-[#016472]" />
            <span>{meeting.time}</span>
          </div>

          <div className="flex items-center gap-3">
            <Video className="text-[#016472]" />
            <span>{meeting.platform}</span>
          </div>

          <div className="flex items-center gap-3">
            <UserRound className="text-[#016472]" />
            <span>{meeting.organizer}</span>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border px-5 py-2"
            >
              Close
            </button>

           <button
  onClick={() => {
    if (meeting.meetingLink) {
      window.open(meeting.meetingLink, "_blank");
    }
  }}
  className="rounded-xl bg-[#016472] px-5 py-2 font-semibold text-white hover:bg-[#014b55]"
>
  Join Now
</button>
          </div>

        </div>

      </div>
    </div>
  );
}
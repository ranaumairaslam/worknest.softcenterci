import {
  CalendarDays,
  Clock3,
  Video,
  UserRound,
  ArrowRight,
} from "lucide-react";

export default function UpcomingMeetings({ meetings }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Upcoming Meetings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your scheduled meetings.
          </p>
        </div>

        <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
          {meetings.length} Meetings
        </span>
      </div>

      {/* Meeting Cards */}
      <div className="space-y-5">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:border-cyan-300 hover:shadow-md"
          >
          
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {meeting.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {meeting.project}
                </p>
              </div>

              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                Scheduled
              </span>
            </div>

           
            <div className="mt-5 space-y-3">

              <div className="flex items-center gap-3">
                <CalendarDays
                  size={18}
                  className="text-cyan-600"
                />

                <span className="text-slate-700">
                  {meeting.date}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Clock3
                  size={18}
                  className="text-cyan-600"
                />

                <span className="text-slate-700">
                  {meeting.time}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Video
                  size={18}
                  className="text-cyan-600"
                />

                <span className="text-slate-700">
                  {meeting.platform}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <UserRound
                  size={18}
                  className="text-cyan-600"
                />

                <span className="text-slate-700">
                  {meeting.organizer}
                </span>
              </div>

            </div>

           
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#016472] px-4 py-3 font-semibold text-white transition hover:bg-[#014b55]">
              Join Meeting
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
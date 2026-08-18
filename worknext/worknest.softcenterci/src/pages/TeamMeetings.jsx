import MeetingsList from "../components/Meetings/MeetingsList";
import { useMeetings } from "../hooks/useMeetings";

export default function TeamMeetings() {
  const { meetings, loading, error } = useMeetings();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading meetings…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load meetings.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Meetings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upcoming meetings scheduled by your project leader.
        </p>
      </div>

      <MeetingsList meetings={meetings} canManage={false} />
    </div>
  );
}
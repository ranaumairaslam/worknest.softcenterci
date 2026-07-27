
import MonthCalendar from "../components/Calendar/MonthCalendar";
import { useClientCalendarData } from "../hooks/useClientCalendarData";

export default function ClientCalendar() {
  const { events, loading, error } = useClientCalendarData();

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading calendar…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load calendar.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Calendar</h1>
        <p className="text-sm text-slate-500 mt-1">
          View project meetings, deadlines and milestones.
        </p>
      </div>

      <MonthCalendar events={events} />
    </div>
  );
}
import { useState } from "react";
import { Plus } from "lucide-react";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import AddEventModal from "../components/Calendar/AddEventModal";
import { useCalendarData } from "../hooks/useCalendarData";

export default function Calendar() {
  const { events, loading, error, addEvent } = useCalendarData();
  const [showAddModal, setShowAddModal] = useState(false);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading calendar…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load calendar.</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            View upcoming meetings and project deadlines.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> Add Event
        </button>
      </div>

      <MonthCalendar events={events} />

      <AddEventModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addEvent}
      />
    </div>
  );
}
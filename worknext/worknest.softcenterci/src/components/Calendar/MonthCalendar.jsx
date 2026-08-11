import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const typeColor = {
  meeting: "bg-blue-100 text-blue-700",
  deadline: "bg-rose-100 text-rose-700",
};

function toDateKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function MonthCalendar({ events }) {
  const [cursor, setCursor] = useState(new Date()); // defaults to the actual current month

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = events.reduce((acc, e) => {
    (acc[e.date] ??= []).push(e);
    return acc;
  }, {});

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function goPrevMonth() {
    setCursor(new Date(year, month - 1, 1));
  }
  function goNextMonth() {
    setCursor(new Date(year, month + 1, 1));
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-medium text-slate-700">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={goNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-xs font-medium text-slate-400 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const key = toDateKey(year, month, day);
          const dayEvents = eventsByDate[key] || [];

          return (
            <div
              key={key}
              className="min-h-[80px] border border-slate-100 rounded-lg p-1.5 flex flex-col gap-1"
            >
              <span className="text-xs text-slate-500">{day}</span>
              {dayEvents.slice(0, 2).map((e) => (
                <span
                  key={e.id}
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate ${typeColor[e.type]}`}
                  title={e.title}
                >
                  {e.title}
                </span>
              ))}
              {dayEvents.length > 2 && (
                <span className="text-[10px] text-slate-400">+{dayEvents.length - 2} more</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
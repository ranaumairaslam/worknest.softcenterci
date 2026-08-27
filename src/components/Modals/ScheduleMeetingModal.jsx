import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ScheduleMeetingModal({
  open,
  teamMembers = [],
  meeting,
  onClose,
  onCreate,
  onSave,
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [link, setLink] = useState("");
  const [attendeeIds, setAttendeeIds] = useState([]);
  const [guestEmail, setGuestEmail] = useState("");
  const [guestEmails, setGuestEmails] = useState([]);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(meeting);

  useEffect(() => {
    if (!open) return;

    if (meeting) {
      setTitle(meeting.title ?? "");
      setDate(meeting.date ?? "");

      setTime(
        meeting.time && meeting.time !== "TBD"
          ? meeting.time
          : ""
      );

      setLink(meeting.link ?? "");

      const attendees = Array.isArray(meeting.attendees)
        ? meeting.attendees
        : [];

      const ids = teamMembers
        .filter((member) =>
          attendees.includes(member.name)
        )
        .map((member) => member.id);

      setAttendeeIds(ids);

      setGuestEmails(
        Array.isArray(meeting.guests)
          ? meeting.guests
          : []
      );
    } else {
      setTitle("");
      setDate("");
      setTime("");
      setLink("");
      setAttendeeIds([]);
      setGuestEmails([]);
    }

    setGuestEmail("");
    setErrors({});
  }, [open, meeting, teamMembers]);

  if (!open) return null;

  function toggleAttendee(id) {
    setAttendeeIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  function addGuestEmail() {
    const email = guestEmail.trim();

    if (!email) return;

    if (!isValidEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        guestEmail: "Enter a valid email address.",
      }));
      return;
    }

    if (guestEmails.includes(email)) {
      setErrors((prev) => ({
        ...prev,
        guestEmail: "This email is already added.",
      }));
      return;
    }

    setGuestEmails((prev) => [
      ...prev,
      email,
    ]);

    setGuestEmail("");

    setErrors((prev) => ({
      ...prev,
      guestEmail: undefined,
    }));
  }

  function removeGuestEmail(email) {
    setGuestEmails((prev) =>
      prev.filter((item) => item !== email)
    );
  }

  function handleGuestKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addGuestEmail();
    }
  }

  function validate() {
    const next = {};

    if (!title.trim()) {
      next.title = "Meeting title is required.";
    }

    if (!date) {
      next.date = "Please pick a date.";
    }

    if (
      attendeeIds.length === 0 &&
      guestEmails.length === 0
    ) {
      next.attendees =
        "Add at least one attendee or guest.";
    }

    if (
      link.trim() &&
      !/^https?:\/\/.+/.test(link.trim())
    ) {
      next.link =
        "Link must start with http:// or https://";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const names = teamMembers
      .filter((member) =>
        attendeeIds.includes(member.id)
      )
      .map((member) => member.name);

    const payload = {
      title: title.trim(),
      date,
      time: time || "TBD",
      attendees: names,
      guests: guestEmails,
      link: link.trim(),
    };

    if (isEditing) {
      onSave?.(meeting.id, payload);
    } else {
      onCreate?.(payload);
    }

    onClose?.();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800">
            {isEditing
              ? "Edit Meeting"
              : "Schedule Meeting"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3"
        >

          {/* TITLE */}
          <div>
            <label
              htmlFor="mt-title"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Title
            </label>

            <input
              id="mt-title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Sprint Review"
              className={
                errors.title
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />

            {errors.title && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-2 gap-3">

            <div>
              <label
                htmlFor="mt-date"
                className="text-xs font-medium text-slate-500 block mb-1"
              >
                Date
              </label>

              <input
                id="mt-date"
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className={
                  errors.date
                    ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                }
              />

              {errors.date && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.date}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mt-time"
                className="text-xs font-medium text-slate-500 block mb-1"
              >
                Time
              </label>

              <input
                id="mt-time"
                type="time"
                value={time}
                onChange={(e) =>
                  setTime(e.target.value)
                }
                className="w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

          </div>

          {/* MEETING LINK */}
          <div>
            <label
              htmlFor="mt-link"
              className="text-xs font-medium text-slate-500 block mb-1"
            >
              Meeting Link
            </label>

            <input
              id="mt-link"
              type="url"
              value={link}
              onChange={(e) =>
                setLink(e.target.value)
              }
              placeholder="https://meet.example.com/..."
              className={
                errors.link
                  ? "w-full border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  : "w-full border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              }
            />

            {errors.link && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.link}
              </p>
            )}
          </div>

          {/* TEAM MEMBERS */}
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Team Attendees
            </span>

            <div className="space-y-2 max-h-28 overflow-y-auto border border-slate-100 rounded-lg p-2">

              {teamMembers.length === 0 ? (
                <p className="text-xs text-slate-400 px-1 py-1">
                  No team members available.
                </p>
              ) : (
                teamMembers.map((member) => (
                  <label
                    key={member.id}
                    className="flex items-center gap-2 text-sm text-slate-700 px-1 py-1 rounded-md hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={attendeeIds.includes(
                        member.id
                      )}
                      onChange={() =>
                        toggleAttendee(member.id)
                      }
                      className="rounded border-slate-300"
                    />

                    {member.name}
                  </label>
                ))
              )}

            </div>
          </div>

          {/* GUEST EMAILS */}
          <div>
            <span className="text-xs font-medium text-slate-500 block mb-2">
              Invite Company / External Guests
            </span>

            <div className="flex gap-2">

              <input
                type="email"
                value={guestEmail}
                onChange={(e) => {
                  setGuestEmail(e.target.value);

                  if (errors.guestEmail) {
                    setErrors((prev) => ({
                      ...prev,
                      guestEmail: undefined,
                    }));
                  }
                }}
                onKeyDown={handleGuestKeyDown}
                placeholder="client@company.com"
                className={
                  errors.guestEmail
                    ? "flex-1 border border-rose-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    : "flex-1 border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                }
              />

              <button
                type="button"
                onClick={addGuestEmail}
                className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Add guest email"
              >
                <Plus size={16} />
              </button>

            </div>

            {errors.guestEmail && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.guestEmail}
              </p>
            )}

            {guestEmails.length > 0 && (
              <ul className="mt-2 space-y-1">
                {guestEmails.map((email) => (
                  <li
                    key={email}
                    className="flex items-center justify-between bg-slate-50 rounded-md px-2 py-1 text-xs text-slate-600"
                  >
                    <span>{email}</span>

                    <button
                      type="button"
                      onClick={() =>
                        removeGuestEmail(email)
                      }
                      aria-label={`Remove ${email}`}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {errors.attendees && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.attendees}
              </p>
            )}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg mt-2"
          >
            {isEditing
              ? "Save Changes"
              : "Schedule Meeting"}
          </button>

        </form>
      </div>
    </div>
  );
}
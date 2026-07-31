import { useState } from "react";

import UpcomingMeetings from "../components/client/UpcomingMeetings";
import MeetingDetailsModal from "../components/client/MeetingDetailsModal";

import { upcomingMeetings } from "../data/clientDashboardData";

export default function Meetings() {
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Meetings
        </h1>

        <p className="mt-2 text-slate-500">
          View all your upcoming project meetings and schedules.
        </p>
      </div>

      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#016472] to-cyan-600 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Upcoming Meetings
        </h2>

        <p className="mt-2 text-cyan-100">
          You have{" "}
          <span className="font-semibold">
            {upcomingMeetings.length}
          </span>{" "}
          scheduled meeting(s). Stay updated and join on time.
        </p>
      </div>

      <UpcomingMeetings
        meetings={upcomingMeetings}
        onJoinMeeting={setSelectedMeeting}
      />

      <MeetingDetailsModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />

    </div>
  );
}
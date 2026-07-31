import { useState } from "react";
import { Plus } from "lucide-react";
import MeetingsList from "../components/Meetings/MeetingsList";
import ScheduleMeetingModal from "../components/Modals/ScheduleMeetingModal";
import { useMeetings } from "../hooks/useMeetings";
import { useProjectLeaderData } from "../hooks/useProjectLeaderData";

export default function Meetings() {
  const { meetings, loading, error, addMeeting, editMeeting, removeMeeting } = useMeetings();
  const { teamMembers } = useProjectLeaderData();

  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);

  if (loading) return <div className="p-6 text-slate-500 text-sm">Loading meetings…</div>;
  if (error) return <div className="p-6 text-rose-500 text-sm">Failed to load meetings.</div>;

  function openCreate() {
    setEditingMeeting(null);
    setShowModal(true);
  }

  function openEdit(meeting) {
    setEditingMeeting(meeting);
    setShowModal(true);
  }

  function handleCancel(meeting) {
    const ok = window.confirm(`Cancel "${meeting.title}"? This can't be undone.`);
    if (ok) removeMeeting(meeting.id);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Meetings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Schedule and manage meetings with your team.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
        >
          <Plus size={14} /> Schedule Meeting
        </button>
      </div>

      <MeetingsList
        meetings={meetings}
        canManage
        onEdit={openEdit}
        onCancel={handleCancel}
      />

      <ScheduleMeetingModal
        open={showModal}
        teamMembers={teamMembers}
        meeting={editingMeeting}
        onClose={() => setShowModal(false)}
        onCreate={addMeeting}
        onSave={editMeeting}
      />
    </div>
  );
}
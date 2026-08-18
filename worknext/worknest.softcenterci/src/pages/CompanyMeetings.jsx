import { useMemo, useState } from "react";
import { Search, Plus, Edit3, Trash2, XCircle, UserPlus } from "lucide-react";

import { useMeetings } from "../hooks/useMeetings";
import { useProjects } from "../hooks/useProjects";
import MeetingModal from "../components/Modals/MeetingModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";
import { useTeams } from "../hooks/useTeams";
import { useClients } from "../hooks/useClients";
import { useEmployees } from "../hooks/useEmployees";

export default function CompanyMeetings() {
  const {
    meetings,
    loading,
    error,
    addMeeting,
    editMeeting,
    removeMeeting,
    cancelMeetingById,
    inviteToMeeting,
  } = useMeetings();
  const { projects } = useProjects();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const { teams } = useTeams();
const { clients } = useClients();
const { employees } = useEmployees();

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const matchesSearch =
        meeting.title.toLowerCase().includes(search.toLowerCase()) ||
        meeting.project.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "All" || meeting.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [meetings, search, typeFilter]);

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleSubmit = async (meeting) => {
    try {
      if (selectedMeeting) {
        await editMeeting(selectedMeeting.id, meeting);
        showSuccess("Meeting updated successfully.");
      } else {
        await addMeeting(meeting);
        showSuccess("Meeting scheduled successfully.");
      }
      setShowModal(false);
      setSelectedMeeting(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = async (meeting) => {
    await cancelMeetingById(meeting.id);
    showSuccess("Meeting cancelled.");
  };

  const handleInvite = async (meeting) => {
    const name = prompt("Enter participant name to invite:");
    if (name) {
      await inviteToMeeting(meeting.id, [name]);
      showSuccess(`${name} invited to meeting.`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeMeeting(deleteItem.id);
      showSuccess("Meeting deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading meetings...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-500">Failed to load meetings.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Meeting Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Schedule team and client meetings, invite participants, and manage schedules.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setSelectedMeeting(null); setShowModal(true); }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 text-sm font-semibold text-white hover:bg-[#014b55]"
          >
            <Plus size={16} />
            Schedule Meeting
          </button>
        </div>
      </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Meetings</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{meetings.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Scheduled</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {meetings.filter((m) => m.status === "Scheduled").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Team Meetings</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {meetings.filter((m) => m.type === "Team").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Client Meetings</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {meetings.filter((m) => m.type === "Client").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <p className="text-sm font-medium text-slate-500">
    Leaders Meetings
  </p>

  <p className="mt-4 text-3xl font-semibold text-slate-900">
    {meetings.filter((m) => m.type === "Leaders").length}
  </p>
</div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
  value={typeFilter}
  onChange={(e) => setTypeFilter(e.target.value)}
  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
>
  <option>All</option>
  <option>Team</option>
  <option>Client</option>
  <option>Leaders</option>
</select>
        </div>
        

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMeetings.length === 0 ? (
            <p className="col-span-full py-8 text-center text-slate-500">No meetings found.</p>
          ) : (
            filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      meeting.type === "Client" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {meeting.type}
                    </span>
                    <h3 className="mt-2 font-semibold text-slate-900">{meeting.title}</h3>
                    <p className="text-sm text-slate-500">{meeting.project}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    meeting.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {meeting.status}
                  </span>
                </div>
                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>{meeting.date} at {meeting.time}</p>
                  <p>{meeting.platform}</p>
                  <p className="text-xs text-slate-400">
                    {meeting.participants?.length || 0} participants
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedMeeting(meeting); setShowModal(true); }}
                    className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  {meeting.status === "Scheduled" && (
                    <button
                      onClick={() => handleCancel(meeting)}
                      className="rounded-lg bg-orange-100 p-2 text-orange-600 hover:bg-orange-200"
                      title="Cancel"
                    >
                      <XCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleInvite(meeting)}
                    className="rounded-lg bg-green-100 p-2 text-green-600 hover:bg-green-200"
                    title="Invite"
                  >
                    <UserPlus size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteItem(meeting)}
                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MeetingModal
       open={showModal}
  meeting={selectedMeeting}
  projects={projects}
  teams={teams}
  clients={clients}
  leaders={employees.filter(
    (employee) => employee.role === "Project Leader"
  )}

        onClose={() => { setShowModal(false); setSelectedMeeting(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Meeting"
        message={`Are you sure you want to delete "${deleteItem?.title}"?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />
    </div>
  );
}

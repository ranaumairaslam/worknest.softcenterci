import { useState } from "react";
import TeamOverview from "./Teamoverviews";
import TeamDetails from "./TeamDetails";
import TeamModal from "../Modals/TeamModal";
import TeamDetailsModal from "../Modals/TeamDetailsModal";
import ConfirmationModal from "../Modals/ConfirmationModal";
import SuccessToast from "../Modals/SuccessToast";
import { useTeams } from "../../hooks/useTeams";
import { useEmployees } from "../../hooks/useEmployees";


export default function TeamMangement() {
  const { teams, loading, error, addTeam, removeTeam, assignMember } = useTeams();
  const { employees } = useEmployees();

  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [viewTeam, setViewTeam] = useState(null);
  const [assignTeam, setAssignTeam] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleOpenNew = () => {
    setShowModal(true);
  };

  const handleViewDetails = (team) => {
    setViewTeam(team);
  };

  const handleSubmit = async (team) => {
    try {
      await addTeam(team);
      showSuccess("Team created successfully.");
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenAssign = (team) => {
    setAssignTeam(team);
    setSelectedEmployeeId("");
    setShowAssignModal(true);
  };

  const handleAssignEmployee = async () => {
    if (!assignTeam || !selectedEmployeeId) return;
    try {
      await assignMember(assignTeam.id, selectedEmployeeId);
      showSuccess("Employee assigned to team.");
      setShowAssignModal(false);
      setAssignTeam(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeTeam(deleteItem.id);
      showSuccess("Team deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  return (
    <div className="w-full space-y-8 px-4 py-6">
      <TeamOverview teams={teams} employees={employees} loading={loading} error={error} onAddTeam={handleOpenNew} />
      <TeamDetails
        teams={teams}
        employees={employees}
        loading={loading}
        error={error}
        onView={handleViewDetails}
        onAssign={handleOpenAssign}
        onDelete={setDeleteItem}
      />
<TeamModal
    open={showModal}
    team={null}
    employees={employees}
    onClose={() => {
        setShowModal(false);
    }}
    onSubmit={handleSubmit}
/>
      <TeamDetailsModal
        open={!!viewTeam}
        team={teams.find((t) => t.id === viewTeam?.id) || viewTeam}
        employees={employees}
        onClose={() => setViewTeam(null)}
      />

      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Team"
        message={`Are you sure you want to delete ${deleteItem?.name}?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />

      {showAssignModal && assignTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900">Assign Employee to {assignTeam.name}</h2>
            <select
              className="mt-4 w-full rounded-lg border p-3 outline-none"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              <option value="">Select employee...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name} — {emp.role}</option>
              ))}
            </select>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowAssignModal(false)} className="rounded-lg border px-4 py-2">Cancel</button>
              <button onClick={handleAssignEmployee} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

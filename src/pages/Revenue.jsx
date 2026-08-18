import { useMemo, useState } from "react";
import { Search, Plus, Edit3, Trash2, DollarSign, TrendingUp } from "lucide-react";

import { useRevenue } from "../hooks/useRevenue";
import { useProjects } from "../hooks/useProjects";
import { useClients } from "../hooks/useClients";
import RevenueModal from "../components/Modals/RevenueModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";

export default function Revenue() {
  const { records, summary, loading, error, addRevenue, editRevenue, removeRevenue } = useRevenue();
  const { projects } = useProjects();
  const { clients } = useClients();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const filteredRecords = useMemo(() => {
    return records.filter((record) =>
      record.projectName.toLowerCase().includes(search.toLowerCase()) ||
      record.client.toLowerCase().includes(search.toLowerCase())
    );
  }, [records, search]);

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleSubmit = async (record) => {
    try {
      if (selectedRecord) {
        await editRevenue(selectedRecord.id, record);
        showSuccess("Revenue updated successfully.");
      } else {
        await addRevenue(record);
        showSuccess("Revenue added successfully.");
      }
      setShowModal(false);
      setSelectedRecord(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeRevenue(deleteItem.id);
      showSuccess("Revenue record deleted.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading revenue data...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-500">Failed to load revenue data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Revenue Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Track project revenue and total company earnings.
          </p>
        </div>
        <button
          onClick={() => { setSelectedRecord(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus size={16} />
          Add Revenue
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
              <DollarSign className="text-emerald-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Company Revenue</p>
              <p className="text-3xl font-bold text-slate-900">
                ${((summary?.totalRevenue || 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <TrendingUp className="text-blue-600" size={22} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Revenue Records</p>
              <p className="text-3xl font-bold text-slate-900">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Received</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {records.filter((r) => r.status === "Received").length}
          </p>
          <p className="text-xs text-slate-400">Pending: {records.filter((r) => r.status === "Pending").length}</p>
        </div>
      </div>

      {summary?.revenuePerProject && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Revenue per Project</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summary.revenuePerProject.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                <p className="text-sm font-medium text-slate-700">{item.name}</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">
                  ${(item.value / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
          <input
            type="text"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none"
            placeholder="Search revenue records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3">Project</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">No revenue records found.</td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="border-t border-slate-100">
                    <td className="py-4 font-medium text-slate-700">{record.projectName}</td>
                    <td className="py-4 text-slate-500">{record.client}</td>
                    <td className="py-4 font-semibold text-emerald-600">
                      ${record.amount.toLocaleString()}
                    </td>
                    <td className="py-4 text-slate-500">{record.date}</td>
                    <td className="py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        record.status === "Received" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedRecord(record); setShowModal(true); }}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(record)}
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RevenueModal
        open={showModal}
        record={selectedRecord}
        projects={projects}
        clients={clients}
        onClose={() => { setShowModal(false); setSelectedRecord(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Revenue Record"
        message={`Delete revenue record for ${deleteItem?.projectName}?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />
    </div>
  );
}

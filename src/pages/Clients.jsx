import { useMemo, useState } from "react";
import { Search, Plus, Edit3, Trash2, Eye } from "lucide-react";

import { useClients } from "../hooks/useClients";
import ClientModal from "../components/Modals/ClientModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";

export default function Clients() {
  const { clients, loading, error, addClient, editClient, removeClient } = useClients();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewClient, setViewClient] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.contact.toLowerCase().includes(search.toLowerCase()) ||
        client.industry.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleSubmit = async (client) => {
    try {
      if (selectedClient) {
        await editClient(selectedClient.id, client);
        showSuccess("Client updated successfully.");
      } else {
        await addClient(client);
        showSuccess("Client added successfully.");
      }
      setShowModal(false);
      setSelectedClient(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeClient(deleteItem.id);
      showSuccess("Client deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading clients...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-rose-500">Failed to load clients.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Client Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add, edit, and manage all company clients.
          </p>
        </div>
        <button
          onClick={() => { setSelectedClient(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 text-sm font-semibold text-white hover:bg-[#014b55]"
        >
          <Plus size={16} />
          Add Client
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Clients</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{clients.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Active</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {clients.filter((c) => c.status === "Active").length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Projects</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {clients.reduce((sum, c) => sum + (c.projects || 0), 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {clients.filter((c) => c.status === "Pending").length}
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
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-3">Company</th>
                <th className="pb-3">Contact</th>
                <th className="pb-3">Industry</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Projects</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">No clients found.</td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-t border-slate-100">
                    <td className="py-4 font-medium text-slate-700">{client.name}</td>
                    <td className="py-4 text-slate-500">{client.contact}</td>
                    <td className="py-4 text-slate-500">{client.industry}</td>
                    <td className="py-4 text-slate-500">{client.owner}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{client.projects}</td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setViewClient(client)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => { setSelectedClient(client); setShowModal(true); }}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(client)}
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

      {viewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900">{viewClient.name}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
              <div><p className="text-slate-400">Contact</p><p className="font-medium">{viewClient.contact}</p></div>
              <div><p className="text-slate-400">Industry</p><p className="font-medium">{viewClient.industry}</p></div>
              <div><p className="text-slate-400">Owner</p><p className="font-medium">{viewClient.owner}</p></div>
              <div><p className="text-slate-400">Location</p><p className="font-medium">{viewClient.location}</p></div>
              <div><p className="text-slate-400">Size</p><p className="font-medium">{viewClient.size}</p></div>
              <div><p className="text-slate-400">Revenue</p><p className="font-medium">{viewClient.revenue}</p></div>
              <div><p className="text-slate-400">Projects</p><p className="font-medium">{viewClient.projects}</p></div>
              <div><p className="text-slate-400">Last Contact</p><p className="font-medium">{viewClient.lastContact}</p></div>
            </div>
            <button
              onClick={() => setViewClient(null)}
              className="mt-6 rounded-lg bg-[#016472] px-5 py-2 text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ClientModal
        open={showModal}
        client={selectedClient}
        onClose={() => { setShowModal(false); setSelectedClient(null); }}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Client"
        message={`Are you sure you want to delete ${deleteItem?.name}?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />
    </div>
  );
}

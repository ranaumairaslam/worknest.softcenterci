import { useMemo, useState } from "react";
import { Search, Plus, Edit3, Trash2, DollarSign } from "lucide-react";

import { useRevenue } from "../hooks/useRevenue";
import { useProjects } from "../hooks/useProjects";
import { useClients } from "../hooks/useClients";
import RevenueModal from "../components/Modals/RevenueModal";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import SuccessToast from "../components/Modals/SuccessToast";

export default function Revenue() {
  const {
    revenues = [],
    summary = { totalRevenue: 0, completedRevenue: 0, pendingRevenue: 0, totalEntries: 0 },
    loading,
    error,
    addRevenue,
    editRevenue,
    removeRevenue,
  } = useRevenue();

  const { projects = [] } = useProjects();
  const { clients = [] } = useClients();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });

  const filteredRevenues = useMemo(() => {
    if (!Array.isArray(revenues)) return [];
    return revenues.filter((revenue) => {
      const project = (revenue.project || "").toLowerCase();
      const client = (revenue.client || "").toLowerCase();
      const matchesSearch =
        project.includes(search.toLowerCase()) ||
        client.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || revenue.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [revenues, search, statusFilter]);

  const showSuccess = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleSubmit = async (revenue) => {
    try {
      if (selectedRevenue) {
        await editRevenue(selectedRevenue.id, revenue);
        showSuccess("Revenue updated successfully.");
      } else {
        await addRevenue(revenue);
        showSuccess("Revenue added successfully.");
      }
      setShowModal(false);
      setSelectedRevenue(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      await removeRevenue(deleteItem.id);
      showSuccess("Revenue deleted successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteItem(null);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-slate-500">Loading revenue...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-rose-500">
        Failed to load revenue data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Revenue Management
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Track project revenue, payments, and financial summaries.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedRevenue(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#016472] px-5 py-3 text-sm font-semibold text-white hover:bg-[#014b55]"
        >
          <Plus size={16} />
          Add Revenue
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <DollarSign className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ${Number(summary.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ${Number(summary.completedRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <DollarSign className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                ${Number(summary.pendingRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <DollarSign className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Entries</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {summary.totalEntries || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-4 text-slate-400"
              size={18}
            />
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 outline-none"
              placeholder="Search revenue..."
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
            <option>Pending</option>
            <option>Complete</option>
          </select>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
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
              {filteredRevenues.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-sm text-slate-500"
                  >
                    No revenue entries found. Click "Add Revenue" to create one.
                  </td>
                </tr>
              ) : (
                filteredRevenues.map((revenue) => (
                  <tr key={revenue.id} className="border-t border-slate-100">
                    <td className="py-4 font-medium text-slate-700">
                      {revenue.project || "N/A"}
                    </td>
                    <td className="py-4 text-slate-500">
                      {revenue.client || "N/A"}
                    </td>
                    <td className="py-4 font-semibold text-slate-900">
                      ${Number(revenue.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 text-slate-500">
                      {revenue.dateFormatted || revenue.date || "N/A"}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          revenue.status === "Complete"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {revenue.status || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRevenue(revenue);
                            setShowModal(true);
                          }}
                          className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteItem(revenue)}
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
        revenue={selectedRevenue}
        projects={projects}
        clients={clients}
        onClose={() => {
          setShowModal(false);
          setSelectedRevenue(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmationModal
        open={!!deleteItem}
        title="Delete Revenue"
        message={`Are you sure you want to delete this revenue entry?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast show={toast.show} message={toast.message} />
    </div>
  );
}
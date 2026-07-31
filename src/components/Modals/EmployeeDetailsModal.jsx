import { X, TrendingUp, Award } from "lucide-react";

export default function EmployeeDetailsModal({ open, employee, onClose }) {
  if (!open || !employee) return null;

  const performanceScore = employee.status === "Active" ? 85 + (employee.id?.length || 0) * 2 : 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Employee Details</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{employee.name}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Role</p>
            <p className="font-medium text-slate-800">{employee.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Team</p>
            <p className="font-medium text-slate-800">{employee.team}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Email</p>
            <p className="font-medium text-slate-800">{employee.email}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Status</p>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {employee.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-400">Joined</p>
            <p className="font-medium text-slate-800">{employee.joinedAt}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Phone</p>
            <p className="font-medium text-slate-800">{employee.phone || "N/A"}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[#016472]" size={18} />
            <h3 className="font-semibold text-slate-800">Performance Overview</h3>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#016472]/10">
              <Award className="text-[#016472]" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#016472]">{Math.min(performanceScore, 98)}%</p>
              <p className="text-sm text-slate-500">Overall performance score</p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-[#016472]"
              style={{ width: `${Math.min(performanceScore, 98)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  CalendarDays,
  FolderKanban,
  Users,
  Download,
} from "lucide-react";

export default function FilterBar() {
  return (
    <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">

        <div className="relative">
          <CalendarDays
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="date"
            className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-3 text-white outline-none focus:border-cyan-500"
          />
        </div>

        <select className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-cyan-500">
          <option>All Projects</option>
          <option>CRM</option>
          <option>ERP</option>
          <option>HRMS</option>
        </select>

        <div className="relative">
          <FolderKanban
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <select className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 text-white outline-none focus:border-cyan-500">
            <option>All Teams</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>QA</option>
            <option>UI/UX</option>
          </select>
        </div>

        <div className="relative">
          <Users
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <select className="w-full rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 text-white outline-none focus:border-cyan-500">
            <option>All Employees</option>
            <option>Ali</option>
            <option>Ahmed</option>
            <option>Hamza</option>
          </select>
        </div>

        <select className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-white outline-none focus:border-cyan-500">
          <option>All Status</option>
          <option>Completed</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Delayed</option>
        </select>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700">
          <Download size={18} />
          Generate
        </button>
      </div>
    </div>
  );
}
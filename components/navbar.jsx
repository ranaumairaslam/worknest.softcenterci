import React from "react";
import { Menu, Search, Bell } from "lucide-react";

export default function Navbar({
  role = "teamMember",
  onToggle,
}) {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      <button
        onClick={onToggle}
        className="rounded-xl p-2 transition hover:bg-slate-100"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-4">
        <Search size={24} />
        <Bell size={24} />
      </div>
    </header>
  );
}

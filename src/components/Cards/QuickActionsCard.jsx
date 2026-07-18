import React from "react";
import { Plus, Users2, UserPlus } from "lucide-react";

const actions = [
  { label: "New Project", icon: Plus },
  { label: "New Team", icon: Users2 },
  { label: "Invite User", icon: UserPlus },
];

export default function QuickActionsCard({ onAction }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-medium text-slate-700 mb-3">Quick Actions</p>
      <div className="space-y-2">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onAction?.(label)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 rounded-lg"
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
import { Plus, Users2, UserPlus, CheckSquare, CalendarDays, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { label: "New Project", icon: Plus, path: "/projects" },
  { label: "New Team", icon: Users2, path: "/team-management" },
  { label: "Add Employee", icon: UserPlus, path: "/employees" },
  { label: "Assign Task", icon: CheckSquare, path: "/company-tasks" },
  { label: "Schedule Meeting", icon: CalendarDays, path: "/company-meetings" },
  { label: "Add Revenue", icon: DollarSign, path: "/revenue" },
];

export default function QuickActionsCard({ onAction }) {
  const navigate = useNavigate();

  const handleClick = (action) => {
    onAction?.(action.label);
    if (action.path) navigate(action.path);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <p className="text-sm font-medium text-slate-700 mb-3">Quick Actions</p>
      <div className="space-y-2">
        {actions.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => handleClick({ label, path })}
            className="w-full flex items-center justify-center gap-2 bg-[#016472] hover:bg-[#014b55] transition-colors text-white text-sm font-medium py-2 rounded-lg"
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>
    </div>
  );
}

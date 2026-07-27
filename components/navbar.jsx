import { Menu, Search, Bell, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { roleConfig, getRoleFromPath } from "./navigation";

const iconButtonClass =
  "rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#016472]/30";

export default function Navbar({
  notificationcount = 5,
  showsearch = true,
  onToggle,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const role = getRoleFromPath(location.pathname);
  const currentRole = roleConfig[role];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white px-3 py-3 shadow-sm transition-all duration-300 ease-in-out sm:px-4 sm:py-4 md:px-6">
      <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
        {/* Left */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggle}
            className={iconButtonClass}
            aria-label="Toggle sidebar"
          >
            <Menu size={22} className="text-slate-700" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-wide text-slate-800 sm:text-lg md:text-xl lg:text-2xl">
              {currentRole.title}
            </h1>

            <p className="truncate text-xs text-slate-500 sm:text-sm">
              {currentRole.role}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3 lg:gap-4">
          {showsearch && (
            <div className="relative hidden sm:flex sm:max-w-[200px] md:max-w-xs lg:max-w-sm">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search..."
                aria-label="Search dashboard"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              />
            </div>
          )}

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-600" />

            {notificationcount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {notificationcount}
              </span>
            )}
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#016472] text-sm font-semibold text-white">
              {currentRole.userinitials}
            </div>

            <div className="hidden md:block">
              <p className="truncate text-sm font-semibold text-slate-800">
                {currentRole.username}
              </p>

              <p className="truncate text-xs text-slate-500">
                {currentRole.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-red-500 transition hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400/40"
          >
            <LogOut size={18} />

            <span className="hidden text-sm font-medium lg:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
import { Menu, Search, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconButtonClass =
  "rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#016472]/30";

export default function Navbar({
  title = "Company Dashboard",
  role = "superAdmin",
  username = "John Doe",
  userinitials = "JD",
  notificationcount = 5,
  showsearch = true,
  onToggle,
  
}) {
    const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white px-3 py-3 shadow-sm transition-all duration-300 ease-in-out sm:px-4 sm:py-4 md:px-6">
      <div className="flex min-w-0 items-center justify-between gap-2 sm:gap-4">
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
              {title}
            </h1>
            <p className="truncate text-xs text-slate-500 sm:text-sm">{role}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          {showsearch && (
            <div className="relative hidden min-w-0 flex-1 sm:flex sm:max-w-[200px] md:max-w-xs lg:max-w-sm">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search dashboard"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#016472]/30"
              />
            </div>
          )}

          <button
            type="button"
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white transition-all duration-300 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#016472]/30 sm:h-10 sm:w-10"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-slate-600" />

            {notificationcount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {notificationcount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#016472] text-xs font-semibold text-white sm:h-9 sm:w-9 md:h-10 md:w-10 md:text-sm">
              {userinitials}
            </div>

            <div className="hidden min-w-0 md:block">
              <p className="truncate text-sm font-semibold text-slate-800">
                {username}
              </p>
              <p className="truncate text-xs text-slate-500 sm:text-sm">{role}</p>
            </div>
          </div>

          <button
          onClick={() => navigate("/login")}

            type="button"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-red-50 px-2.5 py-2 text-red-500 transition-all duration-300 ease-in-out hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400/40 sm:px-3 sm:py-2.5 md:px-4"
            aria-label="Logout"
          >
            <LogOut size={18} />
            <span className="hidden text-sm font-medium lg:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

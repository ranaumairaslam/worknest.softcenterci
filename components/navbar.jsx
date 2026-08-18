import { Menu, Bell, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { roleConfig, getRoleFromPath } from "./navigation";
import { useNotifications } from "../src/hooks/useNotifications";
import { useProfile } from "./ProfileContext";
import { logout } from "../src/services/authService.js";

const iconButtonClass =
  "rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#016472]/30";

export default function Navbar({ onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { profile } = useProfile();
  const { unreadCount: notificationcount } = useNotifications();

 const role =
  location.pathname === "/settings"
    ? localStorage.getItem("userRole") || "superAdmin"
    : getRoleFromPath(location.pathname);

const currentRole = roleConfig[role] || roleConfig.superAdmin;

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
              {currentRole.title}
            </h1>

            <p className="truncate text-xs text-slate-500 sm:text-sm">
              {currentRole.role}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3 lg:gap-4">

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

          <div
            onClick={() =>
              navigate("/settings", {
                state: {
                  role,
                },
              })
            }
            className="flex cursor-pointer items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={profile.image || "https://ui-avatars.com/api/?name=User"}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-slate-200 object-cover"
              />

              <div className="hidden md:block">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {profile.fullName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {currentRole.role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
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
import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { navigation } from "./navigation";
import { logout } from "../src/services/authService.js";

const iconButtonBase =
  "rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#A3FEFF]/40";

const navItemBase =
  "group flex w-full items-center rounded-xl py-3 text-[#d8ffff] transition-all duration-300 ease-in-out hover:bg-[#016472] hover:text-white hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#A3FEFF]/40";

function SidebarNavItem({
  item,
  collapsed,
  showLabels,
  onNavigate,
}) {
  const Icon = item.icon;

  return (
    <li>
      <NavLink
        to={item.path}
        onClick={onNavigate}
        aria-label={item.title}
        className={({ isActive }) =>
          `${navItemBase} ${
            collapsed
              ? "lg:justify-center lg:px-2 lg:py-3"
              : "gap-4 px-4"
          } ${
            isActive
              ? "bg-[#016472] text-white shadow-lg"
              : ""
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              size={20}
              className={`shrink-0 ${
                isActive
                  ? "text-white"
                  : "text-[#A3FEFF] group-hover:text-white"
              }`}
            />

            {showLabels && (
              <span className="truncate">
                {item.title}
              </span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

export default function Sidebar({
  role,
  collapsed,
  mobileOpen,
  onClose,
  company = "WorkNest",
}) {
  const navigate = useNavigate();

  /*
   * IMPORTANT:
   * Role App.jsx se aa raha hai.
   *
   * Example:
   * superAdmin
   * companyAdmin
   * projectLeader
   * teamMember
   * client
   */
  const menu = navigation[role] || [];

  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/40
            transition-opacity duration-300
            ease-in-out
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          flex h-screen w-72 max-w-[85vw]
          flex-col justify-between
          border-r border-[#0d4f5b]
          bg-gradient-to-b
          from-[#000304]
          via-[#03181d]
          to-[#016472]
          text-white
          shadow-2xl
          transition-all duration-300
          ease-in-out
          lg:max-w-none
          lg:shadow-none
          overflow-y-auto

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }

          ${collapsed ? "lg:w-20" : "lg:w-72"}
        `}
      >

        {/* ============================= */}
        {/* TOP SECTION */}
        {/* ============================= */}

        <div
          className={`
            p-4 sm:p-6
            ${collapsed ? "lg:px-2" : ""}
          `}
        >

          {/* Mobile Close Button */}
          <div className="mb-4 flex justify-end lg:hidden">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className={iconButtonBase}
            >
              <X size={22} />
            </button>
          </div>

          {/* ============================= */}
          {/* LOGO */}
          {/* ============================= */}

          <div
            className={`
              mb-8
              flex items-center
              sm:mb-10

              ${
                collapsed
                  ? "lg:justify-center lg:gap-0"
                  : "gap-3 sm:gap-4"
              }
            `}
          >

            {/* Logo */}
            <div
              className="
                flex
                h-12 w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-lg
                sm:h-14 sm:w-14
              "
            >
              <img
                src="/Softcenteric-logo.png"
                alt="WorkNest Logo"
                className="
                  h-9 w-9
                  object-contain
                  sm:h-10 sm:w-10
                "
              />
            </div>

            {/* Brand Name */}
            {showLabels && (
              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-lg
                    font-bold
                    tracking-wide
                    text-white
                    sm:text-xl
                  "
                >
                  {company}
                </h2>

                <p
                  className="
                    truncate
                    text-xs
                    text-[#A3FEFF]
                  "
                >
                  Project Management
                </p>
              </div>
            )}
          </div>

          {/* ============================= */}
          {/* MAIN NAVIGATION */}
          {/* ============================= */}

          <ul className="space-y-2">
            {menu.map((item) => (
              <SidebarNavItem
                key={item.title}
                item={item}
                collapsed={collapsed}
                showLabels={showLabels}
                onNavigate={onClose}
              />
            ))}
          </ul>
        </div>

        {/* ============================= */}
        {/* BOTTOM SECTION */}
        {/* ============================= */}

        <div
          className={`
            space-y-2
            border-t
            border-[#0b4c56]
            p-4
            sm:p-5

            ${collapsed ? "lg:px-2" : ""}
          `}
        >

          {/* ============================= */}
          {/* SETTINGS */}
          {/* ============================= */}

          <NavLink
            to="/settings"
            state={{ role }}
            onClick={onClose}
            aria-label="Settings"
            className={({ isActive }) =>
              `${navItemBase} ${
                collapsed
                  ? "lg:justify-center lg:gap-0 lg:px-2"
                  : "gap-4 px-4"
              } ${
                isActive
                  ? "bg-[#016472] text-white shadow-lg"
                  : "text-[#A3FEFF]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  size={20}
                  className={`
                    shrink-0
                    ${
                      isActive
                        ? "text-white"
                        : "text-[#A3FEFF] group-hover:text-white"
                    }
                  `}
                />

                {showLabels && (
                  <span>
                    Settings
                  </span>
                )}
              </>
            )}
          </NavLink>

          {/* ============================= */}
          {/* LOGOUT */}
          {/* ============================= */}

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            aria-label="Logout"
            className={`
              group
              relative
              flex
              w-full
              items-center
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/5
              py-3.5
              text-red-400
              transition-all
              duration-300
              ease-in-out

              hover:border-red-500/40
              hover:bg-red-500/15
              hover:text-red-300
              hover:shadow-lg
              hover:shadow-red-500/10

              active:scale-95

              focus:outline-none
              focus:ring-2
              focus:ring-red-400/40

              ${
                collapsed
                  ? "lg:justify-center lg:px-2"
                  : "gap-4 px-4"
              }
            `}
          >
            <LogOut
              size={20}
              className="
                shrink-0
                transition-transform
                duration-300
                ease-in-out
                group-hover:translate-x-1
              "
            />

            {showLabels && (
              <>
                <span
                  className="
                    font-medium
                    tracking-wide
                  "
                >
                  Logout
                </span>

                <div
                  className="
                    ml-auto
                    opacity-0
                    transition-opacity
                    duration-300
                    ease-in-out
                    group-hover:opacity-100
                  "
                >
                  →
                </div>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
} 
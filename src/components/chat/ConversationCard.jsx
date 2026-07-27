import { CheckCheck, User } from "lucide-react";

export default function ConversationCard({
  chat,
  active,
  onClick,
}) {
  return (
    <button
      onClick={() => onClick(chat)}
      className={`w-full border-b border-slate-100 p-4 text-left transition-all duration-200 ${
        active
          ? "bg-[#016472] text-white"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {chat.avatar ? (
            <img
              src={chat.avatar}
              alt={chat.name}
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                active
                  ? "bg-white/20"
                  : "bg-slate-200"
              }`}
            >
              <User
                size={26}
                className={
                  active
                    ? "text-white"
                    : "text-slate-600"
                }
              />
            </div>
          )}

          {/* Online Status */}
          <span
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${
              chat.online
                ? "bg-green-500"
                : "bg-slate-400"
            }`}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + Time */}
          <div className="flex items-center justify-between">
            <h3 className="truncate font-semibold">
              {chat.name}
            </h3>

            <span
              className={`text-xs ${
                active
                  ? "text-cyan-100"
                  : "text-slate-500"
              }`}
            >
              {chat.time}
            </span>
          </div>

          {/* Role */}
          <p
            className={`mt-1 text-xs ${
              active
                ? "text-cyan-100"
                : "text-slate-500"
            }`}
          >
            {chat.role}
          </p>

          {/* Project */}
          <p
            className={`text-xs font-medium ${
              active
                ? "text-cyan-200"
                : "text-[#016472]"
            }`}
          >
            {chat.project}
          </p>

          {/* Last Message */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {chat.seen && (
                <CheckCheck
                  size={15}
                  className={
                    active
                      ? "text-cyan-100"
                      : "text-blue-500"
                  }
                />
              )}

              <p
                className={`truncate text-sm ${
                  active
                    ? "text-white"
                    : "text-slate-600"
                }`}
              >
                {chat.lastMessage}
              </p>
            </div>

            {chat.unread > 0 && (
              <span className="flex h-6 min-w-[24px] items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                {chat.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
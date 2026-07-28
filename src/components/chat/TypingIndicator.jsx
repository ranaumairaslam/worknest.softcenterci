export default function TypingIndicator({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-end gap-3 px-6 py-3">

      {/* Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600">
        {user.name.charAt(0).toUpperCase()}
      </div>

      <div>

        <p className="mb-2 text-xs font-medium text-slate-500">
          {user.name} is typing...
        </p>

        <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">

          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "0.2s" }}
          ></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "0.4s" }}
          ></span>

        </div>

      </div>

    </div>
  );
}
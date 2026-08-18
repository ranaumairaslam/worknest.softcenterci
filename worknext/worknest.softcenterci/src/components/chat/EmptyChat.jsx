import { MessageSquareMore } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex h-full items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md text-center">

        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100">
          <MessageSquareMore
            size={42}
            className="text-[#016472]"
          />
        </div>

        {/* Title */}
        <h2 className="mt-6 text-2xl font-bold text-slate-800">
          Welcome to WorkNest Chat
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm leading-7 text-slate-500">
          Select a conversation from the left sidebar to start
          collaborating with your team, project leaders, clients,
          and company administrators.
        </p>

        {/* Tips */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-700">
            You can:
          </h3>

          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Discuss project progress</li>
            <li>• Share files and updates</li>
            <li>• Coordinate tasks with your team</li>
            <li>• Stay connected in real time</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
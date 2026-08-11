import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  User,
} from "lucide-react";

export default function ChatHeader({
  selectedChat,
  onBack,
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">

      
      <div className="flex items-center gap-4">

       
        <button
          onClick={onBack}
          className="rounded-lg p-2 transition hover:bg-slate-100 md:hidden"
        >
          <ArrowLeft size={20} />
        </button>

      
        <div className="relative">

          {selectedChat.avatar ? (
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200">
              <User size={24} className="text-slate-600" />
            </div>
          )}

          <span
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
              selectedChat.online
                ? "bg-green-500"
                : "bg-slate-400"
            }`}
          />

        </div>

        
        <div>

          <h2 className="text-lg font-semibold text-slate-800">
            {selectedChat.name}
          </h2>

          <p className="text-sm text-slate-500">
            {selectedChat.role}
          </p>

          <p className="text-xs font-medium text-[#016472]">
            {selectedChat.project}
          </p>

        </div>

      </div>

    
      <div className="flex items-center gap-2">

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Phone
            size={20}
            className="text-slate-600"
          />
        </button>

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <Video
            size={20}
            className="text-slate-600"
          />
        </button>

        <button className="rounded-xl p-2 transition hover:bg-slate-100">
          <MoreVertical
            size={20}
            className="text-slate-600"
          />
        </button>

      </div>

    </div>
  );
}
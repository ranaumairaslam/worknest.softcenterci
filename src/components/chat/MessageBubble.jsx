import MessageStatus from "./MessageStatus";
export default function MessageBubble({ message }) {
  const isMe = message.sender === "me";

  return (
    <div
      className={`mb-4 flex ${
        isMe ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
          ${
            isMe
              ? "rounded-br-md bg-[#016472] text-white"
              : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
          }
        `}
      >
        {/* Message */}
        <p className="whitespace-pre-wrap break-words text-sm leading-6">
          {message.text}
        </p>

        {/* Footer */}
        <div
          className={`mt-2 flex items-center justify-end gap-1 text-xs ${
            isMe ? "text-cyan-100" : "text-slate-400"
          }`}
        >
          <span>{message.time}</span>

          {isMe && (
  <MessageStatus
    status={message.status}
  />
)}
        </div>
      </div>
    </div>
  );
}
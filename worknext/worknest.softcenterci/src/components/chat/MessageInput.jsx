import {
  Paperclip,
  SendHorizontal,
} from "lucide-react";

import AttachmentPreview from "./AttachmentPreview";
import { useRef, useState } from "react";
export default function MessageInput({
  selectedChat,
  onSend,
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
  if (!message.trim()) return;

  onSend(message);

  setMessage("");
  setFile(null);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white p-4">

      {/* Attachment Preview */}
      <AttachmentPreview
        file={file}
        onRemove={() => setFile(null)}
      />

      {/* Hidden File Input */}
    <input
  ref={fileInputRef}
  type="file"
  hidden
  onChange={(e) => {
    console.log("Selected:", e.target.files);

    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  }}
/>

      <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">

        {/* Attachment Button */}
        <button
  type="button"
  onClick={() => {
    console.log("Paperclip Clicked");
    fileInputRef.current?.click();
  }}
  className="rounded-lg p-2 transition hover:bg-slate-200"
>
  <Paperclip
    size={20}
    className="text-slate-500"
  />
</button>
        {/* Message Input */}
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="max-h-32 flex-1 resize-none bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() && !file}
          className={`rounded-xl p-3 transition ${
            message.trim() || file
              ? "bg-[#016472] text-white hover:bg-[#01515c]"
              : "cursor-not-allowed bg-slate-200 text-slate-400"
          }`}
        >
          <SendHorizontal size={18} />
        </button>

      </div>
    </div>
  );
}
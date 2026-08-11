import ChatLayout from "../components/chat/ChatLayout";

export default function Chat() {
  return (
    <div className="h-[calc(100vh-90px)] overflow-hidden rounded-2xl bg-white shadow-sm">
      <ChatLayout />
    </div>
  );
}
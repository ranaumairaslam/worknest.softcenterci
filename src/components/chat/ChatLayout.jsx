import { useState } from "react";
import ConversationSidebar from "./ConversationSidebar";
import ChatWindow from "./ChatWindow";
import { messages as initialMessages } from "../../data/messages";

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState(null);


  const [chatMessages, setChatMessages] = useState(initialMessages);

  const handleSendMessage = (text) => {
    if (!selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      status: "sending",
    };

    // Show message instantly
    setChatMessages((prev) => ({
      ...prev,
      [selectedChat.id]: [
        ...(prev[selectedChat.id] || []),
        newMessage,
      ],
    }));

    // Demo: After 1 second change status to sent
    setTimeout(() => {
      setChatMessages((prev) => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id].map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: "sent" }
            : msg
        ),
      }));
    }, 1000);
  };

  return (
    <div className="flex h-full overflow-hidden rounded-xl bg-white">

      {/* Conversation Sidebar */}
      <div
        className={`
          border-r border-slate-200
          w-full md:w-80 lg:w-96
          ${selectedChat ? "hidden md:block" : "block"}
        `}
      >
        <ConversationSidebar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>

      {/* Chat Window */}
      <div
        className={`
          flex-1
          ${selectedChat ? "block" : "hidden md:block"}
        `}
      >
        <ChatWindow
          selectedChat={selectedChat}
          onBack={() => setSelectedChat(null)}
          chatMessages={chatMessages}
          onSend={handleSendMessage}
        />
      </div>

    </div>
  );
}
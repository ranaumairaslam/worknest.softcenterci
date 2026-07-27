import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyChat from "./EmptyChat";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({
  selectedChat,
  onBack,
  chatMessages,
  onSend,
}) {
  if (!selectedChat) {
    return <EmptyChat />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">


      <ChatHeader
        selectedChat={selectedChat}
        onBack={onBack}
      />

      
      <div className="flex-1 overflow-hidden">
        <MessageList
  selectedChat={selectedChat}
  chatMessages={chatMessages}
/>
      </div>
      <TypingIndicator user={selectedChat} />

      
     <MessageInput
  selectedChat={selectedChat}
  onSend={onSend}
/>
    </div>
  );
}
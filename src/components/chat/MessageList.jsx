import { useEffect, useRef } from "react";
import { messages } from "../../data/messages";

import MessageBubble from "./MessageBubble";
import DateSeparator from "./DateSeparator";

export default function MessageList({
  selectedChat,
  chatMessages,
}) {
  const bottomRef = useRef(null);

const messagesList =
  chatMessages?.[selectedChat?.id] || [];


  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
 }, [selectedChat, chatMessages]);

  let lastDate = "";

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6">
      {messagesList.map((message) => {
        const showDate = message.date !== lastDate;

        if (showDate) {
          lastDate = message.date;
        }

        return (
          <div key={message.id}>
            {showDate && (
              <DateSeparator label={message.date} />
            )}

            <MessageBubble message={message} />
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
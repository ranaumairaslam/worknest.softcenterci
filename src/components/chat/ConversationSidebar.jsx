import { useMemo, useState } from "react";

import { conversations } from "../../data/conversations";

import SearchBar from "./SearchBar";
import ConversationCard from "./ConversationCard";
import NoSearchResult from "./NoSearchResult";

export default function ConversationSidebar({
  selectedChat,
  setSelectedChat,
}) {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return conversations;

    return conversations.filter((chat) => {
      return (
        chat.name.toLowerCase().includes(keyword) ||
        chat.role.toLowerCase().includes(keyword) ||
        chat.project.toLowerCase().includes(keyword) ||
        chat.lastMessage.toLowerCase().includes(keyword)
      );
    });
  }, [search]);

  return (
    <div className="flex h-full flex-col bg-white">

      {/* Header */}
      <div className="border-b border-slate-200 p-5">

        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          Chats
        </h2>

        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setSearch("")}
        />

      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">

        {filteredConversations.length > 0 ? (
          filteredConversations.map((chat) => (
            <ConversationCard
              key={chat.id}
              chat={chat}
              active={selectedChat?.id === chat.id}
              onClick={setSelectedChat}
            />
          ))
        ) : (
          <NoSearchResult />
        )}

      </div>

    </div>
  );
}
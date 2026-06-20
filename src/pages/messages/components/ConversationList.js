import { useConversations } from "../hooks/useConversations";
import ConversationItem from "../components/ConversationItem";
import { IoSearchOutline } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function ConversationList() {
  const {
    conversations,
    pagination,
    isLoading,
    isError,
    isSearching,
    searchTerm,
    handleSearch,
    loadMore,
  } = useConversations();
  console.log(
    " from ConversationList isError",
    isError,
    "isLoading",
    isLoading,
  );

  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue.trim());
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      pagination.hasMore &&
      !isLoading
    ) {
      loadMore();
    }
  };

  return (
    <>
      <form className="dc-formtheme dc-formsearch" onSubmit={onSubmit}>
        <fieldset>
          <div className="form-group">
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search Here"
              // value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="dc-searchgbtn"
              disabled={isSearching}
            >
              <IoSearchOutline />
            </button>
          </div>
        </fieldset>
      </form>

      <div
        className="dc-verticalscrollbar dc-dashboardscrollbar patient-messages-list"
        onScroll={handleScroll}
      >
        {isLoading && conversations.length === 0 ? (
          <div className="dc-loading">Loading...</div>
        ) : isError ? (
          <div className="dc-error">There was an error</div>
        ) : conversations.length === 0 ? (
          <div className="dc-empty">No conversations</div>
        ) : (
          conversations.map((chat) => (
            <ConversationItem
              key={chat.chatId}
              id={chat.chatId}
              img={chat.patientAvatar || "/images/avt/patient-avt.png"}
              name={chat.patientName.trim() || "patient un name"}
              lastMsg={chat?.lastMessage || "No messages yet"}
              isOnline={chat.isOnline}
              lastSeen={chat.lastSeen}
              lastMessageTime={chat.lastMessageTime}
              lastMessageIsMine={chat.lastMessageIsMine}
              messeagesDotNotification={
                chat.unreadCount > 0 ? chat.unreadCount : undefined
              }
              status={chat.status}
              isLastMessageRead={chat.isLastMessageRead}
            />
          ))
        )}

        {isLoading && conversations.length > 0 && (
          <div className="dc-loading-more">Loading...</div>
        )}
      </div>
    </>
  );
}

import { formatChatDate, isSameDay } from "../../shared/utils";
import { useConversations } from "../hooks/useConversations";
import ChatMessage from "./ChatMessage";
import { SyncLoader } from "react-spinners";
import {  useMessages } from "../hooks/useMessages";
import Loader from "../../shared/Loader";
import { useSelector } from "react-redux";

export default function ChatMessages() {
    const selectedChat = useSelector((state) => state.chats.selectedChatId);
  
  const { isChatTyping } = useConversations();
  const {
    messages,
    chatContainerRef,
    handleScroll,
    isLoadingOlderMessages,
    isLoadingNewerMessages,
    messagesLoading,
  } = useMessages();
  console.log("messages", messages);

  // const chatRef = useRef(null);

  // useEffect(() => {
  //   const el = chatContainerRef.current;
  //   if (!el) return;

  //   el.scrollTop = el.scrollHeight
  // }, [messages.length]);

  return (
    <div
     key={selectedChat}
      ref={chatContainerRef}
      onScroll={handleScroll}
      className={`dc-messages dc-verticalscrollbar dc-dashboardscrollbar ${messagesLoading ||isLoadingNewerMessages ? "loading" : ""}`}
    >
      <SyncLoader
        speedMultiplier={0.7}
        margin={4}
        className="typing-spinner"
        color="#7474749c"
        loading={isChatTyping}
        size={8}
      />
      {messagesLoading || isLoadingNewerMessages ? (
       Loader("messages")
      ) : (

        <>         
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const nextMessage = messages[index + 1];
            const prevMessage2 = messages[index - 1];
            // const nextMessage2 = messages[index - 1];

            const showAvatar =
              !prevMessage2 || prevMessage2?.isMine !== message.isMine;

            const isfirstInGroup =
              !nextMessage ||
              nextMessage.isMine !== message.isMine ||
              !isSameDay(
                new Date(message.sentAt),
                new Date(nextMessage.sentAt)
              );

            return (
                <ChatMessage
                key={`${message.chatId}-${message.id}`}
                  {...message}
                  status={message.status}
                  text={message.content}
                  type={message.isMine ? "sender" : "receiver"}
                  img={
                    showAvatar
                      ? message.isMine
                        ? "/images/avt/doctor-imge-avt.png"
                        : "/images/avt/patient-avt.png"
                      : null
                  }
                  showAvatar={showAvatar}
                  date={formatChatDate(message.sentAt)}
                  isIngroupAndNotTheLast={!showAvatar}
                  isfirstInGroup={isfirstInGroup}
                />         
            );
          })}
          {isLoadingOlderMessages && Loader("loading-in-chat")}
        </>
      )}
    </div>
  );
}

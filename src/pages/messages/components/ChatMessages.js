import { useEffect, useRef } from "react";
import { formatChatDate, formatDay, formatTime, formatTime12, isSameDay } from "../../shared/utils";
import { useConversations } from "../hooks/useConversations";
import ChatMessage from "./ChatMessage";
import { SyncLoader } from "react-spinners";
import { useMessages } from "../hooks/useMessages";

export default function ChatMessages() {
  const { Typing } = useConversations();
  const { messages ,chatContainerRef,handleScroll} = useMessages();

  // const chatRef = useRef(null);

  // useEffect(() => {
  //   const el = chatContainerRef.current;
  //   if (!el) return;

  //   el.scrollTop = el.scrollHeight
  // }, [messages.length]);

  return (
    <div
      ref={chatContainerRef}
      onScroll={handleScroll}
      className="dc-messages dc-verticalscrollbar dc-dashboardscrollbar"
    > 
    <SyncLoader speedMultiplier={0.7} margin={4} className="typing-spinner"   color="#7474749c" loading={Typing.isTyping===true} size={8} />

    {messages.map((message, index) => {
  const prevMessage = messages[index - 1];
  const nextMessage = messages[index + 1];
  const prevMessage2 = messages[index - 1];
  // const nextMessage2 = messages[index - 1];

  const showAvatar = !prevMessage2 || prevMessage2?.isMine !== message.isMine;

  const isfirstInGroup =
    !nextMessage || 
    nextMessage.isMine !== message.isMine || 
    !isSameDay(new Date(message.sentAt), new Date(nextMessage.sentAt));

  return (
    <div key={message.id}>
      <ChatMessage
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


    </div>
  );
})}
    </div>
  );
}

import { convertSrcPatientImg, formatChatDate, isSameDay } from "../../shared/utils";
import { useConversations } from "../hooks/useConversations";
import ChatMessage from "./ChatMessage";
import { SyncLoader } from "react-spinners";
import {  useMessages } from "../hooks/useMessages";
import Loader from "../../shared/Loader";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ErrorLoading from "../../shared/ErrorLoading";
import { useStep1PersonalInfo } from "../../doctor-registration/hooks/useStep1BasicInfo";

export default function ChatMessages() {
    const selectedChat = useSelector((state) => state.chats.selectedChatId);
  
  const { isChatTyping,setIsChatOpen,currentChat } = useConversations();
  const {
    messages,
    chatContainerRef,
    handleScroll,
    isLoadingOlderMessages,
    isLoadingNewerMessages,
    messagesLoading,
    resendMessage,
    isError,
    messagesIsError,
    refetchMessages,
  } = useMessages();

    const { doctorImageSrc } = useStep1PersonalInfo(false);

  useEffect(() => {
        if(window.innerWidth >= 992){
          setIsChatOpen(true)
        }
    return () => {
      document.documentElement.setAttribute("isConversationOpen", "false");
      setIsChatOpen(false)
      console.log("unmount");
    }
  }, [])
  
  if(messagesIsError && messages.length === 0){
    return <div style={{minHeight:"55vh"}}> <ErrorLoading isError={isError} refetch={refetchMessages} /></div>
  }


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
      { messagesLoading || isLoadingNewerMessages? (
      Loader("loading-in-side")
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
                        ? doctorImageSrc
                        : convertSrcPatientImg(currentChat?.imageUrl)
                      : null
                  }
                  showAvatar={showAvatar}
                  date={formatChatDate(message.sentAt)}
                  isIngroupAndNotTheLast={!showAvatar}
                  isfirstInGroup={isfirstInGroup}
                  message={message}
                  resendMessage={resendMessage}
                />         
            );
          })}
          {isLoadingOlderMessages && Loader("loading-in-side")}
          {messagesIsError && <h6 className="error-text" style={{height:"auto", margin:"10px 0",marginTop:"65px" ,textAlign:"center"}}>{"Error loading more messages"}</h6>}
        </>
      )}
    </div>
  );
}

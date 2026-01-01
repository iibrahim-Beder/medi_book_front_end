import { formatChatDate, formatTime } from "../../shared/utils";
import { useConversations } from "../hooks/useConversations";
import {  useSelector } from 'react-redux';
import { selectIsChatTyping } from '../slices/messagesSlice';

export default function ConversationItem({ id, img, name, lastMsg ,messeagesDotNotification ,lastMessageIsMine,isOnline, lastSeen,lastMessageTime,isLastMessageRead }) {
  const {changeChat ,selectedChat,setIsChatOpen} = useConversations();
  const active= (id===selectedChat)
  const istypingHere =  useSelector(selectIsChatTyping(id));
  return (
    
    <div onClick={() =>   {document.documentElement.setAttribute("isConversationOpen", "true"); changeChat(id);setIsChatOpen(true)} }
      className={`dc-ad dc-dotnotification `}
      //If there are no new messages, no notification will appear
        style={
    messeagesDotNotification !== undefined && messeagesDotNotification !== null
      ? { "--messages-dotnotification": `"${messeagesDotNotification>99?"99+":messeagesDotNotification}"` }
      : {}
  }

    >
      <div className={`dc-chat-item-content ${active ? "dc-active" : ""}`}>
      <figure className={` ${isOnline?"online": "" }`}>
        <img src={img} alt={name} />
      </figure>
      <div className="dc-adcontent">
        <h3> <span>{name}</span>  <span className={`${isOnline?"text-online ":""} text-lastseen `} > {isOnline ? "Online" : formatTime(lastSeen)}  </span></h3> 
        {istypingHere ? <span className="dc-typing">Typing...</span>:<span className={`text-ellipsis ${(!isLastMessageRead && !lastMessageIsMine )?"unread":"last-read"}`} style={{paddingRight:"18px"}} > {lastMessageIsMine && "you: "}{lastMsg}  <span className="dc-time">{formatChatDate(lastMessageTime)}</span>  </span>}
      </div>
    </div></div>
  );
}

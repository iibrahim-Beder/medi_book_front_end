import { formatChatDate, formatTime } from "../../shared/utils";
import { useConversations } from "../hooks/useConversations";

export default function ConversationItem({ id, img, name, lastMsg, active ,messeagesDotNotification ,lastMessageIsMine,isOnline, lastSeen,lastMessageTime}) {
  const {Typing ,changeChat} = useConversations();
  const istypingHere = Typing?.chatId === id && Typing?.isTyping === true;
  return (
    
    <div onClick={() =>   {document.documentElement.setAttribute("isConversationOpen", "true"); changeChat(id);  } }
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
        <h3>{name} {!isOnline &&formatTime(lastSeen)}</h3> 
        {istypingHere ? <span className="dc-typing">Typing...</span>:<span className="text-ellipsis"style={{paddingRight:"18px"}} > {lastMessageIsMine && "you: "}{lastMsg}  <span className="dc-time">{formatChatDate(lastMessageTime)}</span>  </span>}
      </div>
    </div></div>
  );
}

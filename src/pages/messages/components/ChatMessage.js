import { IoRefreshOutline } from "react-icons/io5";
import { useMessages } from "../hooks/useMessages";
const MessageStatus = [
  "Sent",
  "Delivered",
  "Read",
  "Failed",
  "Sending"
];
export default function ChatMessage({isIngroupAndNotTheLast, type, img, text, date ,status,isfirstInGroup,message}) {
  const msgClass =
    type === "sender" ? "dc-memessage dc-readmessage" : "dc-offerermessage";
    const{resendMessage} = useMessages();
  return (
    <div className={msgClass + (isIngroupAndNotTheLast ? " dc-ingroupmessage" : " dc-ingroupmessage-last" ) + (isfirstInGroup ? " dc-first-in-group" : " not-the-first" )}>
      { img && <figure>
        <img src={img} alt="user" />
      </figure>}
      <div className="dc-description">
        <p className="dc-messagecontent">
        {text}
      {date &&  <time className={`${MessageStatus[status]}`} >{date}</time>}
        
        </p>
        {  MessageStatus[status] === "Failed" && <button onClick={() => resendMessage(message)} className="Retry"><IoRefreshOutline /></button>}
      </div>
    </div>
  );
}

const MessageStatus = [
  "Sent",
  "Delivered",
  "Read",
  "Failed",
  "Sending"
];
export default function ChatMessage({isIngroupAndNotTheLast, type, img, text, date ,status,isfirstInGroup}) {
  const msgClass =
    type === "sender" ? "dc-memessage dc-readmessage" : "dc-offerermessage";

  return (
    <div className={msgClass + (isIngroupAndNotTheLast ? " dc-ingroupmessage" : " dc-ingroupmessage-last" ) + (isfirstInGroup ? " dc-first-in-group" : " not-the-first" )}>
      { img && <figure>
        <img src={img} alt="user" />
      </figure>}
      <div className="dc-description">
        <p className="dc-messagecontent">{text}
      {date &&  <time className={`${MessageStatus[status]}`} >{date}</time>}</p>
      </div>
    </div>
  );
}

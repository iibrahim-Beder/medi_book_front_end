export default function ConversationItem({ img, name, lastMsg, active ,messeagesDotNotification}) {
  return (
    
    <div onClick={() =>   document.documentElement.setAttribute("isConversationOpen", "true") }
      className={`dc-ad dc-dotnotification `}
      //If there are no new messages, no notification will appear
        style={
    messeagesDotNotification !== undefined && messeagesDotNotification !== null
      ? { "--messages-dotnotification": `"${messeagesDotNotification}"` }
      : {}
  }

    >
      <div className={`dc-chat-item-content ${active ? "dc-active" : ""}`}>
      <figure>
        <img src={img} alt={name} />
      </figure>
      <div className="dc-adcontent">
        <h3>{name}</h3>
        <span className="text-ellipsis"style={{paddingRight:"18px"}} >{lastMsg}</span>
      </div>
    </div></div>
  );
}
